import React from 'react'
import { assets } from '../assets/assets'

const Contact = () => {
  return (
    <div>
      <div className='text-center text-2xl pt-10 text-gray-500'>
        <p>CONTACT <span className='text-gray-700 font-medium'>US</span></p>
      </div>

      <div className='my-10 flex flex-col md:flex-row gap-10 justify-center mb-28 text-sm'>
        <img className='w-full md:max-w-[360px]' src={assets.contact_image} alt="" />
        <div className='flex flex-col gap-6 justify-center items-start'>
          <p className='font-semibold text-lg text-gray-600'>OUR OFFICE</p>
          <p className='text-gray-500'>4, Omo-akin Close <br />Off Afiliaka street, Haruna</p>
          <p className='text-gray-500'>Tel: (811) 655 4909 <br />Email: emekaamaechi0@gmail.com</p>
          <p className='font-semibold text-lg text-gray-600'>CAREERS AT PRESCRIPTION</p>
          <p className='text-gray-500'>learn more about our teams and job openings</p>
          <button className='border border-black py-4 px-8 text-sm hover:text-white hover:bg-black transition-all duration-500 '>Explore Jobs</button>
        </div>
      </div>
    </div>
  )
}

export default Contact