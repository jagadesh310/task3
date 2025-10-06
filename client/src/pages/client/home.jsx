import axios from 'axios'

import { useState, useEffect, useContext, createContext } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import '../../App.css'

import Loader from '../../components/loader.jsx'
import {
  MoviesContainer,
  ShowsCard
} from '../../components/moviesContainer.jsx'
import { authContext } from '../../contexts/authContext.jsx'

export const dataContext = createContext()

   let BASE_URL = import.meta.env.VITE_SERVER_BASE_URL
// import { SocketContext } from '../../contexts/socketContext';

export function Home () {
  let { user, setUser } = useContext(authContext)
  // let {connect,disconnect,socket} = useContext(SocketContext)
  let options = ['movies', 'trains', 'concerts']
  let [genres, setGenres] = useState({
    movies: ['Recommended', 'Action', 'Sci-Fi', 'Horror', 'Thriller'],
    concerts: ['Recommended', 'Pop', 'Rock']
  })
  let [currentOption, setCurrentOption] = useState('movies')
  let [search, setSearch] = useState('')
  let [data, setData] = useState() //contains currentOptionData
  let [loading, setLoading] = useState(true)
  let navigate = useNavigate();


  useEffect(() => {
    setData(null)
    setLoading(true)
    if (currentOption === 'movies') {
      axios
        .get(`${BASE_URL}/movie/find?fields=_id,genre,poster,type`)
        .then(res => {
          setData(res.data)
          console.log(res.data)
                   setTimeout(() => {
            setLoading(false)
          }, 1000)
        })
        .catch(err => {})
    } else if (currentOption === 'concerts') {
      axios
        .get(`${BASE_URL}/concert/find?fields=_id,genre,poster,type`)
        .then(res => {
          setData(res.data)
          console.log(res.data)
                    setTimeout(() => {
            setLoading(false)
          }, 1000)
        })
        .catch(err => {})
    } else {
      axios
        .get(`${BASE_URL}/train/find`)
        .then(res => {
          setData(res.data)
          console.log(res.data)
          setTimeout(() => {
            setLoading(false)
          }, 1000)
        })
        .catch(err => {})
    }
  }, [currentOption])

  return (
    <div className='backgroundDiv min-h-screen'>
      <div className='container w-[85%] flex flex-col gap-4 rounded-xl'>
        <div className='options flex justify-center items-center'>
          <div className='optionsContainer border-1 shadow-md shadow-black flex justify-around items-center gap-3 rounded-2xl border-[#929090] py-2 px-4 m-auto'>
            {options.map(option => {
              return (
                <span
                  key={option}
                  className={`rounded-2xl p-1 px-3 font-bold text-lg text-white cursor-pointer ${
                    currentOption === option ? 'bg-[#4242FA]' : 'bg-transparent'
                  }`}
                  onClick={() => {
                    setCurrentOption(option)
                    // setSearch('')
                  }}
                >
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </span>
              )
            })}
          </div>
        </div>

        {/* {(currentOption==='movies' || currentOption==='concerts') &&
 <div className="searchContainer flex justify-center items-center">
 <input type="search" placeholder='search' value={search} className='text-black w-[50%] bg-white border-1 border-[#4242FA] outline-none rounded-2xl px-4 py-2' onChange={onChangeHandler}></input>
 </div>} */}

        <div className='main w-full'>
          {(currentOption === 'movies' || currentOption === 'concerts') && (
            <div className='recommendedShows'>
              {loading ? (
                <Loader />
              ) : (<>
                  <MoviesContainer data={data} all={true} genre={'All'}/>
                {genres[`${currentOption}`].map(genre => (
                  <MoviesContainer key={genre} data={data} genre={genre} />))}
                  </>
              )}
            </div>
          )}

          {currentOption === 'trains' && (
            <TrainContent
              loading={loading}
              setLoading={setLoading}
              data={data}
            />
          )}
        </div>
      </div>
    </div>
  )
}

