import { useState } from "react";
import { createContext } from "react";
import {toast} from 'react-toastify'
import axios from 'axios'

export const DoctorContext = createContext()

const DoctorContextProvider = (props) => {
    const [dToken, setDToken] = useState(localStorage.getItem('dToken') ? localStorage.getItem('dToken') : "")
    const [appointments, setAppointments] = useState([])
    const [dashData, setDashData] = useState(false)
    const [profileData, setProfileData] = useState(false)
    const backendUrl = import.meta.env.VITE_BACKEND_URL
  
    const getAppointments = async() => {
        try {
            const {data} = await axios.get(backendUrl + '/api/doctor/appointments',config)
            if(data.success){
                setAppointments(data.appointments)
                console.log(appointments)
            }else{
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const completeAppointment = async(appointmentId) => {
        try {
            const {data} = await axios.post(backendUrl + '/api/doctor/complete-appointments', {appointmentId}, config)
            if(data.success){
                toast.success(data.message)
                getAppointments()
            }else{
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const cancelAppointment = async(appointmentId) => {
        try {
            const {data} = await axios.post(backendUrl + '/api/doctor/cancel-appointments', {appointmentId}, config)
            if(data.success){
                toast.success(data.message)
                getAppointments()
            }else{
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const getDashBoardData = async() => {
        try {
            const {data} = await axios.get(backendUrl + '/api/doctor/dashboard', {headers:{dToken}})
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

    const getProfileData = async() => {
        try {
            const {data} = await axios.get(backendUrl + '/api/doctor/doctor-profile', {headers:{dToken}})
            if(data.success){
                setProfileData(data.profileData)

            }
        } catch (error) {
            toast.error(error.message)
        }
    }    

    const value = {
        setDToken, dToken, appointments, 
        setAppointments, backendUrl, 
        getAppointments,completeAppointment,
        cancelAppointment, dashData, 
        setDashData, getDashBoardData,
        profileData, setProfileData, getProfileData
    }
    return(
        <DoctorContext.Provider value={value}>
            {props.children}
        </DoctorContext.Provider>
    )

}

export default DoctorContextProvider;