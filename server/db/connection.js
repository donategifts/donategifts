const mongoose = require('mongoose');
const { log } = require('../helper/logger');

function connect(app, port, hostname) {
  const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  };

  mongoose.Promise = global.Promise;
  mongoose.set('useCreateIndex', true);
  mongoose.connect(process.env.MONGO_URI, options, (err, database) => {
    if (err) {
      log('Unable to connect to DB. Error:', err);
    } else {
      log(`Connected to Mongodb ${database.name}`);
      app.listen(port, hostname, () => {
        log(`Server running at http://${hostname}:${port}/`);
      });
    }
  });
}

module.exports = { connect };
