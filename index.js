const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const app = express();
const Person = require("./models/person");

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

const errorHandler = (error, req, res, next) => {
    console.error(error.message);

    if (error.name === "CastError") {
        return res.status(400).send({ error: "malformatted id" });
    };

    return next(error);
};

const validateData = (req, res, next) => {
    const body = req.body;
    console.log(typeof body.name, typeof body.number)

    if (body.name === "" && body.number === "") {
        return res.status(400).json({
            error: "You need name and number"
        });
    }
    else if (body.name === "") {
        return res.status(400).json({
            error: "You need to add name"
        });
    }
    else if (body.number === "") {
        return res.status(400).json({
            error: "You need to add number"
        });
    };

    next();
};

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

app.get("/api/persons/:id", (req, res, next) => {
    Person.findById(req.params.id).then(p => {
        if (p) {
            res.json(p);
        }
        else {
            res.status(404).end();
        };
    }).catch(error => next(error));
});

app.delete("/api/persons/:id", (req, res, next) => {
    Person.findByIdAndDelete(req.params.id).then(p => {
        if (p) {
            res.status(204).end();
        }
        else {
            next(error);
        };
    });
});

app.post("/api/persons", validateData, (req, res) => {
    const body = req.body;

    const person = new Person({
        name: body.name,
        number: body.number
    });

    person.save().then(p => {
        res.json(person);
    });
});

app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Connected to port ${PORT}`);
});
