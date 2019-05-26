import React, {
  useState,
  useEffect,
  useContext,
  useRef,
  useCallback
} from "react";

import AuthContext from "../../context/auth-context";

import Spinner from "./../common/spinner/Spinner";
import BookingList from "./Bookings/BookingList";
import BookingsChart from "./Bookings/BookingsChart";
import BookingsControls from "./Bookings/BookingsControls";

const BookingsPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [outputType, setOutputType] = useState("list");

  const currentAuth = useContext(AuthContext);

  let isSubscribed = useRef(true);

  const fetchBookings = useCallback(async () => {
    setIsLoading(true);
    const requestBody = {
      query: `
        query {
          bookings {
            _id
            createdAt
            event {
              _id
              title
              price
              date
            }
          }
        }`
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

      if (isSubscribed.current) {
        setBookings(data.bookings);
        setIsLoading(false);
      }
    } catch (err) {
      if (isSubscribed.current) {
        setIsLoading(false);
      }
      throw err;
    }
  }, [currentAuth]);

  useEffect(() => {
    fetchBookings();

    return () => (isSubscribed.current = false);
  }, [fetchBookings]);

  const handleOnDelete = async bookingId => {
    setIsLoading(true);
    const requestBody = {
      query: `
        mutation CancelBooking($id: ID!) {
          cancelBooking(bookingId: $id) {
            _id
            title
          }
        }`,
      variables: {
        id: bookingId
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

      if (isSubscribed.current) {
        setBookings(prevState => {
          return prevState.filter(b => b._id !== bookingId);
        });
        setIsLoading(false);
      }
    } catch (err) {
      if (isSubscribed.current) {
        setIsLoading(false);
      }
      throw err;
    }
  };

  return (
    <React.Fragment>
      {isLoading ? (
        <Spinner />
      ) : (
        <React.Fragment>
          <BookingsControls
            activeOutputType={outputType}
            onChangeOutpuType={selectedOutputType =>
              setOutputType(selectedOutputType)
            }
          />
          {outputType === "list" ? (
            <BookingList bookings={bookings} onDelete={handleOnDelete} />
          ) : (
            <BookingsChart bookings={bookings} />
          )}
        </React.Fragment>
      )}
    </React.Fragment>
  );
};

export default BookingsPage;
