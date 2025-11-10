import React from 'react'
import { useParams } from "react-router-dom";

const ProductDetails = () => {
  const { id } = useParams(); // get ID from URL
  console.log(id);
  
  return (
    <>
    <p>hai detail page </p>
    </>
  )
}

export default ProductDetails