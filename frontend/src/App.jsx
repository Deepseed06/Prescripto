import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Login from './pages/Login'
import MyProfile from './pages/MyProfile'
import MyAppointments from './pages/MyAppointments'
import Appointments from './pages/Appointments'
import Home from './pages/Home'
import About from './pages/About'
import Doctors from './pages/Doctors'
import NavBar from './components/NavBar'
import Contact from './pages/Contact'
import Footer from './components/Footer'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/ReactToastify.css'
const App = () => {
  return (
    <div className='mx-3 sm:mx-[7%]'>
      <ToastContainer/>
      <NavBar/>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/about' element={<About />} />
        <Route path='/doctors' element={<Doctors />} />
        <Route path='/doctors/:speciality' element={<Doctors />} />
        <Route path='/contact' element={<Contact/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/my-profile' element={<MyProfile/>}/>
        <Route path='/my-appointments' element={<MyAppointments/>}/>
        <Route path='/appointments/:docId' element={<Appointments/>}/>

      </Routes>
    <Footer/>
    </div>
  )
}

export default App