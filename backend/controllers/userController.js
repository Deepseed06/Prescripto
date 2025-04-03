import userModel from '../models/userModel.js';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
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
        const {userId} = req.body
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
        const {userId, docId, slotDate, slotTime} = req.body
        const docData = await doctorModel.findById(docId).select('-password')
        if(!docData.available){
            return res.json({success:false, message:"Doctor not available"})
        }
        let slots_booked = docData.slots_booked

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

export { registerUser, loginUser, getProfile, updateProfile, bookAppointment };