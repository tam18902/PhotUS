import { uploadToIPFS, fetchFromIPFS } from '../utils/ipfs';
import {storeDataOnBlockchain, getDataFromBlockchain, getDataByIdFromBlockchain} from '../utils/interact';

export const searchQuery = async (user, searchTerm) => {
  try {
    const query = await feedQuery(user, null);
    const pinsBySearch = query.filter(pin => 
      {
        const categories = pin.categories.join('');
        return (pin.title + pin.about + categories).toLowerCase().includes(searchTerm.toLowerCase());
      }
    );
    return pinsBySearch;
    
  } catch (error) {
    console.error('Error fetching user-created pins:', error);
    return [];
  }
}

export const searchCategories = async (user, category) => {
  try {
    const query = await feedQuery(user, null);
    const pinsByCategory = query.filter(pin => 
      {
        const categories = pin.categories.join('');
        return categories.toLowerCase().includes(category.toLowerCase());
      }
    );
    return pinsByCategory;
  } catch (error) {
    console.error('Error fetching user-created pins:', error);
    return [];
  }
}

export const upload = async(imageAsset, title , about , category, user) => {
  const ipfsResponse = await uploadToIPFS(imageAsset);
  // console.log(ipfsResponse.imageCid);
  // const metadata = [title , about , destination, user, ipfsResponse.encryptionKey, ipfsResponse.imageCid].join(",");
  // const metadata = [title , about , category, user, ipfsResponse.encryptionKey, ipfsResponse.imageCid].join('\0');
  const { type } = imageAsset;
  const metadata = JSON.stringify({
    type,
    title,
    about,
    category,
    user,
    cid: ipfsResponse.cid
  })
  const receipt = await storeDataOnBlockchain(metadata, user);
  return receipt;
}

const transformData = async (item) => {
  const imageResult = await fetchFromIPFS(item.cid, item.type);
  const image = imageResult?.file;
  const transformedItem = {
    _id: item.id,
    type: item.type,
    cid: item.cid,
    postedBy: item.user,
    image: image ? image : '',
    title: item.title,
    about: item.about,
    comments: [],
    categories: [item.category],
    privilege: item.privilege
  };
  return transformedItem;
};


export const feedQuery = async(user, setPins) => {
  const data = await getDataFromBlockchain(user);
  let resultArray = [];

  for (const item of data) {
    if (item) {
      const transformedItem = await transformData(item);
      // console.log(transformedItem)
      resultArray = [...resultArray, transformedItem];
      // console.log(resultArray);
      if(setPins) setPins(resultArray);
    }
  }
  return resultArray;
}

// export const insertAddress = (pinId, user, address) => {
//   const index = demoPins.findIndex(obj => obj._id === pinId);
//   demoPins[index].comments.push({postedBy:user, comment:comment});
// } 

export const insertComment = (pinId, user, comment) => {
  // const index = demoPins.findIndex(obj => obj._id === pinId);
  // demoPins[index].comments.push({postedBy:user, comment:comment});
} 

export const pinDetailMorePinsQuery = (pinId) => {
  return ;
}

export const pinDetailQuery = async(user, pinId) => {
  const data = await getDataByIdFromBlockchain(pinId, user);
  if(!data) return null;
  const transformedData = await transformData(data);
  return transformedData;
}

export const userCreatedPinsQuery = async(user, userId) => {
  try {
    // Fetch the query results from feedQuery
    const query = await feedQuery(user, null);
    // console.log('userCreatedPinsQuery', query,user, userId);
    // Filter pins where postedBy matches the userId
    const pinsByUser = query.filter(pin => pin.postedBy === userId);

    // Return the filtered pins
    return pinsByUser;
  } catch (error) {
    console.error('Error fetching user-created pins:', error);
    return [];
  }
}

export const userSavedPinsQuery = (user, userId) => {
  return userCreatedPinsQuery(user, userId);
}

export const categories = [
    {
      id:1,
      name: 'Document',
      image: 'https://i.ibb.co/52LzvPs/images.png',
    },
    {
      
      id:2,
      name: 'Cars',
      image: 'https://i.pinimg.com/750x/eb/47/44/eb4744eaa3b3ccd89749fa3470e2b0de.jpg',
    },
    
    {
      id:3,
      name: 'Wallpaper',
      image: 'https://i.pinimg.com/236x/03/48/b6/0348b65919fcbe1e4f559dc4feb0ee13.jpg',
    },
    {
      id:4,
      name: 'Websites',
      image: 'https://i.pinimg.com/750x/66/b1/29/66b1296d36598122e6a4c5452b5a7149.jpg',
    },
    {
      id:5,
      name: 'Photo',
      image: 'https://i.pinimg.com/236x/72/8c/b4/728cb43f48ca762a75da645c121e5c57.jpg',
    },
    {
      id:6,
      name: 'Food',
      image: 'https://i.pinimg.com/236x/7d/ef/15/7def15ac734837346dac01fad598fc87.jpg',
    },
    {
      id:7,
      name: 'Nature',
      image: 'https://i.pinimg.com/236x/b9/82/d4/b982d49a1edd984c4faef745fd1f8479.jpg',
    },
    {
      id:8,
      name: 'Art',
      image: 'https://i.pinimg.com/736x/f4/e5/ba/f4e5ba22311039662dd253be33bf5f0e.jpg',
    }, {
      id:9,
      name: 'Travel',
      image: 'https://i.pinimg.com/236x/fa/95/98/fa95986f2c408098531ca7cc78aee3a4.jpg',
    },
    {
      id:10,
      name: 'Quotes',
      image: 'https://i.pinimg.com/236x/46/7c/17/467c17277badb00b638f8ec4da89a358.jpg',
    }, {
      id:11,
      name: 'Cats',
      image: 'https://i.pinimg.com/236x/6c/3c/52/6c3c529e8dadc7cffc4fddedd4caabe1.jpg',
    }, {
      id:12,
      name: 'Dogs',
      image: 'https://i.pinimg.com/236x/1b/c8/30/1bc83077e363db1a394bf6a64b071e9f.jpg',
    },
    {
      id:13,
      name: 'Others',
      image: 'https://i.pinimg.com/236x/2e/63/c8/2e63c82dfd49aca8dccf9de3f57e8588.jpg',
    },
  ];