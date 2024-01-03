// NPM Packages
const mongoose = require('mongoose');

mongoose.set('strictQuery', false);

const url = process.env.MONGODB_URI;

mongoose
  .connect(url)
  .then(() => {
    console.log('Server connected to MongoDB');
  })
  .catch((error) => {
    console.log('Problem connecting to MongoDB:', error.message);
  });

function validateNumber(number) {
  return /^\d{2,3}-\d{5,}$/.test(number);
}

const personSchema = mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
  },
  number: {
    type: String,
    minLength: 8,
    validate: {
      validator: validateNumber,
      message: 'Number must start with 2 or 3 digits followed by a hyphen',
    },
  },
});

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model('Person', personSchema);
