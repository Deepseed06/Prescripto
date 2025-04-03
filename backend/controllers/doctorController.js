import doctorModel from '../models/doctorModel.js'

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

export {changeAvailability,doctorList}