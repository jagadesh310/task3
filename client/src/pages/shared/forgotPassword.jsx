import axios from 'axios'
import { MdCancel } from "react-icons/md";
import {useState,useEffect,useContext,useRef} from 'react'
import {Link,useNavigate,useParams} from 'react-router-dom'
import { authContext } from '../../contexts/authContext';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import '../../App.css'

   let BASE_URL = import.meta.env.VITE_SERVER_BASE_URL


export function ForgotPassword(){
  let {user,setUser} = useContext(authContext)

  let [newPassword,setNewPassword] = useState('');
  let [email,setEmail] = useState('');
  let [otpOverlay,setOtpOverlay] = useState(false);


  const handleReset=()=>{

    event.preventDefault();
    axios
      .get(`${BASE_URL}/otp/create?email=${email}`)
      .then(res => {
        if(res.data.message =='success'){
        setOtpOverlay(true);
        } else{
          toast.error(res.data.message)
        }
        console.log(res.data);
        })
      .catch(err => {toast.error(err.response.data.message);console.log(err);})
  }



  return (
    <div className="w-screen h-screen bg-black flex justify-center items-center gap-4 pt-10 absolute z-4 overflow-hidden">
      <ToastContainer/>
      <div className="container flex flex-col gap-4 min-h-screen bg-[#ebebeb]">


        {otpOverlay && <OTPOverlay email={email} setOtpOverlay={setOtpOverlay} handleReset={handleReset}/>}

        <div className="passwordChange p-4 bg-gray-950 rounded-md border-amber-100 border-b-1">
        <div className="header flex justify-between items-center font-bold text-white pb-4">
          <span className="heading">Forgot Password</span>
          <Link to='/login' className="back btn">Go Back</Link>
        </div>


        <form className="emailContainer text-white flex flex-col gap-4 pt-6">

          <div className="current text-white flex flex-col items-start gap-4">
          <label htmlFor="email">Enter Email </label>
          <input type="email" name="email" id="email" value={email} placeholder='Enter Email' className='border-1 py-1 px-2 rounded-md w-70'
         onChange={(e)=>{setEmail(e.target.value)}}/>
          </div>

          <div className="footer flex justify-center items-center text-white pt-6">
           <span type='submit' className='reset btn' onClick={()=>{
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if(emailRegex.test(email)){
                handleReset()
            } else{
              toast.error('Enter valid email')
            }
           }} >Reset Password</span>
          </div>
        </form>
        </div>
      </div>
    </div>
  )
}

const OTPOverlay = (props) => {
  let {email,otpOverlay,handleReset} = props
  let [otp, setOtp] = useState('');
  let navigate = useNavigate();
  let [resend,setResend] = useState(false);
  let [max,setMax] = useState(false);
  let [timer,setTimer] = useState(120);
  let maxCount = 2;
  let [count,setCount] = useState(0)


    const handleSubmit=(event)=>{

    console.log(event)
    event.preventDefault();
    axios
      .get(`http://localhost:5000/otp/verify?email=${email}&otp=${otp}`)
      .then(res => {
        console.log(res.data);
        if(res.data.message==='OTP valid'){
         navigate(`/resetPassword/${email}`,{replace:true})
          toastify.success(res.data.message)
        } else{
          toastify.info(res.data.message)
        }
        
        })
      .catch(err => {alert(err.response.data.message);console.log(err);})
  }



   useEffect(() => {
 
  let intervalId = setInterval(() => {
    setTimer(prev => {
      if (prev <= 1) {
        clearInterval(intervalId);
        setResend(true);
        return 0;
      }
      return prev - 1;
    });
  }, 1000);

  return () => clearInterval(intervalId);
}, [count]);



  return (
    <div className='background w-screen h-screen fixed z-4 overflow-hidden flex justify-center items-center left-0 bg-black'>
      <div className='w-[30%] h-[40%] rounded-xl border-2 border-[#97D0ED] p-1 md:p-2 xl:p-3 flex flex-col items-center justify-around bg-black'>
              <ToastContainer/>
        <div className="otpContainer text-white flex flex-col gap-4 ">
          <div className="current text-white flex flex-col items-start gap-4">
          <label htmlFor="otp">Enter OTP </label>
          <input type="number" min='1000' max='9999' name="otp" id="otp" value={otp} placeholder='Enter otp' className='border-1 py-1 px-2 rounded-md w-70 h-11 appearance-none focus:outline-none'
         onChange={(e)=>{setOtp(e.target.value)}}/>
          </div>
          </div>

       <div className="submit">
        <button
          className='btn confirm font-medium text-white text-md md:text-lg xl:text-xl'
          onClick={handleSubmit}
        >
          Confirm
        </button>
        </div>

        <div className="footer text-white flex flex-col items-center gap-2">
          <span className="title">Resend OTP in <span className="time">{timer}sec</span></span>
          {resend && <span className="title text-[#EA454c] font-bold text-md border-1 border-[#eee] rounded-md py-1 px-2" onClick={()=>{setResend(false);setCount(pre=>pre+1);handleReset();setTimer(120)}}>Resend OTP</span>}
          {max && <span className="title text-[#EA454c] font-bold text-md">Too many requests try later</span>}
        </div>
      </div>
    </div>
  )
}


export function ResetPassword(){
  let {user,setUser} = useContext(authContext)

  let [password,setPassword] = useState('');
  let navigate = useNavigate();

  let {email} = useParams()

  const handleSubmit=(event)=>{

    console.log(event)
    event.preventDefault();
    axios
      .put(`http://localhost:5000/auth/updatePassword?email=${email}`,{password:password})
      .then(res => {
        console.log(res)
        toast.error(res.data.message)
        navigate('/login',{replace:true})
        console.log(res.data);
        })
      .catch(err => {alert(err.response.data.message);console.log(err);})
  }


  return (
    <div className="backgroundDiv bg-[#ebebeb]">
      <div className="container flex flex-col gap-4 min-h-screen">
     <ToastContainer/>
         
        <div className="passwordChange p-4 bg-gray-950 rounded-md border-amber-100 border-b-1">
        <div className="header flex justify-between items-center font-bold text-white pb-4">
          <span className="heading">Forgot Password</span>
          <Link to='/ForgotPassword' className="back btn">Go Back</Link>
        </div>


        <div className="passwordContainer text-white flex flex-col gap-4 ">

          <div className="current text-white flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <label htmlFor="currentPassword">Create New Password : </label>
          <input type="password" name="currentPassword" id="currentPassword" value={password} placeholder='create New Password' className='border-1 py-1 px-2 rounded-md' pattern='^[a-zA-Z0-9]+$'
         onChange={(e)=>{setPassword(e.target.value)}}/>
          </div>

        </div>
        <div className="footer flex justify-between items-center text-white pt-6">
          <span className='confirm btn' onClick={handleSubmit}>Confirm</span>
          </div>
        </div>
      </div>
    </div>
  )
}

