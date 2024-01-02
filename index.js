// NPM Packages
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

// Local Files
const Person = require('./models/person');

const app = express();

let persons = [];

function dateTimeFormat(options) {
  return new Intl.DateTimeFormat('en-US', options);
}

function unknownEndpoint(request, response) {
  return response.status(404).send({ message: 'Unknown endpoint' });
}

function errorHandler(error, request, response, next) {
  console.error(error.message);

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'Malformed id' });
  } else if (error.name === 'ValidationError') {
    return response.status(400).send({ error: error.message });
  }

  next(error);
}

morgan.token('body', (request, response) => {
  return request.body && JSON.stringify(request.body);
});

app.use(cors());
app.use(express.static('dist'));
app.use(express.json());
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body')
);

app.get('/info', (request, response, next) => {
  Person.find({})
    .then((fetchedPersons) => {
      persons = fetchedPersons;
    })
    .catch((error) => next(error));

  const numberOfPeople = persons.length;

  const peopleInfo =
    numberOfPeople === 0
      ? 'Phonebook is empty.'
      : `Phone book has info for ${numberOfPeople} ${
          numberOfPeople > 1 ? 'people' : 'person'
        }.`;

  const weekday = dateTimeFormat({
    weekday: 'short',
  }).format();

  const monthAndDay = dateTimeFormat({
    month: 'short',
    year: '2-digit',
  }).format();

  const time = dateTimeFormat({
    timeStyle: 'long',
    hour12: false,
  }).format();

  const timeZoneName = dateTimeFormat({ timeStyle: 'full' })
    .formatToParts()
    .find((item) => item.type === 'timeZoneName').value;

  const dateTimeInfo = `${weekday} ${monthAndDay} ${time} (${timeZoneName})`;

  const info = `
  <p>${peopleInfo}</p>
  <p>${dateTimeInfo}</p>
  `;

  response.send(info);
});

app.get('/api/persons', (request, response) => {
  Person.find({}).then((fetchedPersons) => {
    response.json(fetchedPersons);
  });
});

app.get('/api/persons/:id', (request, response, next) => {
  const id = request.params.id;
  Person.findById(id)
    .then((returnedPerson) => {
      if (returnedPerson) {
        response.json(returnedPerson);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => next(error));
});

app.delete('/api/persons/:id', (request, response, next) => {
  const id = request.params.id;

  Person.findByIdAndDelete(id)
    .then((person) => {
      if (!person) {
        response.status(404).end();
      } else {
        response.status(204).end();
      }
    })
    .catch((error) => next(error));
});

app.post('/api/persons', (request, response, next) => {
  const { name, number } = request.body;

  if (!name) return response.status(400).json({ error: 'Name is missing' });
  if (!number) return response.status(400).json({ error: 'Number is missing' });

  const person = new Person({ name, number });

  person
    .save()
    .then((savedPerson) => {
      response.json(savedPerson);
    })
    .catch((error) => next(error));
});

app.put('/api/persons/:id', (request, response, next) => {
  const id = request.params.id;
  const { name, number } = request.body;

  if (!name) return response.status(400).json({ error: 'Name is missing' });
  if (!number) return response.status(400).json({ error: 'Number is missing' });

  const person = { name, number };

  Person.findByIdAndUpdate(id, person, {
    new: true,
    runValidators: true,
    context: 'query',
  })
    .then((updatePerson) => {
      response.json(updatePerson);
    })
    .catch((error) => next(error));
});

app.use(unknownEndpoint);
app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
