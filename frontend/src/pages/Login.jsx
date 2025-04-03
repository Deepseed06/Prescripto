import { useContext } from 'react';
import  { useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { AppContext } from '../context/AppContext';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate()
  const {backendUrl, token, setToken} = useContext(AppContext)
  const [state, setState ] = useState('Sign Up');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const onsubmitHandler = async(e) => {
    e.preventDefault();
    
    try {
      if(state === 'Sign Up'){
        const {data} = await axios.post(backendUrl + '/api/user/register', {name,password,email})
      if(data.success){
        localStorage.setItem('token', data.token)
        setToken(data.token)
      }else{
        toast.error(data.message)
      }
      }else{
        
        const {data} = await axios.post(backendUrl + '/api/user/login', {password,email})
        if(data.success){
          localStorage.setItem('token', data.token)
          setToken(data.token)
        }else{
          toast.error(data.message)
        }
      }
      
    } catch (error) {
     toast.error(error.message) 
    }
  }

  useEffect(() => { 
    if(token){
      navigate('/')
    }
  }, [token])

  return (
    <form onSubmit={onsubmitHandler} className='min-h-[80vh] flex items-center'>
      <div className='flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-zinc-600 text-sm shadow-lg'> 
        <p className='text-2xl font-semibold'>{state==='Sign Up' ? "Create Account":"Login"}</p>
        <p>Please {state==='Sign Up' ? "sign up":"log in"} to book appointment</p>
        {
          state === "Sign Up" &&  <div className='w-full'>
          <p>Full Name</p>
          <input className='w-full border border-zinc-300 rounded p-2 mt-1' type="text" onChange={(e) => setName(e.target.value)} value={name} />
        </div>
        }
       
        <div className='w-full'>
          <p>Email</p>
          <input className='w-full border border-zinc-300 rounded p-2 mt-1'  type="email" onChange={(e) => setEmail(e.target.value)} value={email} />
        </div>
        <div className='w-full' >
          <p>Password</p>
          <input className='w-full border border-zinc-300 rounded p-2 mt-1' type="password" onChange={(e) => setPassword(e.target.value)} value={password} />
        </div>
        <button type='submit' className='bg-primary text-white text-base rounded-md py-2 w-full '>{state==='Sign Up' ? "Create Account":"Login"}</button>
        {
          state === 'Sign Up' ? 
          <p>Already have an account? <span onClick={() => setState('Login')} className='text-primary underline cursor-pointer'>Login here</span></p> :
          <p>Create a new account? <span onClick={() => setState('Sign Up')} className='text-primary underline cursor-pointer'>click here</span></p>
        }
      </div>

    </form>
  )
}

export default Login