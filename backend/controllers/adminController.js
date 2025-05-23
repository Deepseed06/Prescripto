import validator from 'validator'
import bcrypt from 'bcryptjs'
import doctorModel from '../models/doctorModel.js'
import appointmentModel from '../models/appointmentModel.js'
import {v2 as cloudinary} from 'cloudinary'
import jwt from 'jsonwebtoken'
import userModel from '../models/userModel.js'
// API for adding Doctor

const addDoctor = async(req, res) => {
try {
    const {
        name, 
        email, 
        password, 
        degree, 
        speciality, 
        experience, 
        about,fees, address,
    } = req.body

    const imageFile = req.file

    if(!name || !email || !password || !degree || !speciality || !experience || !about || !fees || !address){
        return res.json({success:false,message: 'All fields are required'})
    }
    
    if(!validator.isEmail(email)){
        return res.json({success:false,message: 'Please enter a valid Email'})
    }
    if(password.length < 8){
        return res.json({success:false,message: 'Please enter a strong password'})
    }
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)  

    const imageUpload = await cloudinary.uploader.upload(imageFile.path, {resource_type: 'image'})
    const imageUrl = imageUpload.secure_url
    const doctorData = {
        name,
        email,
        password: hashedPassword,
        degree,
        speciality,
        experience,
        about,
        fees,
        address:JSON.parse(address),
        image: imageUrl,
        date: Date.now()
    }
    const newDoctor = new doctorModel(doctorData);
    await newDoctor.save()
    res.json({success:true,message: 'Doctor added successfully'})
} catch (error) {
    console.log(error)
    res.json({success:false,message: error.message})
}
}

const loginAdmin = async(req, res) => {
    try {
        const {email, password} = req.body
        console.log(email, password)
        if(email===process.env.ADMIN_EMAIL && password===process.env.ADMIN_PASSWORD){
            const token = jwt.sign(email+password, process.env.JWT_SECRET)
            return res.json({success:true, token})
        }else{
            res.json({success:false,message: 'Invalid Credentials'})
        }
   
    } catch (error) {
        res.json({success:false,message: error.message})
    }
}



const allDoctors = async (req,res) => {
    try {
        const doctors = await doctorModel.find({}).select("-password")
        res.json({success:true, doctors})
    } catch (error) {
        console.log(error)
        res.json({success:false,message: error.message})   
    }
}

const appointmentsAdmin = async (req,res) => {
    try {
        const appointments = await appointmentModel.find({})
        res.json({success:true, appointments})
    } catch (error) {
        console.log(error)
        res.json({success:false,message: error.message})   
    }
}

const appointmentCancel = async(req, res) => {
    try {
        const {appointmentId} = req.body
        const appointmentData = await appointmentModel.findById(appointmentId)
        if(!appointmentData){
            return res.json({success:false, message:'Appointment not found'})
        }
      
        await appointmentModel.findByIdAndUpdate(appointmentId, {cancelled:true})
        const {docId, slotDate, slotTime} = appointmentData
        const docData = await doctorModel.findById(docId)
        let slots_booked = docData.slots_booked
        if(slots_booked[slotDate]){
            slots_booked[slotDate] = slots_booked[slotDate].filter((item) => item !== slotTime)
        }
        await doctorModel.findByIdAndUpdate(docId, {slots_booked})
        res.json({success:true, message:'Appointment cancelled successfully'})

    } catch (error) {
        console.error(error)
        res.json({success:false, message:error.message})
        
    }
}


const adminDashboard = async(req, res) =>{
    try {
        
        const doctors = await doctorModel.find({})
        const users = await userModel.find({})
        const appointments = await appointmentModel.find({})

        const dashData = {
            doctors: doctors.length,
            appointments: appointments.length,
            patients: users.length,
            latestAppointments: appointments.reverse().slice(0,5)
        }

        res.json({success:true, dashData})
    } catch (error) {
        console.error(error)
        res.json({success:false, message:error.message})
    }
}



export {addDoctor, loginAdmin, allDoctors, appointmentsAdmin, appointmentCancel, adminDashboard}