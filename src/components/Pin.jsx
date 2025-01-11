import React, {useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
// import { MdDownloadForOffline } from 'react-icons/md';
import { BsFillArrowUpRightCircleFill } from 'react-icons/bs';
// import { AiTwotoneDelete } from 'react-icons/ai';
import { MetaMaskAvatar } from 'react-metamask-avatar';
import { GATE_WAY } from '../utils/ipfs';


const Pin = ({pin:{postedBy, image, _id, cid}, user}) => {
  const [postHovered, setPostHovered] = useState();
  // const [savingPost, setSavingPost] = useState();
  const navigate = useNavigate();
  return (
    <div className="m-2">
      <div
        onMouseEnter={() => setPostHovered(true)}
        onMouseLeave={() => setPostHovered(false)}
        onClick={() => navigate(`/pin-detail/${_id}`)}
        className=" relative cursor-zoom-in w-auto hover:shadow-lg rounded-lg overflow-hidden transition-all duration-500 ease-in-out"
      >
        {image && (
        <img className="rounded-lg w-full " src={URL.createObjectURL(image)} alt="user-post" /> )}
        {postHovered && (
          <div
            className="absolute top-0 w-full h-full flex flex-col justify-between p-1 pr-2 pt-2 pb-2 z-50"
            style={{ height: '100%' }}
          >
            <div className="flex items-center justify-between">
              {/* <div className="flex gap-2">
                <a
                  href={`${image}?dl=`}
                  download
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  className="bg-white w-9 h-9 p-2 rounded-full flex items-center justify-center text-dark text-xl opacity-75 hover:opacity-100 hover:shadow-md outline-none"
                ><MdDownloadForOffline />
                </a>
              </div> */}
          
              {/* <button
                onClick={(e) => {
                  e.stopPropagation();
                }}
                type="button"
                className="bg-red-500 opacity-70 hover:opacity-100 text-white font-bold px-5 py-1 text-base rounded-3xl hover:shadow-md outline-none"
              >
                Save
              </button> */}
        
            </div>
            <div className=" flex justify-between items-center gap-2 w-full">
              {postedBy===user && cid?.length > 0 ? (
                <a
                  href={(GATE_WAY+cid)}
                  target="_blank"
                  className="bg-white flex items-center gap-2 text-black font-bold p-2 pl-4 pr-4 rounded-full opacity-70 hover:opacity-100 hover:shadow-md"
                  rel="noreferrer"
                >
                  {' '}
                  <BsFillArrowUpRightCircleFill />
                  {cid?.slice(0, 5)}...
                </a>
              ) : undefined}
              {/* {
              postedBy === user && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  // Delete call
                  // Refesh
                }}
                className="bg-white p-2 rounded-full w-8 h-8 flex items-center justify-center text-dark opacity-75 hover:opacity-100 outline-none"
                >
                <AiTwotoneDelete />
              </button>
              )
            } */}
            </div>
          </div>
        )}
      </div>
      <Link to={`/user-profile/${postedBy}`} className="flex gap-2 mt-2 items-center">
        <MetaMaskAvatar
          className="w-8 h-8 rounded-full object-cover"
          address={postedBy}
          alt="user-profile"
        />
        <p className="font-semibold capitalize">{postedBy?.slice(8, 17)}</p>
      </Link>
    </div>
  );
}

export default Pin