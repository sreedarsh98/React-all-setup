import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "./slice/CounterSlice"

const store=configureStore({
  reducer:{
   counter:counterReducer
  }
})


export default store