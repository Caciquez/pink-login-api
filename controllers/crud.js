

const db = require('../wrappers/db');
const secret = require('../secrets/rules');
const knex = require('knex')(secret.pgKnexLocal);


exports.create = (fields, table, callback) => {
  knex(table).insert(fields)
    .on('query-response', data => callback(null, data))
    .catch(err => callback(err, 404));
};

exports.get = (fields, table, callback) => {
  knex.select('*')
    .from(table)
    .where(fields)
    .on('query-response', data => callback(null, data))
    .catch((err => callback(err, 404)));
};

exports.update = (fields, table, callback) => {

};

exports.delete = (fields, table, callback) => {

};

