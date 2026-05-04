import express, { response } from 'express';
import cors from 'cors';
import "dotenv/config";
import http from 'http';
import {connectDB} from './lib/db.js';
import userRouter from './routes/userRoutes.js';
import messageRouter from './routes/messageroutes.js';
import { Server } from 'socket.io';

//create express app and http server
const app = express();
const server = http.createServer(app);

//initialize socket.io server
export const io = new Server(server, {
    cors: {
        origin: "*"
    }
});

//store online users
export const userSocketMap = {}; // { userId:socketId }

//socket.io connection handler
io.on("connection",(socket)=>{
    console.log("A user connected: "+socket.id);
    const userId = socket.handshake.query.userId;
    console.log("User connected : ", userId); 

    if(userId) userSocketMap[userId] = socket.id;

    //emit online users to all connected clients
    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("disconnect",()=>{
        console.log("A user disconnected: "+socket.id);
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });

    });
    
//middleware setup
app.use(express.json({limit: '10mb'}));
app.use(cors());

//connect to the database
connectDB();

//routes setup
app.use('/api/status', (req, res) => res.send('Server is running'));
app.use('/api/auth',userRouter);
app.use('/api/messages',messageRouter);


if(process.env.NODE_ENV === 'production') {
    
    const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
}
export default server;