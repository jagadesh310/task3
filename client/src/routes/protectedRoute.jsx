import axios from 'axios'

import { Outlet, useLocation, Navigate,useNavigate } from 'react-router-dom'
import { useEffect, useContext } from 'react'

import { authContext } from '../contexts/authContext'

import Header from '../components/header'
import Footer from '../components/footer'
import Loader from '../components/loader'

// import jwt from "jsonwebtoken";

export function ProtectedRoute ({allowedRoles}) {
  const { user, setUser,authLoading,refresh } = useContext(authContext);
  let navigate = useNavigate();
  let location = useLocation();

  useEffect(()=>{
    if (!authLoading){

      if(!user){
       navigate('/login',{state:{from:location.pathname}});
      } else{
       if(!allowedRoles.includes(user.role)){
          navigate('/unauthorized')
        }
      }

  }},[authLoading,user,refresh])


    return(
    <div className='bg-black w-screen overflow-hidden'>
      {authLoading?<Loader/>:
        <>
         {user &&
         <>
         <Header/>
         <Outlet/>
         <Footer/>
         </>}
         </>}
    </div>)

}
