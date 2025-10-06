import axios from 'axios'

import { Outlet} from 'react-router-dom'
import {useContext } from 'react'

import { authContext } from '../contexts/authContext'
import Header from './header'
import Footer from './footer'
import Loader from './loader'

// import jwt from "jsonwebtoken";

export function PublicRoute () {
  const { user, setUser,authLoading} = useContext(authContext)

  console.log(authLoading)

    return(
    <div className='bg-black w-screen'>
      {authLoading?<Loader/>:
      <>
       <Header/>
       <Outlet/>
       <Footer/>
      </>
      }

    </div>)
}
