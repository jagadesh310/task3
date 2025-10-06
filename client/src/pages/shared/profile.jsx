import axios from 'axios'

import '../../App.css'
import { useState, useContext, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'

import { authContext } from '../../contexts/authContext.jsx'
import Loader from '../../components/loader.jsx'

   let BASE_URL = import.meta.env.VITE_SERVER_BASE_URL

export const Profile = () => {
  const navigate = useNavigate()
  const { user, setUser, logout, updateUser, setAuthMessage,setRefresh } =
    useContext(authContext)
  const [loading, setLoading] = useState(true)
  const [previewUrl, setPreviewUrl] = useState(null);

  console.log(user)

  const [mode, setMode] = useState('view')
  const [message, setMessage] = useState('')
  let [data, setData] = useState([])

  const [formData, setFormData] = useState({
    email: user.email,
    username: user.username,
  })

  const handleSubmit = () => {
    updateUser(formData)
  }

  const handleChange = e => {
    let { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  function handleFileChange(e) {
  const file = e.target.files?.[0];
  if (file) {
    console.log(file)
    setPreviewUrl(URL.createObjectURL(file));
   }
     const form = new FormData()
      form.append('image', file);

   axios.post(`${BASE_URL}/auth/uploadImage?id=${user._id}`, form, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }).then(res => {
        console.log(res);
      setUser(pre=>({...pre,profileImageUrl:res.data.url}))
})
}

  return (
    <div className='backgroundDiv min-h-screen'>
      <div className='container flex flex-col items-center gap-5'>
        <div className='header py-2 w-full flex items-center justify-between'>
          <span className='heading font-bold text-white text-[22px] md:text-[24px]'>
            Profile Details
          </span>
          <Link
            to='/login'
            className='logoutBtn btn font-medium text-white text-md md:text-lg xl:text-xl '
            onClick={() => {
              logout()
              setAuthMessage('Logout Successfully')
            }}
          >
            Logout
          </Link>
        </div>

        <form className='w-1/2 text-white flex flex-col min-w-[200px] justify-evenly items-start gap-4 border-2 border-[#636364] p-4'>
          
          <div className="profile flex justify-center items-center w-full ">

          <img
            src={previewUrl || user.profileImageUrl}
            alt="Profile"
            className="h-20 w-20 rounded-full self-center border-amber-50 border-2 "/>

          <label htmlFor="file" className='text-red relative text-2xl -top-8 -left-2 z-4'>🖉</label>

          <input
          id='file'
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
            />

          </div>

          <label
            htmlFor='role'
            className='text-white font-medium text-[18px] md:text-[20px]'
          >
            Role
          </label>
          <input
            type='text'
            name='role'
            id='role'
            disabled={true}
            className='rounded-lg p-2 pl-4 text-amber-100 text-[18px] md:text-[20px] bg-[#636364] border-[#636364] font-medium border-2 w-full focus:outline-none focus:border-white cursor-not-allowed'
            value={user.role}
          />

          <label
            htmlFor='email'
            className='text-white font-medium text-sm md:text-md lg:text-lg'
          >
            Email
          </label>
          <input
            type='email'
            id='email'
            name='email'
            disabled={true}
            className='rounded-lg p-2 pl-4 text-amber-100 bg-[#636364] border-[#636364] font-medium border-2 text-[18px] md:text-[20px] w-full focus:outline-none focus:border-white cursor-not-allowed'
            value={formData.email}
            onChange={handleChange}
          />

                    <label
            htmlFor='isVerified'
            className='text-white font-medium text-sm md:text-md lg:text-lg'
          >
            isVerified
          </label>
          <input
            type='text'
            id='isVerified'
            name='isVerified'
            disabled={true}
            className='rounded-lg p-2 pl-4 text-amber-100 bg-[#636364] border-[#636364] font-medium border-2 text-[18px] md:text-[20px] w-full focus:outline-none focus:border-white cursor-not-allowed'
            value= {user.isVerified}
          />
       
          <label
            htmlFor='username'
            className='text-white font-medium text-sm md:text-md lg:text-lg'
          >
            Username
          </label>
          <input
            type='text'
            name='username'
            id='username'
            placeholder='Enter username'
            disabled={mode === 'view'}
            className='rounded-lg p-2 pl-4 text-amber-100 border-[#636364] font-medium border-2 text-[18px] md:text-[20px] w-full focus:outline-none focus:border-white'
            value={formData.username}
            onChange={handleChange}
          />

          <span
            className='editBtn btn font-medium text-white text-md md:text-lg xl:text-xl self-center py-1 px-4'
            onClick={() => {
              console.log('clicked')
              if (mode === 'view') {
                setMode('edit')
              } else {
                setMode('view')
                handleSubmit()
              }
            }}
          >
            {mode === 'view' ? 'Edit' : 'Save'}
          </span>
        </form>

        <div className='footer flex w-full justify-between items-center'>
        </div>
      </div>
    </div>
  )
}
