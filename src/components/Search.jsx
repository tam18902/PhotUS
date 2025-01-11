import React, { useState, useEffect } from 'react'

import MasonryLayout from './MasonryLayout';
import { feedQuery, searchQuery } from '../utils/data';
import Spinner from './Spinner';

const Search = ({ user, searchTerm, setSearchTerm }) => {
  const [pins, setPins] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    async function fetchData (searchTerm){
      if (searchTerm !== "") {
        setLoading(true);
        const query = await searchQuery(user, searchTerm);
        setPins(query);
        setLoading(false);
      }
      else {
        setLoading(true);
        const query = feedQuery(user, setPins);
        setPins(query);
        setLoading(false);
      }
    }
      fetchData(searchTerm);
  }, [searchTerm, user]);

  return (
    <div>
      {loading && <Spinner message="Searching for pins" />}
      {pins?.length > 0 && <MasonryLayout pins={pins} />}
      {pins?.length === 0 && searchTerm !== '' && !loading && (
        <div className='mt-10 text-center text-xl'>
          No pins found
        </div>
      )}
    </div>
  )
}

export default Search