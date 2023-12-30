// NPM Packages
const mongoose = require('mongoose');

if (process.argv.length < 3) {
  console.log('Give password as 3rd argument');
  console.log(
    'And optionally person name and number as 4th and 5th arguments respectively'
  );
  process.exit(1);
}

const password = process.argv[2];
const personName = process.argv[3];
const personNumber = process.argv[4];

const url = `mongodb+srv://dakouri:${password}@cluster0.fduzxkk.mongodb.net/phonebookApp?retryWrites=true&w=majority`;

mongoose.set('strictQuery', false);
mongoose.connect(url);

const personSchema = mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model('Person', personSchema);

const person = new Person({
  name: personName,
  number: personNumber,
});

if (personName && personNumber) {
  person.save().then((person) => {
    console.log(`Added ${person.name} number ${person.number} to phonebook`);
    mongoose.connection.close();
  });
} else {
  Person.find({}).then((result) => {
    console.log('Phonebook:');
    result.forEach((person) => {
      console.log(`${person.name} ${person.number}`);
    });
    mongoose.connection.close();
  });
}
