import mongoose, { Schema } from 'mongoose'

const appointmentSchema = new Schema({
    userId: {type: String, required:true},
    docId: {type: String, required:true},
    slotDate: {type: String, required:true},
    slotTime: {type: String, required:true},
    userData: {type: Object, required:true},
    docData: {type: Object, required:true},
    amount: {type: Number, required:true},
    date: {type: String, required:true},
    cancelled: {type: Boolean, required:false},
    payment: {type: Boolean, required:false},
    isCompleted: {type: Boolean, required:false},

})

const appointmentModel = mongoose.models.appointment || mongoose.model('appointment',appointmentSchema)

export default appointmentModel