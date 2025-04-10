import express from 'express'
import { appointmentCancel, appointmentComplete, appointmentsDoctor, doctorDashboard, doctorList, doctorProfile, loginDctor, updateDoctorProfile } from '../controllers/doctorController.js'
import authDoctor from '../middlewares/authDoctor.js'

const doctorRouter = express.Router()
doctorRouter.get('/list', doctorList)
doctorRouter.post('/login', loginDctor)
doctorRouter.get('/appointments',authDoctor, appointmentsDoctor)
doctorRouter.post('/complete-appointments',authDoctor, appointmentComplete)
doctorRouter.post('/cancel-appointments',authDoctor, appointmentCancel)
doctorRouter.get('/dashboard',authDoctor, doctorDashboard)
doctorRouter.get('/doctor-profile',authDoctor, doctorProfile)
doctorRouter.post('/update-profile',authDoctor, updateDoctorProfile)


export default doctorRouter