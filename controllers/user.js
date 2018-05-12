

const knex = require('./crud');


exports.add = (req, res, callback) => {
  const newUser = req.body;

  const user = 'users';
  knex.create(newUser, user, (err, cb) => {
    if (err) return console.log(err);
    console.log(cb);
    return callback(null, 200);
  });
};

exports.get = (req, res, callback) => {
  const getUser = req.body;

  const user = 'users';
  knex.get(getUser, user, (err, cb) => {
    if (err) return callback(null, 404);
    console.log(cb);
    return callback(null, 200);
  });
};
