import axios from 'axios'
import "../../App.css"

import { useState, useContext, useEffect } from 'react'
import {Navigate, useLocation, Link,useNavigate } from 'react-router-dom'


import { FaRegEye } from "react-icons/fa";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import { IoIosEyeOff } from "react-icons/io";
import { FaGoogle } from "react-icons/fa6";
import { SiDash } from "react-icons/si";

import { authContext } from '../../contexts/authContext'

let BASE_URL = import.meta.env.VITE_SERVER_BASE_URL
import { ForgotPassword } from './forgotPassword';

export function Login() {
  const { user, setUser,login,authMessage } = useContext(authContext);
  const [message, setMessage] = useState('');
  const roles = ['admin', 'client', 'vendor'];
  let [show,setShow] = useState(false)

const params = new URLSearchParams(window.location.search);
const token = params.get('token');


useEffect(()=>{
if(token){
  localStorage.setItem('token',token);
  window.location.href = 'http://localhost:5173/login'
}
},[])



  const navigate = useNavigate();
  const location = useLocation();

  let from = location.state?.from || '/';

    console.log(from)


  const [formData, setFormData] = useState({
    role: 'client',
    email: '',
    password: ''
  })

  const handleSubmit = event => {
    event.preventDefault();
    axios
      .post(`${BASE_URL}/auth/login`, formData)
      .then(res => {
        if (res.data.token) {
          if(res.data.user.isSuspended){alert('your account got suspended')}
          else{
          setUser(res.data.user)
          localStorage.setItem('token', res.data.token);
          setMessage(res.data.message);
          if(formData.role !== 'client'){
            console.log(formData.role)
            navigate(`/${formData.role}/`,{replace:true})
            return;
          } else{
          console.log(from)
          navigate(from,{replace:true})
          return;
          }
          }
        }
      })
      .catch(err => {console.log(err);toast.error(err.response.data.message);})
  }

  const googleLogin = () => {
  const CLIENT_ID = '486170631932-5s4abs9lgv958ptc06ho5705r50i2ccb.apps.googleusercontent.com';
  const REDIRECT_URI = 'http://localhost:5000/auth/google/callback';
  const SCOPE = 'openid email profile';
  const RESPONSE_TYPE = 'code';

  const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?response_type=${RESPONSE_TYPE}&client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=${encodeURIComponent(SCOPE)}`;

  window.location.href = googleAuthUrl;
};

  const dauthLogin = () => {
  const CLIENT_ID = 'lAOrfPy9uph9nGYe';
  const REDIRECT_URI = 'http://localhost:5000/auth/dauth/callback';
  const SCOPE = 'email+user+profile+openid';
  const RESPONSE_TYPE = 'code';

  const dauthUrl = `https://auth.delta.nitt.edu/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&grant_type=authorization_code&state=sdafsdghb&scope=${encodeURIComponent(SCOPE)}&nonce=bscsbascbadcsbasccabs`;

  window.location.href = dauthUrl;
};


  const handleChange = e => {
    let { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

    if(user) {
    return <Navigate to ={from} replace/>}

   return (
     <div className='bg-black w-screen h-screen flex justify-center items-center overflow-hidden'>
      <div className='overflow-hidden bg-[#F8F8F8] min-w-[350px] max-w-[400px] w-[85%] rounded-2xl px-4 py-4 flex flex-col items-center justify-evenly shadow-blue-200 shadow-lg gap-3 neon-border'>
        <div className='usersContainer flex flex-row justify-around items-center rounded-xl p-1 px-1 w-3/4 border-2 border-[#929090]'>
          {roles.map(roleOption => (
            <span
              key={roleOption}
              className={`role rounded-xl text-[16px] md:text-[18px] font-medium p-1 md:px-1 cursor-pointer ${
                formData.role === roleOption ? 'bg-[#ff3333]' : 'bg-transparent'
              }`}
              onClick={() =>
                setFormData(prev => ({ ...prev, role: roleOption }))
              }
            >
              {roleOption.charAt(0).toUpperCase() + roleOption.slice(1)}
            </span>
            
          ))}
        </div>

                <ToastContainer/> 

        <div className='context flex flex-col justify-between items-center text-black'>
          <h1 className='welcomeBack text-[#0092cc] text-[18px] md:text-[20px] font-semibold'>
            Welcome Back
          </h1>
          <h3 className='enterDetails text-black text-[16px] md:text-[17px] font-medium'>
            Please enter your details.
          </h3>
        </div>

        <form
          className='w-[70%] flex flex-col min-w-[200px] justify-evenly items-start gap-2 font-medium text-[12px]'
          onSubmit={handleSubmit}
        >
          <label htmlFor='email' className='text-black font-medium text-[12px]'>
            Email
          </label>
          <input
            type='email'
            id='email'
            name='email'
            placeholder='Enter your email'
            className='rounded-lg p-1 pt-2 pl-3 text-[#636364] font-medium border-2 w-full focus:outline-none text-[12px]'
            value={formData.email}
            onChange={handleChange}
          />


          <label
            htmlFor='password'
            className='text-black font-medium text-[12px]'
          >
            Password
          </label>
          <input
            type='password'
            id='password'
            name='password'
            placeholder='*************'
          
            required
            className='rounded-lg p-1 text-[#636364] font-normal border-2 w-full pl-3 pt-2 focus:outline-none mb-3 text-[12px]'
            value={formData.password}
            onChange={handleChange}
          />

          <div
            className={`response w-full text-center text-[#EA454c] font-medium ${
              message ? 'block' : 'none'
            }`}
          >
            {message}
          </div>

          <Link to='/ForgotPassword'
            className={`response w-full text-center text-[#EA454c] font-medium `}>
            Forgot Password?
          </Link>

        <ToastContainer/>
          <button type='submit'
            className='login w-[100%] text-white font-medium py-1 text-[13px] bg-[#ff3333] rounded-xl border-[#636364] border-2'
          >
            Login
          </button>

        </form>

        <div className=" justify-center items-center">
  <span>OR</span>
</div>

            <button className='googleContainer w-[100%] h-8 text-black font-normal text-lg bg-transparent flex justify-center items-center cursor-pointer'>
            <div className='googleBox flex flex-row align-center gap-6'>
              <FaGoogle className='hover:text-black hover:bg-white bg-black p-2 text-white size-10 transition-all duration-100 ease-linear rounded-full border-1 border-[#636363] hover:border-black' onClick={googleLogin}>
              </FaGoogle>
              <SiDash className='hover:text-black hover:bg-white bg-black text-white size-10 p-2 transition-all duration-100 ease-linear rounded-full border-1 border-[#636363] hover:border-black' onClick={dauthLogin}>
              </SiDash >
            </div>
          </button>

          <div className='lastcontainer w-full items-center justify-center flex flex-col'>
            <span className='donthaveaccount text-[#636364] font-medium text-[13px]'>
              Don't have a account? <Link
              to={'/signup'}
              className='text-[#EA454c] font-bold text-[13px]'
            >
              SignUp for free!
            </Link>
            </span>
           
          </div>
      </div>
    </div>
  )
}

export function Signup () {
  
  const navigate = useNavigate()
  const location = useLocation()

  const from = location.state?.from || '/home';

function validatePassword(password) {
  const errors = [];

  if (password.length < 6) {
    errors.push("Minimum 6 characters required");
  }
  if (!/[a-z]/.test(password)) {
    errors.push("At least one lowercase letter required");
  }
  if (!/[A-Z]/.test(password)) {
    errors.push("At least one uppercase letter required");
  }
  if (!/\d/.test(password)) {
    errors.push("At least one number required");
  }
  if (!/[@$!%*?&]/.test(password)) {
    errors.push("At least one special character (@$!%*?&) required");
  }

  return errors;
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function handleValidation(e) {
  const email = formData.email.trim();
  const password = formData.password.trim();

  if (!emailRegex.test(email)) {
    toast.error('Enter a valid email');
    return;
  }

  const result = validatePassword(password);
  if (result.length > 0) {
    const message = result.join(' ');
    console.log("Invalid Password:", message);
    toast.error(message);
    return;
  }

  console.log("Password is valid!");
  toast.success("Registration Successful");
  handleSubmit(e);
}


  const { user, setUser } = useContext(authContext)
  const [message, setMessage] = useState('')
  const roles = ['client', 'vendor']

  const [formData, setFormData] = useState({
    role: 'client',
    username: '',
    email: '',
    password: ''
  })

    const googleLogin = () => {
  const CLIENT_ID = '486170631932-5s4abs9lgv958ptc06ho5705r50i2ccb.apps.googleusercontent.com';
  const REDIRECT_URI = 'http://localhost:5000/auth/google/callback';
  const SCOPE = 'openid email profile';
  const RESPONSE_TYPE = 'code';

  const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?response_type=${RESPONSE_TYPE}&client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=${encodeURIComponent(SCOPE)}`;

  window.location.href = googleAuthUrl;
};

  const dauthLogin = () => {
  const CLIENT_ID = 'lAOrfPy9uph9nGYe';
  const REDIRECT_URI = 'http://localhost:5000/auth/dauth/callback';
  const SCOPE = 'email+user+profile+openid';
  const RESPONSE_TYPE = 'code';

  const dauthUrl = `https://auth.delta.nitt.edu/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&grant_type=authorization_code&state=sdafsdghb&scope=${encodeURIComponent(SCOPE)}&nonce=bscsbascbadcsbasccabs`;

  window.location.href = dauthUrl;
};

    if(user) {
    return <Navigate to ={from} replace/>}



  useEffect(()=>{
  if(user) {console.log('returning becoz user exists')
    return <Navigate to ={from} replace/>}
  },[])

  const handleSubmit = (event) => {
    console.log('submitted')
    axios
      .post(`${BASE_URL}/auth/register`, formData)
      .then(res => {
        setMessage(res.data.message)
        console.log(res.data)
        if (res.data.token) {
          setUser(res.data.user)
          localStorage.setItem('token', res.data.token)
          if(formData.role !== 'client'){
            console.log(formData.role)
            navigate(`/${formData.role}/`,{replace:true})
            return;
          } else{
          console.log(from)
          navigate(from,{replace:true})
          return;
          }
        }
      })
      .catch(err => {
        console.log(`${BASE_URL}/auth/register`);
      })
  }

  const handleChange = e => {
    let { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  return (
     <div className='bg-black w-screen h-screen flex justify-center items-center overflow-hidden'>
      <div className='overflow-hidden bg-[#F8F8F8] min-w-[350px] max-w-[400px] w-[85%] rounded-2xl px-4 py-4 flex flex-col items-center justify-evenly shadow-blue-200 shadow-lg gap-2 neon-border'>
        <div className='usersContainer flex flex-row justify-around items-center rounded-xl p-1 px-1 w-3/4 border-2 border-[#929090]'>
          {roles.map(roleOption => (
            <span
              key={roleOption}
              className={`role rounded-xl text-[14px] md:text-[16px] font-medium p-1 md:px-1 cursor-pointer ${
                formData.role === roleOption ? 'bg-[#3399FF]' : 'bg-transparent'
              }`}
              onClick={() =>
                setFormData(prev => ({ ...prev, role: roleOption }))
              }
            >
              {roleOption.charAt(0).toUpperCase() + roleOption.slice(1)}
            </span>
            
          ))}
        </div>

                <ToastContainer/> 

        <div className='context flex flex-col justify-between items-center text-black'>
          <h1 className='welcomeBack text-black text-[18px] md:text-[20px] font-medium'>
            Create your Account
          </h1>
          <h3 className='enterDetails text-black text-[16px] md:text-[17px] font-medium'>
            Please enter your details.
          </h3>
        </div>

        <form
          className='w-[70%] flex flex-col min-w-[200px] justify-evenly items-start gap-2 font-medium text-[12px]'
          onSubmit={handleSubmit}
        >
          <label htmlFor='email' className='text-black font-medium text-[12px]'>
            Email
          </label>
          <input
            type='email'
            id='email'
            name='email'
            placeholder='Enter your email'
            className='rounded-lg p-1 pt-2 pl-3 text-[#636364] font-medium border-2 w-full focus:outline-none text-[12px]'
            value={formData.email}
            onChange={handleChange}
          />

          <label
            htmlFor='username'
            className='text-black font-medium text-[12px]'
          >
            username
          </label>
          <input
            type='text'
            name='username'
            id='username'
            placeholder='Enter username'
            className='rounded-lg p-1 text-[#636364] font-normal border-2 w-full pl-3 pt-2 focus:outline-none text-[12px]'
            pattern="^(?!\s*$).+" 
            required
            value={formData.username}
            onChange={handleChange}
          />

          <label
            htmlFor='password'
            className='text-black font-medium text-[12px]'
          >
            Password
          </label>
          <input
            type='password'
            id='password'
            name='password'
            placeholder='*************'
          
            required
            className='rounded-lg p-1 text-[#636364] font-normal border-2 w-full pl-3 pt-2 focus:outline-none mb-3 text-[12px]'
            value={formData.password}
            onChange={handleChange}
          />

          <div
            className={`response w-full text-center text-[#EA454c] font-medium ${
              message ? 'block' : 'none'
            }`}
          >
            {message}
          </div>
        <ToastContainer/>
          <button type='button'
            className='login w-[100%] text-white font-medium py-1 text-[13px] bg-[#EA454c] rounded-xl border-[#636364] border-2'
            onClick={(e)=>{
              handleValidation(e)
            }}
          >
            Signup
          </button>

        </form>

        <div className=" justify-center items-center">
  <span>OR</span>
</div>

            <button className='googleContainer w-[100%] h-8 text-black font-normal text-lg bg-transparent flex justify-center items-center cursor-pointer'>
            <div className='googleBox flex flex-row align-center gap-6'>
              <FaGoogle className='hover:text-black hover:bg-white bg-black p-2 text-white size-10 transition-all duration-100 ease-linear rounded-full border-1 border-[#636363] hover:border-black' onClick={googleLogin}>
              </FaGoogle>
              <SiDash className='hover:text-black hover:bg-white bg-black text-white size-10 p-2 transition-all duration-100 ease-linear rounded-full border-1 border-[#636363] hover:border-black' onClick={dauthLogin}>
              </SiDash >
            </div>
          </button>

          <div className='lastcontainer w-full items-center justify-center flex flex-col'>
            <span className='donthaveaccount text-[#636364] font-medium text-[13px]'>
              Already registered? <Link
              to={'/login'}
              className='text-[#EA454c] font-bold text-[13px]'
            >
              Login for free!
            </Link>
            </span>
           
          </div>
      </div>
    </div>
  )
}
