import React, {useState, useRef, useEffect} from 'react'
import { HiMenu } from 'react-icons/hi';
import { AiFillCloseCircle } from 'react-icons/ai';
import {Link, Route, Routes} from 'react-router-dom';
import Web3 from 'web3';
import { MetaMaskAvatar } from 'react-metamask-avatar';
import {useNavigate} from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import UserProfile from '../components/UserProfile';
import Pins from './Pins';
import logo from '../assets/logo.png';
const Home = () => {
  const navigate = useNavigate();
  const [toggleSidebar, setToggleSidebar] = useState(false);
  const [account, setAccount] = useState('');
  const scrollRef = useRef(null);

  useEffect(() => {
    if (window.ethereum) {
      const web3Instance = new Web3(window.ethereum);
      web3Instance.eth.getAccounts()
        .then(accounts => {
          if (accounts.length > 0) {
            setAccount(accounts[0]);
          }else {
            navigate('/login', {replace:true})
          }
        })
        .catch(console.error);
    } else {
      console.log('MetaMask not detected');
    }
  }, [account, navigate]);

  useEffect(()=>{
    scrollRef.current.scrollTo(0,0)
  },[]);
  
  return (
    
    <div className='flex bg-gray-50 md:flex-row flex-col h-screen transaction-height duration-75 ease-out'>
      <div className='hidden md:flex h-screen flex-initial'>
        <Sidebar user={account && account}/>
      </div>
      <div className='flex md:hidden flex-row'>
        <div className='p-2 w-full flex flex-row justify-between items-center shadow-md'>
          <HiMenu fontSize={40} className='cursor-pointer' onClick={()=> setToggleSidebar(true)}/>
          <Link to='/'>
              <img src={logo} alt="logo" className='w-28'/>
          </Link>
          <Link to={`/user-profile/${account}`}>
          <MetaMaskAvatar address={account && account} size={24} />
          </Link>
        </div>
        {toggleSidebar && (
          <div className='fixed w-4/5 bg-white h-screen overflow-y-auto shadow-md z-10 animate-slide-in'>
            <div className='absolute w-full flex justify-end items-center p-2'>
              <AiFillCloseCircle fontSize={30} className='cursor-pointer' onClick={()=> setToggleSidebar(false)}/>
            </div>
            <Sidebar user={account && account} closeToggle={setToggleSidebar}/>
          </div>
        )}
      </div>
      <div className='pb-2 flex-1 h-screen overflow-y-scroll' ref={scrollRef}>
        {account && 
        (<Routes>
          <Route path='/user-profile/:userId' element={<UserProfile user={account&&account}/>}/>
          <Route path='/*' element={<Pins user={account&&account}/>}/>
        </Routes>)}
      </div>
    </div>
    ) 
}

export default Home