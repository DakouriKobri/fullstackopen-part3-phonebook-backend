// NPM Packages
const express = require('express');

const app = express();

let persons = [
  {
    id: 1,
    name: 'Arto Hellas',
    number: '040-123456',
  },
  {
    id: 2,
    name: 'Ada Lovelace',
    number: '39-44-5323523',
  },
  {
    id: 3,
    name: 'Dan Abramov',
    number: '12-43-234345',
  },
  {
    id: 4,
    name: 'Mary Poppendieck',
    number: '39-23-6423122',
  },
];

app.get('/api/persons', (request, response) => {
  response.json(persons);
});

app.get('/info', (request, response) => {
  const numberOfPeople = persons.length;

  const peopleInfo =
    numberOfPeople === 0
      ? 'Phonebook is empty.'
      : `Phone book has info for ${numberOfPeople} ${
          numberOfPeople > 1 ? 'people' : 'person'
        }.`;

  function dateTimeFormat(options) {
    return new Intl.DateTimeFormat('en-US', options);
  }

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

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
