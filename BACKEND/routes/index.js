var express = require('express');
var router = express.Router();
const userModel = require("../routes/users")
const Task = require("../routes/task")


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});





//localhost:44/create
//localhost:44/auth/create

router.post('/create', async function (req, res) {
  try {
    const { username, email, password } = req.body;

    // Check if user with the same username or email already exists
    const existingUser = await userModel.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ success: false, error: "Username or email already exists" });
    }

    // Create new user
    let newUser = new userModel({ username, email, password });
    let result = await newUser.save();

    res.status(201).json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});




router.patch('/update/:userId', async function (req, res) {
  try {
    const userId = req.params.userId;
    const updates = req.body;

    // Find user by id and update fields
    const result = await userModel.findByIdAndUpdate(userId, updates, { new: true });

    if (!result) {
      return res.status(404).send({ success: false, error: "User not found" });
    }

    res.send({ success: true, data: result });
  } catch (error) {
    res.status(500).send({ success: false, error: error.message });
  }
});







router.delete('/delete/:userId', async function (req, res) {
  try {
    const userId = req.params.userId;

    const result = await userModel.findByIdAndDelete(userId);

    if (!result) {
      return res.status(404).send({ success: false, error: "User not found" });
    }

    res.send({ success: true, message: "User deleted successfully" });
  } catch (error) {
    res.status(500).send({ success: false, error: error.message });
  }
});







router.get('/get/:userId', async function (req, res) {
  try {
    const userId = req.params.userId;

    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).send({ success: false, error: "User not found" });
    }

    res.send({ success: true, data: user });
  } catch (error) {
    res.status(500).send({ success: false, error: error.message });
  }
});



router.post('/task-create', async (req, res) => {
  try {
      const { description } = req.body;
      console.log('Received description:', description); // Log to see if description is received
      const newTask = new Task({ description });
      const savedTask = await newTask.save();
      console.log('Saved task:', savedTask); // Log saved task details
      res.status(201).json(savedTask);
  } catch (error) {
      console.error('Error creating task:', error);
      res.status(500).json({ error: error.message });
  }
});


// Update a task by ID
router.patch('/task-update/:taskId', async (req, res) => {
  try {
      const taskId = req.params.taskId;
      const updates = req.body;
      const updatedTask = await Task.findByIdAndUpdate(taskId, updates, { new: true });
      if (!updatedTask) {
          return res.status(404).json({ error: 'Task not found' });
      }
      res.json(updatedTask);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});

// Get all tasks
router.get('/task-get-all', async (req, res) => {
  try {
      const tasks = await Task.find();
      res.json(tasks);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});

// Delete a task by ID
router.delete('/task-delete/:taskId', async (req, res) => {
  try {
      const taskId = req.params.taskId;
      const deletedTask = await Task.findByIdAndDelete(taskId);
      if (!deletedTask) {
          return res.status(404).json({ error: 'Task not found' });
      }
      res.json({ message: 'Task deleted successfully' });
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});










module.exports = router;
