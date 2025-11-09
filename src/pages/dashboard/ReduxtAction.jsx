import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  increment,
  decrement,
  incremnetByamount,
} from "../../redux/slice/CounterSlice";

const ReduxtAction = () => {
  const dispatch = useDispatch();
  const { value } = useSelector((state) => state.counter);
  const [amount, setamount] = useState(0);
  console.log(value, "counter value");

  function handleincrementby1() {
    dispatch(increment());
  }

  function handledecrementBy1() {
    dispatch(decrement());
  }

  function incremnetamount() {
    dispatch(incremnetByamount(Number(amount)));
  }

  return (
    <>
      <div className="row">
        <div className="col-md-3">
          <button
            onClick={() => handleincrementby1()}
            type="button"
            className="btn btn-primary"
          >
            Add by 1
          </button>
        </div>
        <div className="col-md-3">
          <input
            onChange={(e) => setamount(e.target.value)}
            className="form-control"
          />
          <button
            onClick={() => incremnetamount()}
            className="btn btn-primary mt-2"
          >
            Add by Number
          </button>
        </div>
        <div className="col-md-3">
          <button
            onClick={() => handledecrementBy1()}
            className="btn btn-primary"
          >
            Decrement by 1
          </button>
        </div>
      </div>
      <h5 className="text-center mt-5">value : {value} </h5>
    </>
  );
};

export default ReduxtAction;
