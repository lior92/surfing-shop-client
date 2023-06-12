import axios from "axios";
import { useState, useEffect } from "react";
import Cookies from 'js-cookie';

const useAxiosFetch = (url, dataKey) => {

  const [data, setData] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState(null);



  useEffect(() => {
    const token = Cookies.get('token');

    axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}` 
      }
    })
    

      .then((response) => {
        // console.log(response)
        if (response.data.success) {

          setData(response.data[dataKey]);
        }
        setLoading(false);
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  }, [url, dataKey]);

  return { data, isLoading, error };
};

export default useAxiosFetch;
