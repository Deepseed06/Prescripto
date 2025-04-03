import React from 'react'
import {assets} from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { useContext } from 'react'
import { AdminContext } from '../context/AdminContext'
const NavBar = () => {
    const navigate = useNavigate()
    const {aToken, setAtoken} = useContext(AdminContext)
    const logout = () => {
        navigate('/')
        aToken && setAtoken("")
        // console.log(atoken)
        aToken && localStorage.removeItem('atoken')
    }
  return (
    <div className='flex justify-between items-center border border-b bg-white sm:px-10 px-4 py-3'> 
        <div className='flex items-center gap-2 text-xs'>
            <img className='w-36 sm:w-40 cursor-pointer' src={assets.admin_logo} alt="" />
            <p className='border py-0.5 px-2.5 rounded-full border-gray-600 text-gray-600'>{aToken ? 'Admin':'Doctor'}</p>
        </div>
        <button onClick={logout} className='bg-primary text-white text-sm px-10 py-2 rounded-full'>Logout</button>
    </div>
  )
}

export default NavBar