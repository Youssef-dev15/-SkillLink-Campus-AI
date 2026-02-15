import Event from "../models/Event.js";

export const saveevent = async (req, res) => {
  const eventDate = new Date(req.body.date);
  const today = new Date();
  today.setHours(0,0,0,0);

  if (eventDate < today)
    return res.status(400).json({ msg: "Date invalide" });

  const event = new Event({
    ...req.body,
    creatorEmail: req.user.email
  });

  await event.save();
  res.json(event);
};


export const getevent = async (req, res) => {
  const events = await Event.find().sort({ date: 1 });
  res.json(events);
};

export const deleteevent = async (req, res) => {
  const event = await Event.findById(req.params.id);

  if (!event) return res.status(404).json({ msg: "Not found" });

  if (event.creatorEmail !== req.user.email)
    return res.status(403).json({ msg: "Not allowed" });

  await event.deleteOne();
  res.json({ msg: "Deleted" });
};
