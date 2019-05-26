import React from "react";

import "./EventItem.css";

const EventItem = ({ eventId, title, price, date, isOwner, onDetails }) => {
  return (
    <li className="event__list-item">
      <div>
        <h1>{title}</h1>
        <h2>
          ${price} - {new Date(date).toLocaleDateString()}
        </h2>
      </div>
      <div>
        {isOwner ? (
          <p>You're the owner of this event.</p>
        ) : (
          <button className="btn" onClick={onDetails.bind(this, eventId)}>
            View Details
          </button>
        )}
      </div>
    </li>
  );
};

export default EventItem;
