const path = require('path');
const { users, wishcards } = require('./seederData');

const User = require('./models/User');
const WishCard = require('./models/WishCard');

const MongooseConnection = require('./connection');

require('dotenv').config({ path: path.resolve(__dirname, '../../config/config.env') });

MongooseConnection.connect();

const importData = async () => {
  try {
    await User.deleteMany();
    await WishCard.deleteMany();
    await User.insertMany(users);
    await WishCard.insertMany(wishcards);

    // console.log('Data imported!');
    process.exit();
  } catch (error) {
    // console.error(error);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await User.deleteMany();

    // console.log('Data Destroyed!');
    process.exit();
  } catch (error) {
    // console.error(`${error}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
