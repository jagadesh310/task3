import { FiMenu } from "react-icons/fi";

import { NavLink, useNavigate, Link, useLocation } from 'react-router-dom'
import { useContext, useState, useEffect } from 'react'

import '../App.css'
import { authContext } from '../contexts/authContext'

import { TbLogout } from "react-icons/tb";
import { FaHome } from "react-icons/fa";
import { GrTransaction } from "react-icons/gr";
import { MdLocalMovies } from "react-icons/md";
import { MdDirectionsRailway } from "react-icons/md";
import { MdDashboard } from "react-icons/md";
import { FaBookmark } from "react-icons/fa6";
import { RiLockPasswordFill } from "react-icons/ri";
import { RiContactsFill } from "react-icons/ri";
import { GiCometSpark } from "react-icons/gi";

function Header() {
  let { user, setUser, logout, setAuthMessage } = useContext(authContext);
  let { pathname } = useLocation();
  let [menu, setMenu] = useState(false);


  let links = {
    'client': [{ path: '/home', name: 'Home' }, { path: '/myBookings', name: 'My Bookings' }, { path: '/recentTransactions', name: 'Transactions' }, { path: '/changePassword', name: 'Change Password' }, { path: '/contactUs', name: 'Contact Us' }],
    'admin': [{ path: '/admin/home', name: 'Home' }, { path: '/admin/dashboard', name: 'Dashboard' }, { path: '/admin/movies', name: 'Movies' }, { path: '/admin/concerts', name: 'Concerts' }, { path: '/admin/trains', name: 'Trains' }, { path: '/admin/Transactions', name: 'Transactions' }, { path: '/changePassword', name: 'Change Password' }, { path: '/contactUs', name: 'Contact Us' }],
    'vendor': [{ path: '/vendor/home', name: 'Home' }, { path: '/vendor/dashboard', name: 'Dashboard' },{ path: '/vendor/transactions', name: 'Transactions' },{ path: '/changePassword', name: 'Change Password' }, { path: '/contactUs', name: 'Contact Us' }]
  };

  let icons = {
    'Home': <FaHome />,
    'My Bookings': <FaBookmark />,
    'Change Password': <RiLockPasswordFill />,
    'Contact Us': <RiContactsFill />,
    'Movies': <MdLocalMovies />,
    'Trains': <MdDirectionsRailway />,
    'Transactions': <GrTransaction />,
    'Dashboard': <MdDashboard />,
    'Concerts':<GiCometSpark/>
  }


  useEffect(() => {
    setMenu(false);
    window.scroll(0, 0)
  }, [pathname])

  return (
    <div className='header w-screen h-[65px] bg-black shadow-sm shadow-[#ffffff] fixed z-1 top-0 flex justify-center'>
      <div className='headerContainer flex justify-between items-center w-[85%]'>
        <div className='logoContainer text-white hover:text-[#4242FA] font-serif font-bold text-2xl cursor:pointer'>
          <FiMenu onClick={() => { setMenu(true) }} />
        </div>

        {/* <div className="searchBar rounded-xl border-2"></div> */}

        {/* <ul className='headerMiddle w-[50%] hidden md:flex text-white font-medium text-md lg:text-xl font-poppins justify-evenly items-center'>
          <NavLink to='/'>
            <li>Home</li>
          </NavLink>
          <NavLink to='/mybookings'>
            <li>My Bookings</li>
          </NavLink>
          <NavLink to='/contactus'>
            <li>Contact Us</li>
          </NavLink>
        </ul> */}

        <Link to={user.role === 'client' ? '/profile' : `/${user.role}/profile`} className='flex items-center gap-4'>

          {(user.role === 'client' || 'vendor') &&
            <div className="clientamount">
              <span className="amount border-1 border-gray-400 hover:border-[#eee] px-3 py-2 text-white rounded-xl">₹{user.amountAvailable}</span>
            </div>}

          <div className='profileContainer'>
            <span className='profileImage'>
              <span className="verificationbox relative size-8 -right-8">
                {user.isVerified==true ? <span className="greendot size-2 bg-green-600 animate-ping absolute rounded-full"></span> : <span className="reddot size-2 bg-red-600 animate-ping absolute rounded-full"></span>}
              </span>
              <img src={user.profileImageUrl} className='h-10 w-10 text-white rounded-full' />
            </span>
          </div>
        </Link>
      </div>

      {menu && <div className="menuContainer w-screen h-screen fixed z-10 flex flex-row-reverse">

              <div className="right-0 top-0 bg-amber-100 w-full h-screen blur-xs opacity-20 z-10" onClick={() => { setMenu(false) }}>
        </div>


        <div className="left top-0 left-0 w-auto lg:w-[30%] h-screen bg-[#12101D] z-11 text-black flex flex-col px-4 py-8 gap-6">

          <ul className='footer flex justify-between items-center py-3 font-normal text-[16px] md:text-[18px] rounded-lg place-content-center px-1 gap-1
          bg-[#1E1A31] md:px-8'>
            <span className='profileImage pt-1'>
              <img src={user.profileImageUrl} className='h-10 w-10 text-white rounded-full' />
            </span>
            <div className="profileright flex flex-col">
              <span className="name font-bold flex place-content-end text-white">{user.username}</span>
              <span className="cursor-pointer text-[14px] md:text-[16px] text-[#7b7b7e]" onClick={() => { logout(); setAuthMessage('Logout Successfully'); }}>
                logout
              </span>
            </div>
          </ul>

          <ul className='body flex flex-col self-start gap-4 text-white w-full px-2'>
            {links[user.role].map((ele, idx) => {
              return <NavLink to={ele.path} key={idx} className='py-3 font-normal text-[16px] md:text-[18px] rounded-lg hover:bg-[#1E1A31]   place-content-center flex align-center justify-start px-5 gap-1 w-full'>
                <span className="icon pt-1">{icons[ele.name]}</span>
                <span className="name">{ele.name}</span>
              </NavLink>
            })}
          </ul>

        </div>
  
      </div>}

    </div>
  )
}



export default Header
