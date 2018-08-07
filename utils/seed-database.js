

const mongoose = require('mongoose');

// const DATABASE_URL = 'mongodb://dev:devdev1@ds115022.mlab.com:15022/back-end-capstone';

const {DATABASE_URL} = require('../config');
console.log(DATABASE_URL);
const Food = require('../db/models/food');

const seedFoods = require('../db/seed/foods');
// const seedFolders = require('../db/seed/folders');

console.log(`Connecting to mongodb at ${DATABASE_URL}`);
mongoose.connect(DATABASE_URL)
  .then(() => {
    console.info('Dropping Database');
    return mongoose.connection.db.dropDatabase();
  })
  .then(() => {
    console.info('Seeding Database');
    return Promise.all([
      Food.insertMany(seedFoods),

      // Folder.insertMany(seedFolders),
      // Folder.createIndexes(),
    ]);
  })
  .then(() => {
    console.info('Disconnecting');
    return mongoose.disconnect();
  })
  .catch(err => {
    console.error(err);
    return mongoose.disconnect();
  });
