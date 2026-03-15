// import React, { useEffect } from 'react'
// import assets, { messagesDummyData } from '../assets/assets'
// import { formatMessageTime } from '../lib/utils'
// import { useContext } from 'react'
// import { ChatContext } from '../../context/ChatContext'
// import { AuthContext } from '../../context/AuthContext'
// import { useState } from 'react'

// const CharContainer = () => {

//     const {messages ,selectedUser,setSelectedUser,sendMessage,getMessages} = useContext(ChatContext)
//     const {authUser,onlineUsers} = useContext(AuthContext)
//     const scrollEnd = React.useRef()

//     const [input,setInput] = useState('');

//     //handle send message
//     const handdleSendMessage = async(e)=>{
//         e.preventDefault();
//         if(input.trim() === "") return null;
//         await sendMessage({text: input.trim()});
//         setInput("")
//     }

//     // handle sending an image
//     const handleSendImage = async (e)=>{
//         const file = e.target.file[0];
//         if(!file || !file.type.startsWith("image/")){
//             toast.error("select an image file")
//             return;
//         }
//         const reader = new FileReader();

//         reader.onLoadend = async ()=>{
//             await sendMessage({image:reader.result})
//             e.target.value = ""
//         }
//         reader.readAsDataURL(file)
//     }

//     useEffect(()=>{
//         if(selectedUser){
//             getMessages(selectedUser._id)
//         }
//     },[selectedUser])

//     useEffect(()=>{
//         if(scrollEnd.current && messages){
//             scrollEnd.current.scrollIntoView({behavior:'smooth'})
//         }
//     },[messages])
//   return selectedUser ? (
//     <div className='h-full overflow-scroll relative backdrop-blur-lg'>
//         {/* header */}
//         <div className='flex items-center gap-3 py-3 mx-4 border-b border-stone-500'>
//             <img src={selectedUser.profilepic || assets.avatar_icon} alt="" className='w-8 rounded-full'/>
//             <p className='flex-1 text-lg text-white flex items-center gap-2'>
//                 {selectedUser.fullName}
//                 {onlineUsers.includes(selectedUser._id)}<span className='w-2 h-2 rounded-full bg-green-500'></span>
//             </p>
//             <img src={assets.arrow_icon} alt=""  className='md:hidden max-w-7' onClick={()=> setSelectedUser(null)}/>
//             <img src={assets.help_icon} alt="" className='max-md:hidden max-w-5' />
//         </div>
//         {/* chat area */}
//         <div className=' flex flex-col h-[calc(100%-120px)] overflow-y-scroll p-3 pb-6'>
//             {
//                 messages.map((msg, index)=>(
//                     <div key={index} className={`flex items-end gap-2 justify-end ${msg.senderId !==authUser._id && 'flex-row-reverse'}`}>
//                         {msg.image?(
//                             <img src={msg.image} alt="" className='max-w-[230px] rounded-lg overflow-hidden mb-8'/>
//                             ):(
//                                 <p className={`p-2 max-w-[200px] md:text-sm font-light rounded-lg mb-8 break-all bg-violet-500/30 text-white ${msg.senderId === authUser._id ? 'rounded-br-none' : 'rounded-bl-none'}`}>{msg.text}</p>
//                             )}
//                             <div className='text-center text-xs'>
//                                 <img src={msg.senderId === authUser._id ? authUser?.profilepic || assets.avatar_icon : selectedUser?.profilepic || assets.avatar_icon} alt="" className='w-7 rounded-full' />
//                                 <p className='text-gray-500'>{formatMessageTime(msg.createdAt)}</p>

//                             </div>
                        
//                     </div>
//                 ))
//             }
//                 <div ref={scrollEnd}></div>
//         </div>
//         {/* bottom area */}
//         <div className='absolute bottom-0 left-0 right-0 flex items-center gap-3 p-3'>
//             <div className='flex-1 flex items-center bg-green-100/12 px-3 rounded-full'>
//                 <input onChange={()=>setInput(e.target.value)} value={input} onKeyDown={(e)=>e.key === "enter"?handleSendMessage(e):null} type="text" placeholder='Send message' className='flex-1 text-sm p-3 border-none rounded-lg outline-none text-white placeholder-gray-400'/>
//                 <input onChange={handleSendImage} type="file" id='image' accept='image/png, image/jpeg' hidden/>
//                 <label htmlFor="image">
//                     <img src={assets.gallery_icon} className='w-5 mr-2 cursor-pointer' alt="" />
//                 </label>
//             </div>
//             <img src={handleSendMessage} className='w-7 cursor-pointer' alt="" />
//         </div>
//     </div>
//   ) :(
//     <div className='flex flex-col items-center justify-center gap-2 text-green-500 bg-white/10 max-md:hidden'>
//         <img src={assets.logo_icon} className='max-w-16' alt="" />
//         <p className='text-white text-lg font-medium'>chat anytime, anywhere</p>
//     </div>
//   )
// }

