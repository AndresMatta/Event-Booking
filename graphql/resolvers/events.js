const Event = require("../../models/event");
const User = require("../../models/user");
const { transformEvent } = require("./merge");

const event = async eventId => {
  try {
    const fetchedEvent = await Event.findById(eventId);

    if (!fetchedEvent) throw new Error("The given event does not exists");

    return transformEvent(fetchedEvent);
  } catch (err) {
    throw err;
  }
};

const events = async eventsIds => {
  try {
    const results = await Event.find({ _id: { $in: eventsIds } });
    return results.map(result => {
      return transformEvent(result);
    });
  } catch (err) {
    throw err;
  }
};

module.exports = {
  events: async () => {
    try {
      const events = await Event.find();
      return events.map(result => {
        return transformEvent(result);
      });
    } catch (err) {
      throw err;
    }
  },
  createEvent: async ({ eventInput }, req) => {
    if (!req.isAuth) throw new Error("Unauthenticated");
    try {
      const newEvent = new Event({
        title: eventInput.title,
        description: eventInput.description,
        price: +eventInput.price,
        date: new Date(eventInput.date),
        creator: req.userId
      });
      creator = await User.findById(req.userId);

      if (!creator) throw new Error("User does not exists.");

      creator.createdEvents.push(newEvent);
      await creator.save();

      const result = await newEvent.save();

      return transformEvent(result);
    } catch (err) {
      throw err;
    }
  }
};
