const mongoose = require("mongoose");
require("dotenv").config();


const password = process.argv[2];
const url = `mongodb+srv://fullstack:${password}@cluster0.nekwkid.mongodb.net/personsApp?retryWrites=true&w=majority`;

const personSchema = new mongoose.Schema({
    name: String,
    number: String
});

const Person = mongoose.model("Person", personSchema);

mongoose.set("strictQuery", false);

mongoose.connect(url);

if (password !== process.env.PASSWORD) {
    console.log("Wrong password");
    process.exit(1);
};

if (process.argv.length === 3) {
    console.log("Phonebook: ");
    Person.find({}).then(result => {
        result.forEach(p => {
            console.log(`${p.name} ${p.number}`);
        });
        mongoose.connection.close();
        process.exit(1);
    });
}
else if (process.argv.length < 5) {
    console.log("Missing input");
    process.exit(1);
};

if (process.argv.length === 5) {
    const name = process.argv[3];
    const number = process.argv[4];
    const person = new Person({
        name: name,
        number: number,
    });

    person.save().then(result => {
        console.log(`Added ${name} number ${number} to phonebook`);
        mongoose.connection.close();
    });
};
