const DataLoader = require("dataloader");

const Event = require("../../models/event");
const User = require("../../models/user");

const { dateToString } = require("../../utils/date");

const eventLoader = new DataLoader(eventIds => {
  return events(eventIds);
});

const userLoader = new DataLoader(userIds => {
  return User.find({ _id: { $in: userIds } });
});

const user = async userId => {
  const result = await userLoader.load(userId.toString());
  return {
    ...result._doc,
    createdEvents: () => eventLoader.loadMany(result._doc.createdEvents)
  };
};

const event = async eventId => {
  try {
    const fetchedEvent = await eventLoader.load(eventId.toString());

    if (!fetchedEvent) throw new Error("The given event does not exists");

    return fetchedEvent;
  } catch (err) {
    throw err;
  }
};

const events = async eventIds => {
  try {
    const results = await Event.find({ _id: { $in: eventIds } });
    return results
      .sort((a, b) => {
        return (
          eventIds.indexOf(a._id.toString()) -
          eventIds.indexOf(b._id.toString())
        );
      })
      .map(result => {
        return transformEvent(result);
      });
  } catch (err) {
    throw err;
  }
};

const transformEvent = result => {
  return {
    ...result._doc,
    date: dateToString(result.date),
    creator: user.bind(this, result.creator)
  };
};

const transformBooking = booking => {
  return {
    ...booking._doc,
    user: user.bind(this, booking.user),
    event: event.bind(this, booking.event),
    createdAt: dateToString(booking.createdAt),
    updatedAt: dateToString(booking.updatedAt)
  };
};

exports.transformEvent = transformEvent;
exports.transformBooking = transformBooking;
// exports.user = user;
// exports.event = event;
// exports.events = events;