// export default CharContainer


import React, { useEffect, useContext, useState, useRef } from 'react'
import assets from '../assets/assets'
import { formatMessageTime } from '../lib/utils'
import { ChatContext } from '../../context/ChatContext'
import { AuthContext } from '../../context/AuthContext'
import toast from 'react-hot-toast'

const CharContainer = () => {
    const { messages, selectedUser, setSelectedUser, sendMessage, getMessages } = useContext(ChatContext)
    const { authUser, onlineUsers } = useContext(AuthContext)
    const scrollEnd = useRef()
    const [input, setInput] = useState('');

    const handdleSendMessage = async (e) => {
        if (e) e.preventDefault();
        if (input.trim() === "") return;
        await sendMessage({ text: input.trim() });
        setInput("");
    }

    const handleSendImage = async (e) => {
        const file = e.target.files[0]; // Fixed: was .file
        if (!file || !file.type.startsWith("image/")) {
            toast.error("Please select an image file")
            return;
        }
        const reader = new FileReader();
        reader.onloadend = async () => { // Fixed: case sensitive
            await sendMessage({ image: reader.result })
            e.target.value = ""
        }
        reader.readAsDataURL(file)
    }

    useEffect(() => {
        if (selectedUser) getMessages(selectedUser._id)
    }, [selectedUser])

    useEffect(() => {
        if (scrollEnd.current && messages) {
            scrollEnd.current.scrollIntoView({ behavior: 'smooth' })
        }
    }, [messages])

    return selectedUser ? (
        <div className='h-full flex flex-col relative backdrop-blur-lg'>
            {/* header */}
            <div className='flex items-center gap-3 py-3 mx-4 border-b border-stone-500'>
                <img src={selectedUser.profilepic || assets.avatar_icon} alt="" className='w-8 rounded-full' />
                <div className='flex-1 text-lg text-white flex items-center gap-2'>
                    {selectedUser.fullName}
                    {onlineUsers.includes(selectedUser._id) && <span className='w-2 h-2 rounded-full bg-green-500'></span>}
                </div>
                <img src={assets.arrow_icon} alt="" className='md:hidden max-w-7 cursor-pointer' onClick={() => setSelectedUser(null)} />
                <img src={assets.help_icon} alt="" className='max-md:hidden max-w-5' />
            </div>

            {/* chat area */}
            <div className='flex-1 overflow-y-scroll p-3 pb-6'>
                {messages.map((msg, index) => (
                    <div key={index} className={`flex items-end gap-2 mb-4 ${msg.senderId === authUser._id ? 'justify-end' : 'flex-row-reverse justify-end'}`}>
                        <div className='flex flex-col items-center text-xs'>
                            <img src={msg.senderId === authUser._id ? (authUser?.profilepic || assets.avatar_icon) : (selectedUser?.profilepic || assets.avatar_icon)} alt="" className='w-7 rounded-full' />
                            <p className='text-gray-500'>{formatMessageTime(msg.createdAt)}</p>
                        </div>
                        {msg.image ? (
                            <img src={msg.image} alt="" className='max-w-[230px] rounded-lg overflow-hidden' />
                        ) : (
                            <p className={`p-2 max-w-[200px] md:text-sm font-light rounded-lg break-all text-white ${msg.senderId === authUser._id ? 'bg-violet-600 rounded-br-none' : 'bg-zinc-800 rounded-bl-none'}`}>
                                {msg.text}
                            </p>
                        )}
                    </div>
                ))}
                <div ref={scrollEnd}></div>
            </div>

            {/* bottom area */}
            <form onSubmit={handdleSendMessage} className='p-3 flex items-center gap-3'>
                <div className='flex-1 flex items-center bg-[#282142] px-3 rounded-full'>
                    <input 
                        onChange={(e) => setInput(e.target.value)} 
                        value={input} 
                        type="text" 
                        placeholder='Send message' 
                        className='flex-1 text-sm p-3 bg-transparent border-none outline-none text-white'
                    />
                    <input onChange={handleSendImage} type="file" id='image' accept='image/*' hidden />
                    <label htmlFor="image">
                        <img src={assets.gallery_icon} className='w-5 mr-2 cursor-pointer opacity-70 hover:opacity-100' alt="" />
                    </label>
                </div>
                <button type="submit" className='bg-transparent border-none'>
                    <img src={assets.send_icon || assets.arrow_icon} className='w-7 cursor-pointer' alt="send" />
                </button>
            </form>
        </div>
    ) : (
        <div className='h-full flex flex-col items-center justify-center gap-2 text-green-500 bg-white/5 max-md:hidden'>
            <img src={assets.logo} className='max-w-16 opacity-50' alt="" />
            <p className='text-white text-lg font-medium opacity-50'>Chat anytime, anywhere</p>
        </div>
    )
}

export default CharContainer
