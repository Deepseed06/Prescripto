import bcrypt from 'bcryptjs'
import doctorModel from '../models/doctorModel.js'
import jwt from 'jsonwebtoken'
import appointmentModel from '../models/appointmentModel.js'
const changeAvailability = async (req, res) => {
    try {
        const { doctorId } = req.body
        if (!doctorId) {
            return res.json({ success: false, message: 'Doctor ID is required' })
        }
        const doctor = await doctorModel.findById(doctorId)
      
        await doctorModel.findByIdAndUpdate(doctorId, { available: !doctor.available })
        res.json({ success: true, message: 'Availability changed successfully' })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const doctorList = async (req,res) => {
    try {
        const doctors = await doctorModel.find({}).select(["-password", "-email"])
        res.json({success:true, doctors})
    } catch (error) {
        console.log(error)
        res.json({success:false,message: error.message})   
    }
}

const loginDctor = async (req,res) => {
    try {
        const {email,password} = req.body
        if(!email || !password){
            return res.json({success:false,message:'All fields are required'})
        }
        const doctor = await doctorModel.findOne({email})
        if(!doctor){
            return res.json({success:false,message:'Invalid credentials'})
        }
        
        const isMatch = await bcrypt.compare(password,doctor.password)
        if(isMatch){
            const token = jwt.sign({id:doctor._id},process.env.JWT_SECRET)
            res.json({success:true,token})
        }else{
            return res.json({success:false,message:'Invalid credentials'})
        }

        
    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

const appointmentsDoctor = async(req, res) => {
    try {
        const {docId} = req
        const appointments = await appointmentModel.find({docId})
      
        res.json({success:true, appointments})
    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

const appointmentComplete = async(req, res) => {
    try {
        const {appointmentId} = req.body
        const {docId} = req
        const appointmentData = await appointmentModel.findById(appointmentId)

        if(appointmentData && appointmentData.docId === docId){
            await appointmentModel.findByIdAndUpdate(appointmentId, {isCompleted: true})
            return res.json({success:true, message:'Appointment Completed'})
        }else{
            return res.json({success:false, message:'Mark Failed'})
        }
    } catch (error) {

        console.log(error)
        res.json({success:false,message:error.message})
    }
}
const appointmentCancel = async(req, res) => {
    try {
        const { appointmentId} = req.body
        const {docId} = req
        const appointmentData = await appointmentModel.findById(appointmentId)

        if(appointmentData && appointmentData.docId === docId){
            await appointmentModel.findByIdAndUpdate(appointmentId, {cancelled: true})
            return res.json({success:true, message:'Appointment Cancelled'})
        }else{
            return res.json({success:false, message:'Cancel Failed'})
        }
    } catch (error) {

        console.log(error)
        res.json({success:false,message:error.message})
    }
}

const doctorDashboard = async (req, res) => {
    try {
        const { docId } = req
        const appointments = await appointmentModel.find({ docId })
        
        let earnings = 0

        appointments.map((item) => {
            if (item.isCompleted) {
                earnings += item.amount
            }
        })

        let patients = []
        appointments.map((item) => {
            if (!patients.includes(item.userId)) {
                patients.push(item.userId)
            }
        })

        const dashData = {
            earnings,
            patients: patients.length,
            appointments: appointments.length,
            latestAppointments: appointments.reverse().slice(0, 5)
        }

        res.json({ success: true, dashData })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}


const doctorProfile = async(req, res) => {
    try {
        
        const {docId} = req
        const profileData = await doctorModel.findById(docId).select('-password')
        res.json({success:true, profileData})

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}

const updateDoctorProfile = async(req, res) => {
    try {
        const {docId} = req
        const {fees, address, available} = req.body

        await doctorModel.findByIdAndUpdate(docId,{fees, address, available})
        res.json({success:true, message:'Profile Updated!'})
    } catch (error) {
        
    }
}

export {
    changeAvailability,
    doctorList, loginDctor, 
    appointmentsDoctor, appointmentCancel, 
    appointmentComplete,doctorDashboard,
    doctorProfile,updateDoctorProfile
}