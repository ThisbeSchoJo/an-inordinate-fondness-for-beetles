import axios from 'axios';

   // Base URL for the iNaturalist API
   const API_BASE_URL = 'https://api.inaturalist.org/v1';

   // Create an axios instance with default config
   const api = axios.create({
     baseURL: API_BASE_URL,
     headers: {
       'Content-Type': 'application/json',
     },
   });

   // Function to search for firefly observations
   export const searchFireflyObservations = async (params = {}) => {
     try {
       // Default parameters for firefly search
       const defaultParams = {
         taxon_id: 48019, // This is the taxon ID for fireflies (Lampyridae)
         per_page: 20,
         ...params,
       };

       const response = await api.get('/observations', { params: defaultParams });
       return response.data;
     } catch (error) {
       console.error('Error fetching firefly observations:', error);
       throw error;
     }
   };


   // Function to get details of a specific observation
   export const getObservationDetails = async (observationId) => {
    try {
      const response = await api.get(`/observations/${observationId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching observation details for ID ${observationId}:`, error);
      throw error;
    }
  };

  // Add more functions as needed for other API endpoints