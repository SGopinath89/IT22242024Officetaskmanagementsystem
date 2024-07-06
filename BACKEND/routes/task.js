const mongoose = require("mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/udb");

const userSchema = mongoose.Schema({
    description: {
        type: String,
    }
    // Add other fields if needed
});

module.exports = mongoose.model("task", userSchema);
