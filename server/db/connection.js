const mongoose = require('mongoose');
const { log, logError } = require('../helper/logger');

function connect(app, port, hostname) {
  const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  };

  mongoose.Promise = Promise;
  mongoose.set('useCreateIndex', true);
  mongoose.connect(process.env.MONGO_URI, options, (err, database) => {
    if (err) {
      logError('Unable to connect to DB. Error:', err);
    } else {
      log(`Connected to Mongodb ${database.name ? database.name : database.connections[0].name}`);

      app.listen(port, hostname, () => {
        log(`Server running at http://${hostname}:${port}/`);
      });
    }
  });
}

module.exports = { connect };
