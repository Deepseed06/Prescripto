import { useState } from "react";
import { createContext } from "react";
import axios from 'axios'
import {toast} from 'react-toastify'

export const AdminContext = createContext()

const AdminContextProvider = (props) => {

    const [aToken, setAtoken] = useState(localStorage.getItem('atoken') ? localStorage.getItem('atoken') : "")
    const [doctors, setDoctors] = useState([])
    
    const backendUrl = import.meta.env.VITE_BACKEND_URL

    const getAllDoctors = async() => {
        try {
            const {data} = await axios.post(backendUrl + '/api/admin/all-doctors', {},{headers:{aToken}})
            if(data.success){
                setDoctors(data.doctors)
                
            }else{
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
        
    }

    const changeDoctorAvailability = async(doctorId) => {
        try {
            const {data} = await axios.post(backendUrl + '/api/admin/change-availability', {doctorId}, {headers:{aToken}})
            if(data.success){
                toast.success(data.message)
                getAllDoctors()
            }else{
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const value = {
        aToken, setAtoken,backendUrl, 
        getAllDoctors,doctors,changeDoctorAvailability
    }
    return(
        <AdminContext.Provider value={value}>
            {props.children}
        </AdminContext.Provider>
    )

}

export default AdminContextProvider;