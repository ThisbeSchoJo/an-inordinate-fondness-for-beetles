import { useState, useEffect } from 'react';
   import { searchFireflyObservations } from '../services/inaturalistApi';

   export const useInaturalistData = (params = {}) => {
     const [data, setData] = useState(null);
     const [loading, setLoading] = useState(true);
     const [error, setError] = useState(null);

     useEffect(() => {
       const fetchData = async () => {
         try {
           setLoading(true);
           const result = await searchFireflyObservations(params);
           setData(result);
           setError(null);
         } catch (err) {
           setError(err.message || 'An error occurred while fetching data');
           setData(null);
         } finally {
           setLoading(false);
         }
       };

       fetchData();
     }, [JSON.stringify(params)]); // Re-fetch when params change

     return { data, loading, error };
   };