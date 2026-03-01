import React, { use } from 'react'
import { useNavigate } from 'react-router-dom'
import assets from '../assets/assets'

const ProfilePage = () => {
  const[selectedImg, setSelectedImg] = React.useState(null)
  const navigate = useNavigate()
  const [name, setName] = React.useState("David Laid")
  const [bio, setBio] = React.useState("I am David laid")
  const handelSubmit = async (e) => {
    e.preventDefault();
    navigate('/')}
  return (
    <div className='min-h-screen bg-cover bg-no-repeat flex items-center justify-center'>
      <div className='w-5/6 max-w-2xl backdrop-blur-2xl text-gray-300 border-2 border-gray-600 flex items-center justify-between max-sm:flex-col-reverse rounded-lg'>
        <form onSubmit={handelSubmit} className='flex flex-col gap-5 p-10 flex-1'>
          <h3 className='text-lg'> Profile Details</h3>
          <label htmlFor="avatar" className='flex items-center gap-3 cursor-pointer'>
            <input onChange={(e)=>setSelectedImg(e.target.files[0])} type="file" id='avatar' accept='.png, .jpg, .jpeg' hidden />
            <img src={selectedImg ? URL.createObjectURL(selectedImg) : assets.avatar_icon} alt="" className={`w-12 h-12 ${selectedImg && 'rounded-full'}`}/>
            upload profile picture
          </label>
          <input onChange={(e)=>setName(e.target.value)} value={name} type="text" required placeholder='your name' className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500' />
          <textarea onChange={(e)=>setBio(e.target.value)} value={bio} placeholder='write profile bio' required className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500' rows={4}></textarea>
          <button type='submit' className='bg-gradient-to-r from-violet-500 to-purple-500 text-white py-2 rounded-full text-lg cursor-pointer'>Save</button>
        </form>
        <img src={assets.logo_icon} className='max-w-44 aspect-square rounded-full mx-10 max-sm:-10' alt="" />
      </div>

    </div>
  )
}

export default ProfilePage