const TrainContent = ({ loading, setLoading, data }) => {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [filterData, setFilterData] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [fromFilteredSuggestions, setFromFilteredSuggestions] = useState([]);
  const [toFilteredSuggestions, setToFilteredSuggestions] = useState([]);

  const fromSuggestions = [
    'Chennai Central',
    'Coimbatore Junction',
    'Ernakulam Junction',
    'Guntur Junction',
    'Hyderabad Deccan',
    'Katpadi Junction',
    'Kazipet Junction',
    'Kollam',
    'Madurai Junction',
    'Nagercoil Junction',
    'Narasapur',
    'Nizamabad',
    'Rajahmundry',
    'Renigunta Junction',
    'Secunderabad Junction',
    'Tiruchirapalli Junction',
    'Tirupati',
    'Tiruppur',
    'Vellore',
    'Vijayawada Junction'
  ];

  const toSuggestions = [
    'Chennai Central',
    'Coimbatore Junction',
    'Ernakulam Junction',
    'Guntur Junction',
    'Hubballi Junction',
    'Katpadi Junction',
    'Kazipet Junction',
    'Kollam',
    'Madurai Junction',
    'Nagercoil Junction',
    'Narasapur',
    'Nizamabad',
    'Rajahmundry',
    'Renigunta Junction',
    'Secunderabad Junction',
    'Tiruchirapalli Junction',
    'Tirupati',
    'Tiruppur',
    'Trivandrum Central',
    'Vellore',
    'Vijayawada Junction'
  ];

  const search = () => {
    if (!from || !to) {
      alert('Please select both From and To stations');
      return;
    }

    setSearchLoading(true);

    const day = new Date(date).toDateString().split(' ')[0];
    const filtered = data.filter(train => {
      const operates = train.daysOfOperation.includes(day);
      return operates && isStationIncludes(train.stations);
    });

    setTimeout(() => {
      setFilterData(filtered);
      setSearchLoading(false);
    }, 500);
  };

  function isStationIncludes(stations) {
    let fromIdx = -1;
    let toIdx = -1;
    stations.forEach((station, idx) => {
      if (station.stationName === from) fromIdx = idx;
      if (station.stationName === to) toIdx = idx;
    });
    return fromIdx >= 0 && fromIdx < toIdx;
  }

  function changeHandler(e) {
    const { name, value } = e.target;
    if (name === 'From') {
      setFrom(value);
      setFromFilteredSuggestions(
        fromSuggestions.filter(s =>
          s.toLowerCase().includes(value.toLowerCase())
        )
      );
      setToFilteredSuggestions([]);
    } else {
      setTo(value);
      setToFilteredSuggestions(
        toSuggestions.filter(s =>
          s.toLowerCase().includes(value.toLowerCase())
        )
      );
      setFromFilteredSuggestions([]);
    }
  }

  return (
    <>
      <div className='trains'>
        {/* Search UI */}
        <div className='header flex items-center flex-col justify-between gap-4'>
          <div className='searchContainer w-[50%] text-white grid grid-cols-1 grid-rows-3 gap-4 border-2 border-[#eee] p-4'>
            <div className='from flex items-center gap-4'>
              <label htmlFor='from py-1'>From :</label>
              <div className='fromSearch self-start'>
                <input
                  type='text'
                  id='from'
                  value={from}
                  name='From'
                  className='rounded-xl border-1 border-white px-2 py-1'
                  onChange={changeHandler}
                />
                {fromFilteredSuggestions.length > 0 && (
                  <ul className='absolute bg-white text-black border border-gray-400 rounded max-h-40 overflow-y-auto'>
                    {fromFilteredSuggestions.map((item, index) => (
                      <li
                        key={index}
                        className='p-2 hover:bg-gray-200 cursor-pointer'
                        onClick={() => {
                          setFrom(item);
                          setFromFilteredSuggestions([]);
                        }}
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            <div className='to flex items-center gap-4'>
              <label htmlFor='to'>To :</label>
              <input
                type='text'
                id='to'
                value={to}
                name='To'
                className='rounded-xl w-[70%] border-1 border-white px-2 py-1'
                onChange={changeHandler}
              />
              {toFilteredSuggestions.length > 0 && (
                <ul className='absolute bg-white text-black border border-gray-400 rounded max-h-40 overflow-y-auto'>
                  {toFilteredSuggestions.map((item, index) => (
                    <li
                      key={index}
                      className='p-2 hover:bg-gray-200 cursor-pointer'
                      onClick={() => {
                        setTo(item);
                        setToFilteredSuggestions([]);
                      }}
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className='calender flex items-center gap-4'>
              <label htmlFor='selectedDate'>Select Date:</label>
              <input
                type='date'
                id='selectedDate'
                name='selectedDate'
                value={date}
                min={new Date().toISOString().split('T')[0]}
                className='border-1 rounded-md p-1 outline-none select-none'
                onChange={e => setDate(e.target.value)}
              />
            </div>
          </div>

          <button
            className='search px-4 py-2 border-2 rounded-xl text-white cursor-pointer active:bg-[#4242ea] transition duration-100 linear'
            onClick={search}
          >
            Search
          </button>
        </div>

      
        <div className='main flex py-6 w-full justify-center items-center'>
          {loading || searchLoading ? (
            <Loader />
          ) : (
            <div className='trainsContainer flex flex-col gap-8 w-[80%]'>
              {(filterData ? filterData : data)?.length > 0 ? (
                (filterData || data).map((train, idx) => (
                  <TrainElement
                    key={idx}
                    train={train}
                    from={from || train?.stations[0].stationName}
                    to={
                      to ||
                      train.stations[train.stations.length - 1].stationName
                    }
                    journeyDate={date}
                  />
                ))
              ) : (
                <p className='text-gray-300 text-center text-lg'>
                  No trains found for the selected route.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};


function TrainElement ({ train, from, to, journeyDate }) {
  let fromIdx = -1
  let toIdx = -1

  train.stations.forEach((station, idx) => {
    if (station.stationName === from) {
      fromIdx = idx
    }
    if (station.stationName === to) {
      toIdx = idx
    }
  })

  let fromStation = train.stations[fromIdx]
  let toStation = train.stations[toIdx]

  function getDuration (arrivalTime, departureTime) {
    let arrival = new Date(
      0,
      0,
      0,
      arrivalTime.slice(0, 2),
      arrivalTime.slice(3)
    )
    let departure = new Date(
      0,
      0,
      0,
      departureTime.slice(0, 2),
      departureTime.slice(3)
    )
    let duration = (arrival - departure) / 1000
    let hours = Math.floor(duration / (60 * 60))
    let minutes = (duration / 60) % 60
    return `${hours}h ${minutes}min`
  }

  let arrivalTime = toStation?.arrivalTime
  let departureTime = fromStation?.departureTime
  let duration = getDuration(arrivalTime, departureTime)
   let distance = toStation.distance - fromStation.distance

  function getPrice (farePerKm) {
    return distance * farePerKm
  }

  return (
    <div className='bg-[#97D0ED] text-black w-full p-2 border-white border-2'>
      <div className='trainDetails flex justify-between items-center'>
        <div className='trainName font-bold'>{train.trainName}</div>
        <span className='trainNumber text-[#757575]'>#{train.trainNumber}</span>
      </div>

      <div className='stations flex justify-between items-center'>
        <span className='fromDetails'>
          <div className='stationName font-medium'>{from}</div>
          <div className='arrivalTime'>{departureTime}</div>
        </span>

        <span className='duration'>
          {getDuration(arrivalTime, departureTime)}
        </span>

        <span className='toDetails'>
          <div className='stationName font-medium'>{to}</div>
          <div className='departureTime'>{arrivalTime}</div>
        </span>
      </div>

      <div className='ticketsContainer flex gap-4 p-2'>
        {train.classes.map((c, idx) => {
          let ticketPrice = parseInt(getPrice(c.farePerKm))
          return (
            <Link
              to={`/train/${train._id}`}
              state={{from:from,to:to,journeyDate:journeyDate,duration:duration,distance:distance,ticketPrice:ticketPrice,arrivalTime:arrivalTime,departureTime:departureTime}}
              className='ticketcontainer flex flex-col p-2 border-2 border-gray-700 rounded-xl hover:border-[#4242FA] cursor-pointer'
              key={idx}
            >
              <div className='header flex justify-between font-bold text-black'>
                <div className='classType'>{c.classType}</div>
                <div className='price'>{ticketPrice}</div>
              </div>
              <div className='seatsAvailable font-medium text-green-600'>
                Available {c.totalSeats}
              </div>
              <div className='notice font-normal'>Free Cancellation</div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
