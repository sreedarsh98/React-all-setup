
// axios method========================================================
import { useState, useEffect, useCallback } from "react";
import api from "../api/axiosinstance"; // uses your interceptors

export default function useFetch(url, dependencies = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async (controller) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(url, { signal: controller.signal });
      setData(response.data);
    } catch (err) {
      if (err.name === "CanceledError") return; // Ignore abort
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  }, [url]);

  useEffect(() => {
    if (!url) return;

    const controller = new AbortController();
    fetchData(controller);

    return () => controller.abort();
  }, [...dependencies, fetchData]);

  return { data, loading, error, refetch: () => fetchData(new AbortController()) };
}

// usage  const { data, loading, error } = useFetch("/products", []);   in component




// import { useState, useEffect } from 'react';

// function useFetch(url, options = {}) {
//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       setLoading(true);
//       setError(null); // Reset error on new fetch
//       try {
//         const response = await fetch(url, options);
//         if (!response.ok) {
//           throw new Error(`HTTP error! status: ${response.status}`);
//         }
//         const result = await response.json();
//         setData(result);
//       } catch (err) {
//         setError(err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [url, JSON.stringify(options)]); // Re-run effect if URL or options change

//   return { data, loading, error };
// }

// export default useFetch;

  // const { data, loading, error } = useFetch('https://jsonplaceholder.typicode.com/todos/1');

  // some time you need to stringfy data if its fetch









