import { useState } from "react";
import { createContext } from "react";
import axios from 'axios'
import {toast} from 'react-toastify'

export const AdminContext = createContext()

const AdminContextProvider = (props) => {

    const [aToken, setAtoken] = useState(localStorage.getItem('atoken') ? localStorage.getItem('atoken') : "")
    const [doctors, setDoctors] = useState([])
    const [appointments, setAppointments] = useState([])
    const [dashData, setDashData] = useState(false)
    
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

    const getAllAppointment = async() => {
        try {
            const {data} = await axios.get(backendUrl + '/api/admin/appointments',{headers:{aToken}})
            if(data.success){
                setAppointments(data.appointments)
            }else{
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
        
    }

    const cancelAppointment = async(appointmentId) => {
        try {
            const {data} = await axios.post(backendUrl + '/api/admin/cancel-appointment', {appointmentId}, {headers:{aToken}})
            if(data.success){
                toast.success(data.message)
                getAllAppointment()
            }else{
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const getDashData  = async() => {
        try {
            const {data} = await axios.get(backendUrl+'/api/admin/dashboard', {headers:{aToken}})
            if(data.success){
                setDashData(data.dashData)
                console.log(data.dashData)
            }else{
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const value = {
        aToken, setAtoken,backendUrl, 
        getAllDoctors,doctors,changeDoctorAvailability,
        getAllAppointment,appointments, setAppointments, cancelAppointment,
        dashData, getDashData
    }
    return(
        <AdminContext.Provider value={value}>
            {props.children}
        </AdminContext.Provider>
    )

}

export default AdminContextProvider;