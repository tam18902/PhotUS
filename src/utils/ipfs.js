// ipfs.js
import { create } from 'kubo-rpc-client';
const ipfs = create({ url: process.env.REACT_APP_IPFS_URL });
export const GATE_WAY = process.env.REACT_APP_IPFS_GATE_WAY;
export const uploadToIPFS = async (buffer) => {
  
  const { cid } = await ipfs.add(buffer);
  return {
    cid: cid.toString()
  };
};

export const fetchFromIPFS = async (cid, type) => {
  try{
    const imageFile = await ipfs.cat(cid);
    const buffer = []
    for await (const chunk of imageFile) {
      buffer.push(chunk)
    }
    
    const file = new Blob(buffer, {type:type})
    return {
      file
    };
  }
  catch  (error) {
      return {
        buffer: ''
      }
  }
};
