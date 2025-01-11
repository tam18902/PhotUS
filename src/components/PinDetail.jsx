import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdDelete } from 'react-icons/md';
import { Link, useParams } from 'react-router-dom';
import MasonryLayout from './MasonryLayout';
import { AiTwotoneDelete } from 'react-icons/ai';
import { feedQuery, insertComment, pinDetailQuery, searchCategories } from '../utils/data';
import Spinner from './Spinner';
import { MetaMaskAvatar } from 'react-metamask-avatar';
import { grantAccessOnBlockchain, removeDataOnBlockchain, revokeAccessOnBlockchain } from '../utils/interact';
import { GATE_WAY } from '../utils/ipfs';

const PinDetail = ({ user }) => {
  const [pins, setPins] = useState(null);
  const [pinDetail, setPinDetail] = useState(null);
  const [comment, setComment] = useState('');
  const [addingComment, setAddingComment] = useState(false);
  const [address, setAddress] = useState('');
  const [addingAddress, setAddingAddress] = useState(false);
  const { pinId } = useParams();
  const navigate = useNavigate();
  const addComment = async () => {
    if (comment) {
      setAddingComment(true);
      await insertComment(pinId, user, comment);
      fecthPinDetails(pinId);
      setComment('');
      setAddingComment(false);
    }
  }
  const addAddress = async () => {
    if (address) {
      setAddingAddress(true);
      await grantAccessOnBlockchain(pinId, user, [address]);
      fecthPinDetails(pinId);
      setAddress('');
      setAddingAddress(false);
    }
  }

  const deleteData = async () => {
    const receipt = await removeDataOnBlockchain(pinId, user);
    if(receipt){
      navigate('/');
    }
  }
  const deleteAddress = async (removedAddress) => {
    if (removedAddress) {
      // setAddingAddress(true);
      await revokeAccessOnBlockchain(pinId, user, [removedAddress]);
      await fecthPinDetails(pinId);
      // setAddingAddress(false);
      // console.log("remove", removedAddress);
      
    }
  }
  const fecthPinDetails = async (pinId) => {
    // console.log(user, pinId);
    
    //  pinDetailQuery(user, pinId);
    const query = await pinDetailQuery(user, pinId);
    setPinDetail(query);
    if (query) {
      // const morePins = feedQuery(user, setPins);
      const morePins = await searchCategories(user, query.categories[0]);
      setPins(morePins);
    }
  }

  useEffect(() => {
    fecthPinDetails(pinId);
  }, [pinId, user]);
  if (!pinDetail) return <Spinner message="Loading pinDetail"></Spinner>

  return (
    <>
      <div className='flex xl-flex-row flex-col m-auto bg-white' style={{ maxWidth: '1500px', borderRadius: '32px' }}>
        <div className='pl-2 pr-2 pt-2 flex justify-center items-center md:items-start flex-initial'>
        <img
            src={URL.createObjectURL(pinDetail?.image)}
            className='flex-col rounded-t-3xl rounded-b-lg'
            style={{ maxWidth: '500px', borderRadius: '16px' }}
            alt="user-post"
          />
        </div>
        <div className='w-full p-5 flex-1 xl:min-w-620'>
          <div className='flex items-center justify-between'>
          {pinDetail.postedBy === user && (
            <>
            <div className='flex gap-2 items-center'>
              <a
                // href={`${pinDetail.image}?dl=`}
                // download
                onClick={deleteData}
                className="bg-white w-9 h-9 p-2 rounded-full flex items-center justify-center text-dark text-xl opacity-75 hover:opacity-100 hover:shadow-md outline-none"
              >
                <AiTwotoneDelete />
              </a>

            </div>
            
            <a
              href={GATE_WAY+pinDetail?.cid}
              target="_blank"
              className="bg-white flex items-center gap-2 text-black font-bold p-2 pl-4 pr-4 rounded-full opacity-70 hover:opacity-100 hover:shadow-md"
              rel="noreferrer"
            >
              {pinDetail?.cid?.slice(0, 8)}...
            </a>
            </>
            )}
          </div>
          <div>
            <h1 className='text-4xl font-bold break-words mt-3'>
              {pinDetail.title}
            </h1>
            <p className='mt-3'>
              {pinDetail.about}
            </p>
          </div>
          <Link to={`/user-profile/${pinDetail.postedBy}`} className="flex gap-2 mt-5 items-center bg-white rounded-lg">
            <MetaMaskAvatar
              address={pinDetail.postedBy}
              alt="user-profile"
              size={24}
            />
            <p className="font-bold capitalize">{pinDetail.postedBy}</p>
          </Link>
            {
            pinDetail.postedBy === user ? (
              <h2 className='mt-5 text-2xl'>
                Privilege
              </h2>
              ): (
              <h2 className='mt-5 text-2xl'>
              Comments
              </h2>
              )
            }
            {
            pinDetail.postedBy === user && pinDetail?.privilege.length > 0 && pinDetail.privilege?.map((PrivAddress, i) => (
                (PrivAddress != user) && (<div className='flex flex-wrap items-center justify-between' key={i}>
                  <Link to={`/user-profile/${PrivAddress}`} className="flex gap-2 mt-5 items-center bg-white rounded-lg">
                    <MetaMaskAvatar
                      address={PrivAddress}
                      alt="user-profile"
                      size={16}
                    />
                    <p className="font-semibold capitalize">{PrivAddress}</p>
                  </Link>
                  <div className='flex gap-2 mt-4 items-center'>
                    <a
                      onClick={() => deleteAddress(PrivAddress)}
                      className="bg-white w-9 h-9 p-2 rounded-full flex items-center justify-center text-dark text-xl opacity-75 hover:opacity-100 hover:shadow-md outline-none"
                    >
                      <MdDelete />
                    </a>
                  </div>
                  
                </div>
                )  
            ))
            }

            {
              (pinDetail.postedBy === user) ? (
                <div className='flex flex-wrap mt-6 gap-3'>
                  <input
                    className='flex-1 border-gray-100 outline-none border-2 p-2 rounded-2xl focus:border-gray-300'
                    type="text"
                    placeholder='Add a address'
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                  <button
                    type="button"
                    className='bg-red-500 text-white rounded-full px-6 py-2 font-semibold text-base outline-none'
                    onClick={addAddress}
                  >
                    {addingAddress ? 'Granting the Address...' : 'Grant'}
                  </button>
                </div>
                ): (
                  <>
                  <div className='max-h-370 overflow-y-auto'>
                  {
                    pinDetail?.comments.length >= 1 ? pinDetail.comments?.map((comment, i) => (
                      <div className='flex flex-col' key={i}>
                        <Link to={`/user-profile/${comment.postedBy}`} className="flex gap-2 mt-5 items-center bg-white rounded-lg">
                          <MetaMaskAvatar
                            address={comment.postedBy}
                            alt="user-profile"
                            size={16}
                          />
                          <p className="font-semibold capitalize">{comment.postedBy}</p>
                        </Link>
                        <p className='pl-5'>{comment.comment}</p>
                      </div>
                    )) :
                      <div className='flex flex-col'>
                        <p>Become first comment here</p>
                      </div>
                  }
                </div>
                 <div className='flex flex-wrap mt-6 gap-3'>
                  <Link to={`/user-profile/${user}`} className="flex gap-2 items-center bg-white rounded-lg">
                    <MetaMaskAvatar
                      address={user}
                      alt="user-profile"
                      size={24}
                    />
                  </Link>
                  <input
                    className='flex-1 border-gray-100 outline-none border-2 p-2 rounded-2xl focus:border-gray-300'
                    type="text"
                    placeholder='Add a comment'
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  />
                  <button
                    type="button"
                    className='bg-red-500 text-white rounded-full px-6 py-2 font-semibold text-base outline-none'
                    onClick={addComment}
                  >
                    {addingComment ? 'Posting the comment...' : 'Post'}
                  </button>
                </div>
                </>
              )
            }
          
          {/*
          <div className='max-h-370 overflow-y-auto'>
            {
              pinDetail?.comments.length >= 1 ? pinDetail.comments?.map((comment, i) => (
                <div className='flex flex-col' key={i}>
                  <Link to={`/user-profile/${comment.postedBy}`} className="flex gap-2 mt-5 items-center bg-white rounded-lg">
                    <MetaMaskAvatar
                      address={comment.postedBy}
                      alt="user-profile"
                      size={16}
                    />
                    <p className="font-semibold capitalize">{comment.postedBy}</p>
                  </Link>
                  <p className='pl-5'>{comment.comment}</p>
                </div>
              )) :
                <div className='flex flex-col'>
                  <p>Become first comment here</p>
                </div>
            }
          </div>
           <div className='flex flex-wrap mt-6 gap-3'>
            <Link to={`/user-profile/${user}`} className="flex gap-2 items-center bg-white rounded-lg">
              <MetaMaskAvatar
                address={user}
                alt="user-profile"
                size={24}
              />
            </Link>
            <input
              className='flex-1 border-gray-100 outline-none border-2 p-2 rounded-2xl focus:border-gray-300'
              type="text"
              placeholder='Add a comment'
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <button
              type="button"
              className='bg-red-500 text-white rounded-full px-6 py-2 font-semibold text-base outline-none'
              onClick={addComment}
            >
              {addingComment ? 'Posting the comment...' : 'Post'}
            </button>
          </div> */}
        </div>
      </div>
      {pins?.length > 0 ? (
        <>
          <h2 className='text-center font-bold text-2x mt-8 mb-4'>
            More like this
          </h2>
          <MasonryLayout pins={pins} />
        </>
      ) : (
        <Spinner message="No pins like this" />
      )}
    </>
  )
}

export default PinDetail