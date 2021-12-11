const mongoose = require('mongoose');
const log = require('../helper/logger');

function connect() {
  const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  };

  mongoose.Promise = Promise;
  mongoose.set('useCreateIndex', true);
  mongoose.connect(process.env.MONGO_URI, options, (err, database) => {
    if (err) {
      log.error('Unable to connect to DB. Error:', err);
    } else {
      require('./changeHandler/WishcardChangeHandler');

      log.info(
        `Connected to Mongodb ${database.name ? database.name : database.connections[0].name}`,
        {
          type: 'mongo_startup',
        },
      );
    }
  });
}

module.exports = { connect };
