import WorkItem from "../models/WorkItem.js";

export const createWorkItem = async (req, res) => {
  try {
    const { title, description, priority, dueDate } = req.body;

    const work = await WorkItem.create({
      title,
      description,
      priority,
      dueDate,
      owner: req.userId
    });

    res.status(201).json(work);
  } catch (err) {
    res.status(500).json({ message: "Failed to create work item" });
  }
};

export const getMyWorkItems = async (req, res) => {
  try {
    const items = await WorkItem.find({ owner: req.userId }).sort("-createdAt");
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};