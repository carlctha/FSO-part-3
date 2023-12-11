const mongoose = require("mongoose");
require("dotenv").config();

const url = process.env.URL;

mongoose.set("strictQuery", false);
mongoose.connect(url).then(result => {
    console.log("Connected to MongoDB");
}).catch(error => {
    console.log("Could not connect to MongoDB: ", error.message);
});

const personSchema = new mongoose.Schema({
    name: String,
    number: String
});

personSchema.set("toJSON", {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    }
});

module.exports = mongoose.model("Person", personSchema);
