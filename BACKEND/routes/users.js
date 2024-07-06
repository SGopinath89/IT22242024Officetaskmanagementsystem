const mongoose = require("mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/udb");
const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
    // Add other fields if needed
});

module.exports = mongoose.model("user", userSchema);
