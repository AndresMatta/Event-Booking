import React from "react";

import "./BookingsControls.css";

const BookingsControls = ({ activeOutputType, onChangeOutpuType }) => {
  return (
    <div className="bookings-control">
      <button
        className={activeOutputType === "list" ? "active" : ""}
        onClick={onChangeOutpuType.bind(this, "list")}
      >
        List
      </button>
      <button
        className={activeOutputType === "chart" ? "active" : ""}
        onClick={onChangeOutpuType.bind(this, "chart")}
      >
        Chart
      </button>
    </div>
  );
};

export default BookingsControls;
