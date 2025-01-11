import React, {useState} from 'react';
import { AiOutlineCloudUpload } from 'react-icons/ai';
import { MdDelete } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import Spinner from './Spinner';
import { categories} from '../utils/data';
import { MetaMaskAvatar } from 'react-metamask-avatar';
import { upload } from '../utils/data';
import { genImageHuggingFace } from '../utils/huggingface';
const CreatePin = ({user}) => {
  const [title, setTitle] = useState('');
  const [about, setAbout] = useState('');
  const [destination, setDestination] = useState('a');
  const [loading, setLoading] = useState(false);
  const [fields, setFields] = useState(false);
  const [category, setCategory] = useState(null);
  const [imageAsset, setImageAsset] = useState(null);
  const [wrongImageType, setWrongImageType] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const navigate = useNavigate();

  const uploadImage = (e) =>{
    const file = e.target.files[0];
    const { type } = file;
    if (type === 'image/png' || type === 'image/svg' || type === 'image/jpeg' ||type === 'image/gif' || type === 'image/tiff'){
      setWrongImageType(false);
      setLoading(true);
      const imageUrl = URL.createObjectURL(file);
      setDestination(imageUrl)
      setImageAsset(file);
      // const reader = new FileReader();
      // reader.readAsDataURL(file);
      // reader.onloadend = () => {
      //   setImageAsset(reader.result);
      //   setLoading(false);
      // };
      // reader.onerror = () => {
      //   console.error("Failed to read file!");
      //   setLoading(false);
      // };
      setLoading(false);
    }
    else if (type === 'application/pdf'){
      setWrongImageType(false);
      setLoading(true);

    }
    else{
      setWrongImageType(true);
    }
  }
  const genImage = async() => {
    if (title && about && category) {
      setLoading(true);
      setImageAsset(null)
      const blob = await genImageHuggingFace("title: " + title + ", about: " + about + ", category:" + category);
      const imageUrl = URL.createObjectURL(blob);
      setDestination(imageUrl);
      setImageAsset(blob)
      // const reader = new FileReader();
      // reader.readAsDataURL(blob);
      // reader.onloadend = () => {
      //   setImageAsset(reader.result);
      //   setLoading(false);
      // };
      // reader.onerror = () => {
      //   console.error("Failed to read file!");
      //   setLoading(false);
      // };
      setLoading(false);
    } else {
      setFields(true);
      setTimeout(
        () => {
          setFields(false);
        },
        2000,
      );
    }
  };
  const savePin = async() => {
    if (title && about && destination && imageAsset && category) {
      setConfirm(true);
      // forgot destination for dl
      const receipt = await upload(imageAsset, title , about , category, user);
      fetch(receipt).then(async() => {
        setConfirm(false);
        // console.log("Receipt: ", receipt);
        if(receipt){
          navigate('/');
        }
      });
    } else {
      setFields(true);

      setTimeout(
        () => {
          setFields(false);
        },
        2000,
      );
    }
  };


  return (

    <div className="flex flex-col justify-center items-center mt-5 lg:h-4/5">
      {fields && (
        <p className="text-red-500 mb-5 text-xl transition-all duration-150 ease-in ">Please add neccesary fields.</p>
      )}
      { confirm ?(<Spinner message="Confirm transaction to complete creating!"/>):(
        
      <div className=" flex lg:flex-row flex-col justify-center items-center bg-white lg:p-5 p-3 lg:w-4/5  w-full">
        <div className="bg-secondaryColor p-3 flex flex-0.7 w-full">
          <div className=" flex justify-center items-center flex-col border-2 border-dotted border-gray-300 p-3 w-full h-420">
            {
              wrongImageType && (
                <p>It&apos;s wrong file type.</p>
              )
            }
            {!imageAsset ? (
              <label>
                {loading ? (
                    <Spinner />
                  ):(
                <div className="flex flex-col items-center justify-center h-full">
                
                  <div className="flex flex-col justify-center items-center">
                    <p className="font-bold text-2xl">
                      <AiOutlineCloudUpload />
                    </p>
                    <p className="text-lg">Click to upload</p>
                  </div>
                  
                  <p className="mt-32 text-gray-400">
                    Recommendation: Use high-quality JPG, JPEG, SVG, PNG, GIF or TIFF less than 20MB
                  </p>
                </div>
                )}
                <input
                  type="file"
                  name="upload-image"
                  onChange={uploadImage}
                  className="w-0 h-0"
                />
              </label>
            ) : (
              <div className="relative h-full" >
                <img
                  src={destination}
                  alt="uploaded-pic"
                  className="flex justify-center w-full h-full img-thumbnail" 
                  
                  // className=" w-full"
                />
                <button
                  type="button"
                  className="absolute bottom-3 right-3 p-3 rounded-full bg-white text-xl cursor-pointer outline-none hover:shadow-md transition-all duration-500 ease-in-out"
                  onClick={() => setImageAsset(null)}
                >
                  <MdDelete />
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-6 lg:pl-5 mt-5 w-full">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Add your title"
            className="outline-none text-base sm:text-lg border-b-2 border-gray-200 p-2"
          />
          {user && (
            <div className="flex gap-2 mt-2 mb-2 items-center bg-white rounded-lg ">
              <MetaMaskAvatar address={user}/>
              <p className="font-bold">{user}</p>
            </div>
          )}
          <input
            type="text"
            value={about}
            onChange={(e) => setAbout(e.target.value)}
            placeholder="Tell everyone what your Pin is about"
            className="outline-none text-base sm:text-lg border-b-2 border-gray-200 p-2"
          />
          {/* <input
            type="url"
            vlaue={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="Add a destination link"
            className="outline-none text-base sm:text-lg border-b-2 border-gray-200 p-2"
          /> */}

          <div className="flex flex-col">
            <div>
              <p className="mb-2 font-semibold text:lg sm:text-xl">Choose Pin Category</p>
              <select
                onChange={(e) => {
                  setCategory(e.target.value);
                }}
                className="outline-none w-4/5 text-base border-b-2 border-gray-200 p-2 rounded-md cursor-pointer"
              >
                <option value="others" className="sm:text-bg bg-white">Select Category</option>
                {categories.map((item) => (
                  <option className="text-base border-0 outline-none capitalize bg-white text-black " key={item.id} value={item.name}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex gap-5 items-center justify-center mt-5">
              <button
                type="button"
                onClick={genImage}
                className="bg-blue-500 text-white font-bold p-2 rounded-full w-28 outline-none"
              >
                Gen with AI
              </button>
              <button
                type="button"
                onClick={savePin}
                className="bg-red-500 text-white font-bold p-2 rounded-full w-28 outline-none"
              >
                Save Pin
              </button>
            </div>
          </div>
        </div>
      </div>
      
      )}
    </div>
  );
};

export default CreatePin