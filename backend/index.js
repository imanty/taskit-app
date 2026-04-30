// Run app in terminal cd /backend/
// run index.js 

// Dependancies 
require("dotenv").config();
require("node:dns/promises").setServers(["1.1.1.1", "8.8.8.8"]);
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors"); 

// App config
const port = 3000; 
const app = express();

// Middleware setup
app.use(express.json()); // for parsing application/json
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || origin.endsWith(".vercel.app")) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));

// Mongo setup
(async () => {
  try{
    //Setting autoIndex to false
    mongoose.set("autoIndex", false);
    //Attempt to connect to cluster
    await mongoose.connect(process.env.MONGO_URI);
    console.log("🤖 MongoDB connected!");
    //Sync indexes
    await Task.syncIndexes();
    console.log("📈 Indexes created!");
    //App startup
    app.listen(port, () => {
        console.log(`🙉 To Do App listening on port ${port}`);
    });
  }
    catch (error){
      console.error(`Startup error: ${error}`);
  }
})();

// Define the task schema
const taskSchema = new mongoose.Schema({
  title: {type: String, required: true},
  completed: {type: Boolean, required: true, default: false},
  description: {type: String, required: true},
  dueDate: {type: Date, required: true},
  dateCreated: {type: Date, required: true, default: Date.now}
});

// Define indexers for sorting
taskSchema.index({ dueDate: 1 });
taskSchema.index({ dateCreated: 1 });

const Task = mongoose.model("Task", taskSchema);

// API routes
app.get("/get/example", async (req, res) => {
  res.send("Hello! I am a message from the backend")
});

//Get all tasks
app.get('/api/tasks', async (req, res) => {
  try {
    const { sortBy } = req.query; // ?sortBy=dueDate or ?sortBy=dateCreated
    let sortOption = {};

    if (sortBy === 'dueDate') {
        sortOption = { dueDate: 1 }; // Ascending
    } 
    else if (sortBy === 'dateCreated') {
        sortOption = { dateCreated: 1 };
    }

    const tasks = await Task.find({}).sort(sortOption);

    if (!tasks) {
      return res.status(404).json({ message: "Tasks not found!" });
    }
    res.json(tasks);
  } 
  catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Error grabbing tasks!" });
  } 
});

// Create new Task and it to the tasks array/list
app.post('/api/tasks/todo', async (req, res) => {
  try {
    const { title, description, dueDate } = req.body;
    const taskData = { title, description, dueDate };
    const createTask = new Task(taskData);
    const newTask = await createTask.save();

    res.json({ task: newTask, message: "✅ New task created successfully!" });
  }
  catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "❌ Error creating the task!" });
  }
});

// Update a task
app.put('/api/tasks/update/:id', async (req, res) => {
  try {
    const { title, description, dueDate } = req.body;
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      { title, description, dueDate },
      { new: true }
    );
    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found!" });
    }
    res.json({ task: updatedTask, message: "✅ Task updated successfully!" });
  }
  catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "❌ Error updating the task!" });
  }
});

// Mark task as completed
app.patch('/api/tasks/complete/:id', async (req, res) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      { completed: true },
      { new: true }
    );
    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found!" });
    }
    res.json({ task: updatedTask, message: "✅ Task marked as completed!" });
  }
  catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "❌ Error completing the task!" });
  }
});

// Mark task as not completed
app.patch('/api/tasks/notComplete/:id', async (req, res) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      { completed: false },
      { new: true }
    );
    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found!" });
    }
    res.json({ task: updatedTask, message: "✅ Task marked as not completed!" });
  }
  catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "❌ Error marking task as incomplete!" });
  }
});

// Delete a task
app.delete('/api/tasks/delete/:id', async (req, res) => {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.id);
    if (!deletedTask) {
      return res.status(404).json({ message: "Task not found!" });
    }
    res.json({ task: deletedTask, message: "✅ Task deleted successfully!" });
  }
  catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "❌ Error deleting the task!" });
  }
});