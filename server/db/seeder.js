const path = require('path');
const { users, wishcards, agency } = require('./seederData');
const User = require('./models/User');
const WishCard = require('./models/WishCard');
const Agency = require('./models/Agency');
const MongooseConnection = require('./connection');
require('dotenv').config({ path: path.resolve(__dirname, '../../config/config.env') });

if (process.env.LOCAL_DEVELOPMENT) {
  MongooseConnection.connect();

  const insertData = async () => {
    try {
      await User.insertMany(users);
      await WishCard.insertMany(wishcards);
      await Agency.create({
        agency,
        accountManager: User.findOne({ email: 'janedoe@gmail.com' }).select('_id').lean().exec(),
      });
      process.exit();
    } catch (error) {
      process.exit(1);
    }
  };

  const deleteDataAndImport = async () => {
    try {
      await Agency.deleteMany();
      await User.deleteMany();
      await WishCard.deleteMany();

      await User.insertMany(users);
      await WishCard.insertMany(wishcards);
      const userList = await User.find({});
      const user = userList[0];
      await Agency.create({
        agency,
        accountManager: user._id,
      });
      process.exit();
    } catch (error) {
      process.exit(1);
    }
  };

  const destroyData = async () => {
    try {
      await Agency.deleteMany();
      await User.deleteMany();
      await WishCard.deleteMany();
      process.exit();
    } catch (error) {
      process.exit(1);
    }
  };
  if (process.argv[2] === '-d') {
    destroyData();
  } else if (process.argv[2] === '-i') {
    insertData();
  } else {
    deleteDataAndImport();
  }
} else {
  process.exit();
}
