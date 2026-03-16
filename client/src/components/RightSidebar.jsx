import React, { useContext, useEffect, useState } from 'react'
import assets from '../assets/assets'
import { ChatContext } from '../../context/ChatContext'
import { AuthContext } from '../../context/AuthContext'

const RightSidebar = () => {
    const { selectedUser, messages } = useContext(ChatContext)
    const { logout, onlineUsers } = useContext(AuthContext)
    const [msgImages, setMsgImages] = useState([])

    // Correctly filter and flatten images from the message array
    useEffect(() => {
        if (messages) {
            const images = messages
                .filter(msg => msg.image) // Only messages with an image property
                .map(msg => msg.image);   // Extract the image URL
            setMsgImages(images);
        }
    }, [messages])

    return selectedUser && (
        <div className={`bg-[#8185b2]/10 text-white w-full relative overflow-y-scroll ${selectedUser ? 'max-md:hidden' : ''}`}>
            
            <div className='pt-16 flex flex-col items-center gap-2 text-xs font-light mx-auto'>
                <img src={selectedUser?.profilePic || assets.avatar_icon} className='w-20 aspect-square rounded-full object-cover' alt="" />
                <h1 className='px-10 text-xl font-medium mx-auto flex items-center gap-2'>
                    {onlineUsers.includes(selectedUser._id) && <span className='w-2 h-2 rounded-full bg-green-500'></span>}
                    {selectedUser.fullName}
                </h1>
                <p className='px-10 mx-auto text-center'>{selectedUser.bio}</p>
            </div>

            <hr className='border-[#ffffff50] my-4' />
            
            <div className='px-5 text-xs'>
                <p className='mb-2 opacity-60'>Media</p>
                <div className='max-h-[200px] overflow-y-auto grid grid-cols-3 gap-2'>
                    {msgImages.map((url, index) => (
                        <img 
                            key={index} 
                            src={url} 
                            onClick={() => window.open(url)} 
                            className='w-full aspect-square object-cover rounded cursor-pointer hover:opacity-80 transition' 
                            alt="shared" 
                        />
                    ))}
                </div>
            </div>

            <div className='flex justify-center mt-10 pb-5'>
                <button 
                    onClick={() => logout()} 
                    className='bg-gradient-to-r from-purple-400 to-violet-600 text-white text-sm font-light px-10 py-2 rounded-full cursor-pointer hover:scale-105 transition-transform'
                >
                    Logout
                </button>
            </div>
        </div>
    )
}

export default RightSidebar
