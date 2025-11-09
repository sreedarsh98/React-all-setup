import { createSlice } from "@reduxjs/toolkit";

const initialvalue  ={
  value:0
}

export const  counterSlice =createSlice({
  name:'counter',
  initialState:initialvalue,
  reducers:{
    increment:(state)=>{
      state.value+=1
    },
    decrement:(state)=>{
      state.value -= 1
    },
    incremnetByamount:(state,action)=>{
      state.value += action.payload
    }
  }
})

export const  {increment,decrement,incremnetByamount}=counterSlice.actions;
export default counterSlice.reducer