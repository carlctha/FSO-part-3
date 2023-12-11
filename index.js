const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const mongoose = require("mongoose");
const { ObjectId } = require("mongodb");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("dist"));

morgan.token("post-data", req => {
    if (req.method === "POST") {
        return JSON.stringify(req.body);
    };
    return "";
});

app.use(
    morgan(':method :url :status :res[content-length] - :response-time ms :post-data', {
      skip: (req) => req.method !== 'POST',
    })
);

app.use(morgan('tiny', {
    skip: (req) => req.method === 'POST',
}));

const randomInt = () => Math.floor(Math.random() * 1000000);

const password = process.argv[2];

const url = `mongodb+srv://fullstack:${password}@cluster0.nekwkid.mongodb.net/personsApp?retryWrites=true&w=majority`;

mongoose.set("strictQuery", false);
mongoose.connect(url);

const personSchema = new mongoose.Schema({
    name: String,
    number: String
});

const Person = mongoose.model("Person", personSchema);

app.get("/api/persons", (req, res) => {
    Person.find({}).then(result => {
        res.json(result);
    });
});

app.get("/info", (req, res) => {
    currDate = new Date();
    Person.find({}).then(result => {
        res.send(
            `
            <p>Phonebook has info for ${result.length} people</p>
            <p>${currDate}</p>
            `
        );
    });
});

/* app.get("/api/persons/:id", (req, res) => {
    const id = Number(req.params._id);
    Person.findById(ObjectId(id)).then(p => {
        if (p) {
            res.json(p);
        }
        else {
            res.status(404).end();
        };
    });
});

app.delete("/api/persons/:id", (req, res) => {
    const id = Number(req.params.id);
    Person.findByIdAndDelete(id).then(p => {
        res.status(204).end();
    });
});

app.post("/api/persons", (req, res) => {
    const body = req.body;

    if (!body.name && !body.number) {
        return res.status(400).json({
            error: "You need name and number"
        });
    }
    else if (!body.name) {
        return res.status(400).json({
            error: "You need to add name"
        });
    }
    else if (!body.number) {
        return res.status(400).json({
            error: "You need to add number"
        });
    };

    const person = new Person({
        name: body.name,
        number: body.number
    });

    person.save().then(p => {
        res.json(person);
    });
});
 */
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Connected to port ${PORT}`);
});
