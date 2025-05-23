import { createContext } from "react";
import axios from "axios";
import { useState } from "react";
import { useEffect } from "react";
import {toast} from 'react-toastify'
export const AppContext = createContext()
const AppContextProvider = (props) => {
const [doctors, setDoctors] = useState([])
const [token, setToken] = useState(localStorage.getItem('token') ? localStorage.getItem('token') : false)
const [userData, setUserData] = useState(false)
const backendUrl = import.meta.env.VITE_BACKEND_URL
const currencySymbol = '$'

const getDoctorsData = async () => {
    try {
        const {data} = await axios.get(backendUrl + '/api/doctor/list')
        if(data.success){
            setDoctors(data.doctors)
        }else{
            toast.error(data.message)
        }
        
    } catch (error) {
        console.error(error)
        toast.error(error.message) 
    }
}

const loadUserProfileData = async() => {
    try {
        const {data} = await axios.get(backendUrl + '/api/user/get-profile',{headers:{token}})
        console.log(data)
        if(data.success){
            setUserData(data.user)
           
        }else{
            toast.error(data.message)
        }
        
    } catch (error) {
        console.log(error)
        toast.error(error.message)
        
    }
}


useEffect(() => {
    getDoctorsData()
}
, [])

useEffect(() => {
    if(token){
        loadUserProfileData()
    }else{
        setUserData(false)
    }
}
, [ token])
const value = {
    doctors,
    currencySymbol,
    token, setToken, backendUrl, 
    userData, setUserData, loadUserProfileData, getDoctorsData
}


return (
    <AppContext.Provider value={value}>
        {props.children}
    </AppContext.Provider>
)

}

export default AppContextProvider