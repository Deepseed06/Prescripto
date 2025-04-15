import userModel from '../models/userModel.js';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import Razorpay from 'razorpay';
import jwt from 'jsonwebtoken';
import razorpay from 'razorpay'
import{v2 as cloudinary} from 'cloudinary'
import doctorModel from '../models/doctorModel.js';
import appointmentModel from '../models/appointmentModel.js';

const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.json({success:false, message: 'Please fill all fields' });
        }
        if (!validator.isEmail(email)) {
            return res.json({success:false, message: 'Please input your correct email' });
        }
        if (password.length < 8) {
            return res.json({success:false, message: 'Password must be at least 8 characters long' });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const userData = {
            name,
            email,
            password: hashedPassword,
        };
        const userExists = await userModel.findOne({ email });
        if (userExists) {
            return res.json({ message: 'User already exists' });
        }
       const newUser = new userModel(userData);
        const user = await newUser.save();
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        res.json({success:true, token });

    } catch (error) {
        console.error(error)
        res.json({ message: error.message });
    }
}


const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.json({success:false, message: 'Please fill all fields' });
        }
        if (!validator.isEmail(email)) {
            return res.json({success:false, message: 'Please fill all fields' });
        }
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.json({success:false, message: 'User does not exist' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.json({success:false, message: 'Invalid credentials' });
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        res.json({success:true, token });

    } catch (error) {
        console.error(error)
        res.json({ message: error.message });
    }
}


const getProfile = async (req, res) => {
    try {
        const {userId} = req
        console.log(userId)
        const user = await userModel.findById(userId).select('-password');
        res.json({success:true, user });

    } catch (error) {
        console.error(error)
        res.json({ message: error.message });
    }
}

const updateProfile = async (req, res) => {
    try {
        const {userId, name, phone, address, dob, gender} = req.body
        const imageFile = req.file
        if(!name || !phone || !dob || !gender){
            res.json({success:false, message: 'Missing Data'})
        }
        await userModel.findByIdAndUpdate(userId,{name, phone, address:JSON.parse(address),dob, gender})
        if(imageFile){
            const imageUpload = await cloudinary.uploader.upload(imageFile.path,{resource_type:'image'})
            const imageUrl = imageUpload.secure_url
            await userModel.findByIdAndUpdate(userId,{image:imageUrl})

        }
        res.json({success:true, message:'Profile Updated'})

    } catch (error) {
        console.error(error)
        res.json({success:false, message:error.message})
    }
    
}

const bookAppointment = async(req, res) => {
    try {
        const {docId, slotDate, slotTime} = req.body
        const {userId} = req
        const docData = await doctorModel.findById(docId).select('-password')
        if(!docData.available){
            return res.json({success:false, message:"Doctor not available"})
        }
        let slots_booked = docData.slots_booked

        if (!slotTime) {
            return res.json({ success: false, message: 'Please select a time' });
          }
        if(slots_booked[slotDate]){
           
            if(slots_booked[slotDate].includes(slotTime)){
                return res.json({success:false, message:"Slot not available"})   
            }else{
                slots_booked[slotDate].push(slotTime)
            }
        }else{
            slots_booked[slotDate] = []
            slots_booked[slotDate].push(slotTime)
        }
        const userData = await userModel.findById(userId).select('-password')

        delete docData.slots_booked

        const appointmentData = {
            userId,
            docId,
            userData,
            docData,
            amount:docData.fees,
            slotDate,
            slotTime,
            date: Date.now()
        }

        const newAppointment = new appointmentModel(appointmentData)
        newAppointment.save()

        await doctorModel.findByIdAndUpdate(docId,{slots_booked})
        res.json({success:true, message:'Appointment Booked!'})

    } catch (error) {
        console.error(error)
        res.json({success:false, message:error.message})
    }
}

const listAppointments = async(req, res) => {
try {
    const {userId} = req
    const appointments = await appointmentModel.find({userId})
    res.json({success:true, appointments})
} catch (error) {
    console.error(error)
    res.json({success:false, message:error.message})
    
}
}

const cancelAppointment = async(req, res) => {
    try {
        const {userId} = req
        const {appointmentId} = req.body
        const appointmentData = await appointmentModel.findById(appointmentId)
        if(!appointmentData){
            return res.json({success:false, message:'Appointment not found'})
        }
        if(appointmentData.userId.toString() !== userId){
            return res.json({success:false, message:'Unauthorized action'})
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

const razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
})
const paymentRazorPay = async(req, res) => {
    // res.json({success:false, message:'Payment failed'})
    
    try {
        const {appointmentId} = req.body
        const appointmentData = await appointmentModel.findById(appointmentId)
        if(!appointmentData || appointmentData.cancelled){
            return res.json({success:false, message:'Appointment Cancelled or not found'})
        }
        const {amount} = req.body
        const options = {
            amount: appointmentData.amount * 100,
            currency:process.env.CURRENCY,
            receipt: appointmentId,
        };
        const order = await instance.orders.create(options);
        console.log(order)
        res.json({success:true, order})
    } catch (error) {
        console.error(error)
        res.json({success:false, message:error.message})
    }
}


const verifyRazorPay = async(req, res) => {
    try {
        const {razorpay_order_id} = req.body
        const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id)

        console.log(orderInfo)
        if(orderInfo.status === 'paid'){
            await appointmentModel.findByIdAndUpdate(orderInfo.receipt,{payment:true})
            res.json({success:true, message:'Payment successful'})
        }else{
            res.json({success:false, message:'Payment failed'})
        }
    } catch (error) {
        console.error(error)
        res.json({success:false, message:error.message})
    }
}





export { registerUser, loginUser, getProfile, updateProfile, bookAppointment, listAppointments, cancelAppointment, paymentRazorPay, verifyRazorPay };