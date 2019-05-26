import React, { useState, useContext, useEffect, useRef } from "react";

import AuthContext from "../../context/auth-context";

import "./Events.css";

import Modal from "../common/modal/Modal";
import EventList from "./Events/EventList";
import Spinner from "../common/spinner/Spinner";

const EventsPage = () => {
  const [creating, setCreating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [events, setEvents] = useState([]);

  const currentAuth = useContext(AuthContext);

  const titleEl = React.createRef();
  const priceEl = React.createRef();
  const dateEl = React.createRef();
  const descriptionEl = React.createRef();

  let isSubscribed = useRef(true);

  useEffect(() => {
    fetchEvents();

    return () => (isSubscribed.current = false);
  }, []);

  const fetchEvents = async () => {
    setIsLoading(true);
    const requestBody = {
      query: `
        query {
          events {
            _id
            title
            description
            date
            price
            creator {
              _id
              email
            }
          }
        }`
    };

    try {
      const response = await fetch("http://localhost:8000/graphql", {
        method: "POST",
        body: JSON.stringify(requestBody),
        headers: {
          "Content-Type": "application/json"
        }
      });

      if (response.status !== 200 && response.status !== 201) {
        throw new Error("Failed!");
      }

      const { data } = await response.json();

      if (isSubscribed.current) {
        setEvents(data.events);
        setIsLoading(false);
      }
    } catch (err) {
      if (isSubscribed.current) setIsLoading(false);
      throw err;
    }
  };

  const handleCreateEvent = async () => {
    setCreating(false);
    const event = {
      title: titleEl.current.value,
      price: +priceEl.current.value,
      date: dateEl.current.value,
      description: descriptionEl.current.value
    };

    if (
      event.title.trim().length === 0 ||
      event.price <= 0 ||
      event.date.trim().length === 0 ||
      event.description.trim().length === 0
    ) {
      return;
    }

    const requestBody = {
      query: `
        mutation CreateEvent($title: String!, $description: String!, $price: Float!, $date: String!){
          createEvent(eventInput: { 
            title: $title, 
            description: $description, 
            price: $price, 
            date: $date 
          }) {
            _id
            title
            description
            date
            price
          }
        }
      `,
      variables: {
        title: event.title,
        description: event.description,
        price: event.price,
        date: event.date
      }
    };

    try {
      const response = await fetch("http://localhost:8000/graphql", {
        method: "POST",
        body: JSON.stringify(requestBody),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currentAuth.token}`
        }
      });

      if (response.status !== 200 && response.status !== 201) {
        throw new Error("Failed!");
      }

      const { data } = await response.json();
      setEvents([
        ...events,
        {
          _id: data.createEvent._id,
          title: data.createEvent.title,
          description: data.createEvent.description,
          price: data.createEvent.price,
          date: data.createEvent.date,
          creator: {
            _id: currentAuth._id
          }
        }
      ]);
    } catch (err) {
      throw err;
    }
  };

  const handleShowDetails = eventId => {
    setSelectedEvent(events.find(e => e._id === eventId));
  };

  const handleBookEvent = async () => {
    const requestBody = {
      query: `
        mutation BookEvent ($selectedEventId: ID!){
          bookEvent(eventId: $selectedEventId) {
            _id
            createdAt
            updatedAt
          }
        }
        `,
      variables: {
        selectedEventId: selectedEvent._id
      }
    };

    try {
      const response = await fetch("http://localhost:8000/graphql", {
        method: "POST",
        body: JSON.stringify(requestBody),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currentAuth.token}`
        }
      });

      if (response.status !== 200 && response.status !== 201) {
        throw new Error("Failed!");
      }

      const { data } = await response.json();
      console.log(data);
      setSelectedEvent(null);
    } catch (err) {
      throw err;
    }
  };

  return (
    <React.Fragment>
      {creating && (
        <Modal
          title="Add a new event"
          canCancel
          canConfirm
          onCancel={() => setCreating(false)}
          onConfirm={handleCreateEvent}
        >
          <form>
            <div className="form-control">
              <label htmlFor="title">Title</label>
              <input type="text" id="title" ref={titleEl} />
            </div>
            <div className="form-control">
              <label htmlFor="price">Price</label>
              <input type="number" id="price" ref={priceEl} />
            </div>
            <div className="form-control">
              <label htmlFor="date">Date</label>
              <input type="dateTime-local" id="date" ref={dateEl} />
            </div>
            <div className="form-control">
              <label htmlFor="description">Description</label>
              <textarea id="description" rows="4" ref={descriptionEl} />
            </div>
          </form>
        </Modal>
      )}
      {selectedEvent && (
        <Modal
          title="Do you wanna book?"
          confirmText="Book"
          canCancel
          canConfirm={currentAuth.token}
          onCancel={() => setSelectedEvent(null)}
          onConfirm={handleBookEvent}
        >
          <h1>{selectedEvent.title}</h1>
          <h2>
            ${selectedEvent.price} -{" "}
            {new Date(selectedEvent.date).toLocaleDateString()}
          </h2>
          <p>{selectedEvent.description}</p>
        </Modal>
      )}
      {currentAuth.token && (
        <div className="events-control">
          <p>Share your own Events!</p>
          <button className="btn" onClick={() => setCreating(true)}>
            Create Event
          </button>
        </div>
      )}

      {isLoading ? (
        <Spinner />
      ) : (
        <EventList
          events={events}
          authUserId={currentAuth.userId}
          onViewDetails={handleShowDetails}
        />
      )}
    </React.Fragment>
  );
};

export default EventsPage;
