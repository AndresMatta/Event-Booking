import React from "react";

import "./EventList.css";

import EventItem from "./EventItem";

const EventList = props => {
  const events = props.events.map(event => {
    const isOwner = props.authUserId === event.creator._id;

    return (
      <EventItem
        key={event._id}
        eventId={event._id}
        title={event.title}
        price={event.price}
        date={event.date}
        isOwner={isOwner}
        onDetails={props.onViewDetails}
      />
    );
  });
  return <ul className="event__list">{events}</ul>;
};

export default EventList;
