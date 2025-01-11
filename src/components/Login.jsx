import React, { useState, useEffect } from 'react'
import Web3 from 'web3';
import {useNavigate} from 'react-router-dom';
import metamaskLogo from '../assets/metamask-logo.png';
import shareVideo from '../assets/share.mp4';
import logo from '../assets/logo.png';

const Login = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMetaMask, setIsMetaMask] = useState(false);
  useEffect(() => {
    // Check if MetaMask is installed
    if (window.ethereum) {
      setIsMetaMask(true);
      // Initialize Web3 with the MetaMask provider
      const web3Instance = new Web3(window.ethereum);
      web3Instance.eth.getAccounts()
        .then(accounts => {
          if (accounts.length > 0) {
            setIsLoggedIn(true);
          }
        })
        .catch(console.error);
    } else {
      setIsMetaMask(false);
      console.log('MetaMask not detected');
    }
  }, []);
  
  const handleLogin = async () => {
    try {
      // Request account access
      if(isMetaMask){
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        setIsLoggedIn(true);
      } else {
        window.open('https://metamask.io/download/', '_blank').focus();
      }
    } catch (error) {
      console.error('User denied account access');
    }
  };
  return (
    <div className='flex justify-start imtes-center flex-col h-screen'>
      <div className='relative w-full h-full'>
        <video
          src={shareVideo}
          type="video/mp4"
          loop
          controls={false}
          muted
          autoPlay
          className='w-full h-full object-cover'
        />
        <div className='absolute flex flex-col justify-center items-center top-0 right-0 left-0 bottom-0 bg-blackOverlay'>
          <div className='p-5'>
            <img src={logo} width='130px' alt='logo' className='bg-mainColor rounded-lg outline-none'/>
          </div>
          <div className='shadow-2x1'>
            <div>
            {!isLoggedIn  ? (
              <button
                type='button'
                className='bg-mainColor flex justify-center items-center p-3 rounded-lg cursor-pointer outline-none'
                onClick={handleLogin}
                variant="primary"
              >
                <img className='mr-1' src={metamaskLogo} alt='metamask'/>
                  {isMetaMask?'Connect to wallet':'Install wallet'}
              </button>
            ): (
              navigate('/', {replace:true})
            )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login