import express from 'express'
import { appointmentsDoctor, doctorList, loginDctor } from '../controllers/doctorController.js'
import authDoctor from '../middlewares/authDoctor.js'

const doctorRouter = express.Router()
doctorRouter.get('/list', doctorList)
doctorRouter.post('/login', loginDctor)
doctorRouter.get('/appointments',authDoctor, appointmentsDoctor)

export default doctorRouter