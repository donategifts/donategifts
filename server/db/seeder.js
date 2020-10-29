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
    process.exit();
  } catch (error) {
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await User.deleteMany();
    await WishCard.deleteMany();
    process.exit();
  } catch (error) {
    process.exit(1);
  }
};
if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
