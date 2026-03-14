import React, { useContext } from 'react'
import assets from '../assets/assets'
import { AuthContext } from '../../context/AuthContext'

const LoginPage = () => {
    const [currState , setCurrState] = React.useState('Sign up')
    const [fullName , setFullName] = React.useState('')
    const [email , setEmail] = React.useState('')
    const [password , setPassword] = React.useState('')
    const [bio , setBio] = React.useState('')
    const [isDataSubmitted , setIsDataSubmitted] = React.useState(false)

    const {login} = useContext(AuthContext)

    const onsubmitHandler = (event) => {
      event.preventDefault();
      if(currState === 'Sign up' && !isDataSubmitted){
        setIsDataSubmitted(true)
        return;
      }

      login(currState === "Sign up" ? 'signup':'login',{fullName,email,password,bio })

      }
  return (
    <div className='min-h-screen bg-cover bg-center flex items-center justify-center gap-8 sm:justify-evenly max-sm:flex-col backdrop-blur-2xl'>
      {/* left   */}
      <img src={assets.logo_big} className='w-[min(30vw,250px)]' alt="" />
      {/* right */}

      <form onSubmit={onsubmitHandler} className='border-2 bg-white/8 text-white border-gray-500 p-6 flex flex-col gap-6 rounded-lg shadow-lg' action="">
        <h2 className='font-medium text-2xl flex justify-between items-center'>
            {currState}
            {isDataSubmitted && <img onClick={()=>setIsDataSubmitted(false)} src={assets.arrow_icon} className='w-5 cursor-pointer' alt="" />}
            </h2>
          {currState === 'Sign up' && !isDataSubmitted && (
              <input onChange={(e)=>setFullName(e.target.value)}value={fullName}
              type="text" className='p-2  border border-gray-500 rounded-md focus:outline-none' placeholder='Full  Name'required/>
          )}

          {!isDataSubmitted && (
            <>
            <input onChange={(e)=>setEmail(e.target.value)}value={email}
            type="text" placeholder='Email Adress' required className='p-2  border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500' />
            <input onChange={(e)=>setPassword(e.target.value)}value={password}
            type="password" placeholder='Password' required className='p-2  border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500' />
          </>
          )}
          {
            currState === 'Sign up' && isDataSubmitted && (
              <textarea onChange={(e)=>setBio(e.target.value)}value={bio} rows={4} className='p-2  border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500' placeholder='provide a sort bio...'></textarea>
          )}
          <button type='submit' className='py-3 bg-gradient-to-r from-purple-400 to-violet-600 text-white rounded-md cursor-pointer'>
            {currState === 'Sign up' ? 'Create Account' : 'Login now'}
          </button>

          <div className=' flex items-center gap-2 text-sm text-gray-500'>
            <input type="checkbox" />
            <p>agree to terms of use & privacy policy</p>
          </div>
          <div>
            {currState === 'Sign up' ? (
              <p className='text-sm text-gray-600'>Already have an account? <span onClick={()=>{setCurrState('Login'); setIsDataSubmitted(false)}} className='font-medium text-violet-500 cursor-pointer'>Login here</span></p>
            ) : (
              <p className='text-sm text-gray-600'>Create account <span onClick={()=>setCurrState('Sign up')} className='font-medium text-violet-500 cursor-pointer'>Sign up</span></p>
            )}
          </div>
            
      </form>
    </div>
  )
}

export default LoginPage