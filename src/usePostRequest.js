import { useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

const usePostRequest = (url) => {
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  const executePostRequest = async (data) => {
    const token = Cookies.get("token");

    try {
      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      const response = await axios.post(url, data, { headers });
      console.log(response)
      setResponse(response.data);
      return response.data;
    } catch (error) {
      console.log(error)
      setError(error);
      return error; 
    }
  };

  return { executePostRequest, response, error };
};

export default usePostRequest;
