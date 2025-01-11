import React, {useState, useEffect} from 'react';
import {useParams} from 'react-router-dom';
import { feedQuery, searchCategories } from '../utils/data';
import MasonryLayout from './MasonryLayout';
import Spinner from './Spinner';
const Feed = ({user}) => {
  const[loading, setLoading] = useState(false);
  const[pins, setPins] = useState([]);
  const {categoryId} = useParams();
  useEffect(()=>{
    async function fetchData() {
      setLoading(true);
      if(categoryId) {
        const query = await searchCategories(user, categoryId);
        setPins(query);
        setLoading(false);
      } else {  
        const query = feedQuery(user, setPins);
        setPins(query);
        setLoading(false);
      }
    }
    fetchData();
  },[categoryId, user])
  if(loading) return <Spinner message="We are adding new ideas to your feed!"/>
  if(!pins) return <h2>No pins available</h2>
  return (
    <div>
      {pins?.length > 0 && <MasonryLayout pins={pins} user={user}/>}
    </div>
  )
}

export default Feed