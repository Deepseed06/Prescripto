import React from 'react'
import { useContext } from 'react'
import { useState } from 'react'
import {toast} from 'react-toastify'
import { AdminContext } from '../context/AdminContext'
import axios from 'axios'
import { DoctorContext } from '../context/DoctorContext'
const Login = () => {
    const [state, setState] = useState('Admin')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const {setAtoken, backendUrl} = useContext(AdminContext)
    const {setDToken} = useContext(DoctorContext)
    
    const onSubmitHandler = async(e) => {
        e.preventDefault()
        try {
            if(state === 'Admin'){
                const {data} = await axios.post(backendUrl + '/api/admin/login', {email,password})
                if(data.success){
                    localStorage.setItem('atoken',data.token )
                    setAtoken(data.token)
                }else{
                    toast.error(data.message)
                }
            }else{
                const {data} = await axios.post(backendUrl + '/api/doctor/login',{email,password})
              
                    if(data.success){
                        localStorage.setItem('dToken',data.token )
                        setDToken(data.token)
                    }else{
                        toast.error(data.message)
                    }
            }
        } catch (error) {
            
        }
    }

  return (
    <form onSubmit={onSubmitHandler} className='min-h-[80vh] flex items-center'>
        <div className='flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-[#5E5E5E] text-sm shadow-lg'>
            <p className='text-2xl font-semibold m-auto'><span className='text-primary'>{state}</span>Login </p>
            <div className='w-full'>
                <p>Email</p>
                <input className='border border-[#DADADA] rounded w-full p-2 mt-1' type="email" value={email} onChange={(e) => setEmail(e.target.value)}  required/>
            </div>
            <div className='w-full'>
                <p>Password</p>
                <input className='border border-[#DADADA] rounded w-full p-2 mt-1' type="password" value={password} onChange={(e) => setPassword(e.target.value)}  required/>
            </div>
            <button className='bg-primary text-white w-full py-2 rounded-md text-base'>Login</button>
            {
                state === 'Admin'
                ? <p>Doctor Login <span className='text-primary underline cursor-pointer' onClick={() => setState('Doctor')}>Click here</span></p>
                : <p>Admin Login <span className='text-primary underline cursor-pointer' onClick={() => setState('Admin')}>Click here</span></p>
            }
        </div>
    </form>
  )
}

export default Login