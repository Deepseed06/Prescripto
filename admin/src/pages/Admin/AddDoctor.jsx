import React from 'react'
import { assets } from '../../assets/assets'
import { useContext } from 'react'
import { AdminContext } from '../../context/AdminContext'
import { toast } from 'react-toastify'
import axios from 'axios'
const AddDoctor = () => {
    const [docImg, setDocImg] = React.useState(false)
    const [docName, setDocName] = React.useState('')
    const [docEmail, setDocEmail] = React.useState('')
    const [docPassword, setDocPassword] = React.useState('')
    const [docExperience, setDocExperience] = React.useState('1 Year')
    const [docFees, setDocFees] = React.useState('')
    const [docSpeciality, setDocSpeciality] = React.useState('General physician')
    const [docEducation, setDocEducation] = React.useState('')
    const [docAddress1, setDocAddress1] = React.useState('')
    const [docAddress2, setDocAddress2] = React.useState('')
    const [docAbout, setDocAbout] = React.useState('')

    const {backendUrl, aToken} = useContext(AdminContext)
    const onSubmitHandler = async(e) => {
        e.preventDefault();
        try {
            if(!docImg){
                return toast.error('Kindly upload doctor image')
            }
            const formData = new FormData()
            formData.append('image', docImg)
            formData.append('name', docName)
            formData.append('email', docEmail)
            formData.append('password', docPassword)
            formData.append('experience', docExperience)
            formData.append('fees', docFees)
            formData.append('speciality', docSpeciality)
            formData.append('about', docAbout)
            formData.append('degree', docEducation)
            formData.append('address', JSON.stringify([docAddress1, docAddress2]))

            formData.forEach((value, key) => {
                console.log(`${key} : ${value}`)
            })

            const {data} = await axios.post(backendUrl + '/api/admin/add-doctor', formData, {headers: {aToken}})
            if(data.success){
                toast.success(data.message)
                setDocImg(false)
                setDocName('')
                setDocEmail('')
                setDocPassword('')
                setDocExperience('1 Year')
                setDocFees('')
                setDocSpeciality('General physician')
                setDocEducation('')
                setDocAddress1('')
                setDocAddress2('')
                setDocAbout('')
            }else{
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }
  return (
    <form onSubmit={onSubmitHandler} className='m-5 w-full'>
        <p className='mb-3 font-medium text-lg'>Add Doctor</p>

        <div className='bg-white px-8 py-8 border w-full max-w-4xl max-h-[80vh] overflow-y-scroll'>
            <div className='flex items-center gap-4 mb-8 text-gray-500'> 
                <label htmlFor="doc-img"><img className='w-16 bg-gray-100 rounded-full cursor-pointer' src={docImg ? URL.createObjectURL(docImg) : assets.upload_area} alt="" /></label>
                <input onChange={(e) => setDocImg(e.target.files[0])} type="file"  id="doc-img" hidden/>
                <p>Upload doctor <br />picture</p>
            </div>

            <div className='flex flex-col gap-10 items-start text-gray-600 lg:flex-row'>
                <div className='flex flex-col lg:flex-1 gap-4 w-full'>
                    <div className='flex-1 flex-col gap-1 flex'>
                        <p>Doctor name</p>
                        <input onChange={(e) =>setDocName( e.target.value)} value={docName} className='border rounded px-3 py-2' type="text" placeholder='name' required />
                    </div>
                    <div className='flex-1 flex-col gap-1 flex'>
                        <p>Doctor Email</p>
                        <input onChange={(e) => setDocEmail(e.target.value)} value={docEmail} className='border rounded px-3 py-2' type="text" placeholder='email' required />
                    </div>
                    <div className='flex-1 flex-col gap-1 flex'>
                        <p>Doctor Password</p>
                        <input onChange={(e) => setDocPassword(e.target.value)} value={docPassword} className='border rounded px-3 py-2' type="password" placeholder='password' required />
                    </div>
                    <div className='flex-1 flex-col gap-1 flex'>
                        <p>Experience</p>
                       <select onChange={(e) => setDocExperience(e.target.value)} value={docExperience} className='border rounded px-3 py-2' >
                        <option value="1 Year">1 Year</option>
                        <option value="2 Years">2 Years</option>
                        <option value="3 Years">3 Years</option>
                        <option value="4 Years">4 Years</option>
                        <option value="5 Years">5 Years</option>
                        <option value="6 Years">6 Years</option>
                        <option value="7 Years">7 Years</option>
                        <option value="8 Years">8 Years</option>
                        <option value="9 Years">9 Years</option>
                        <option value="10 Years">10 Years</option>
                        <option value="">More than 10 years</option>
                       </select>
                    </div>

                    <div className='flex-1 flex-col gap-1 flex'>
                        <p>Fees</p>
                        <input onChange={(e) => setDocFees(e.target.value)} value={docFees} className='border rounded px-3 py-2' type="number" placeholder='fees' required />
                    </div>
                </div>
                
                <div className='w-full flex flex-col gap-4 lg:flex-1'> 
                <div className='flex-1 flex-col gap-1 flex'>
                    <p>Speciality</p>
                    <select name="" id="" onChange={(e) => setDocSpeciality(e.target.value)} value={docSpeciality}>
                        <option className='border rounded px-3 py-2' value="General physician">General physician</option>
                        <option value="Gynecologist">Gynecologist</option>
                        <option value="Dermatologist">Dermatologist</option>
                        <option value="Pediatricians">Pediatricians</option>
                        <option value="Neurologist">Neurologist</option>
                        <option value="Gastroenterologist">Gastroenterologist</option>
                       </select>
                </div>

                <div className='flex-1 flex-col gap-1 flex'>
                    <p>Education</p>
                    <input  onChange={(e) => setDocEducation(e.target.value)} value={docEducation} className='border rounded px-3 py-2' type="text" placeholder='Education' required />
                </div>

                <div className='flex-1 flex-col gap-1 flex'>
                    <p>Address</p>
                    <input  onChange={(e) => setDocAddress1(e.target.value)} value={docAddress1} className='border rounded px-3 py-2' type="text" placeholder='address 1' />
                    <input onChange={(e) => setDocAddress2(e.target.value)} value={docAddress2} className='border rounded px-3 py-2' type="text" placeholder='address 2' />
                </div>

                
            </div>
        </div>
                 <div className='flex-1 flex-col gap-1 flex'>
                    <p className='mt-4 mb-2'>About Doctor</p>
                    <textarea onChange={(e) => setDocAbout(e.target.value)} value={docAbout} className='w-full px-4 pt-2 border rounded'  placeholder='Write about Doctor' rows={5} required />
                </div>
                <button className='bg-primary mt-4 px-10 py-3 text-white rounded-full'>Add Doctor</button>
            </div>
    </form>
  )
}

export default AddDoctor