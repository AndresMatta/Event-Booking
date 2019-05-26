import React from "react";

import "./BookingList.css";

const BookingList = ({ bookings, onDelete }) => {
  return (
    <ul className="booking__list">
      {bookings.map(booking => {
        return (
          <li key={booking._id} className="booking__list-item">
            <div className="booking__list-item-data">
              {booking.event.title} -
              {new Date(booking.createdAt).toLocaleDateString()}
            </div>
            <div className="booking__list-item-actions">
              <button
                className="btn"
                onClick={onDelete.bind(this, booking._id)}
              >
                Cancel
              </button>
            </div>
          </li>
        );
      })}
    </ul>
  );
};

export default BookingList;
