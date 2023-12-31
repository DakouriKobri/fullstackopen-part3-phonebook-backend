// NPM Packages
const mongoose = require('mongoose');

mongoose.set('strictQuery', false);

const url = process.env.MONGODB_URI;

mongoose
  .connect(url)
  .then((result) => {
    console.log('Server connected to MongoDB');
  })
  .catch((error) => {
    console.log('Problem connecting to MongoDB:', error.message);
  });

const personSchema = mongoose.Schema({
  content: String,
  important: Boolean,
});

personSchema.set('toJSON', {
  Transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model('Person', personSchema);
