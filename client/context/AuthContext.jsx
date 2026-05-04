import { createContext, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const backendURL = import.meta.env.VITE_BACKEND_URL;
axios.defaults.baseURL = backendURL;

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const [token, setToken] = useState(localStorage.getItem("token") || null);
    const [authUser, setAuthUser] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [socket, setSocket] = useState(null);

    // Check authentication
    const checkAuth = async () => {
        try {
            const { data } = await axios.get("/api/auth/check-auth");

            if (data.success) {
                setAuthUser(data.user);
                connectSocket(data.user);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    // Login / Signup
    const login = async (state, credentials) => {
        try {
            const { data } = await axios.post(`/api/auth/${state}`, credentials);

            if (data.success) {

                const user = data.userData || data.user;

                setAuthUser(user);
                connectSocket(user);

                setToken(data.token);
                localStorage.setItem("token", data.token);

                // ✅ Correct Authorization header
                axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;

                toast.success(data.message);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    // Logout
    const logout = () => {

        localStorage.removeItem("token");

        setToken(null);
        setAuthUser(null);
        setOnlineUsers([]);

        // remove auth header
        delete axios.defaults.headers.common["Authorization"];

        if (socket) socket.disconnect();

        toast.success("Logged out successfully");
    };

    // Update Profile
    const updateProfile = async (body) => {
        try {
            const { data } = await axios.put("/api/auth/update-profile", body);

            if (data.success) {
                setAuthUser(data.updatedUser);
                toast.success("Profile updated successfully");
                return true;
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
            return false;
        }
    };

    

    // Connect socket
    const connectSocket = (userData) => {

        if (!userData || socket?.connected) return;

        const newSocket = io(backendURL, {
            query: {
                userId: userData._id
            }
        });

        newSocket.connect();
        setSocket(newSocket);

        newSocket.on("getOnlineUsers", (userIds) => {
            setOnlineUsers(userIds);
        });
    };

    useEffect(() => {

        if (token) {
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        }

        checkAuth();

    }, []);

    const value = {
        axios,
        token,
        authUser,
        onlineUsers,
        socket,
        login,
        logout,
        updateProfile
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
