'use strict';

const async = require('async');
const db = require('../secrets/rules');
const { validationResult, body } = require('express-validator/check');


exports.validateUserPSQL = (userInfo) => {
  return this.executeWithNext((req, res, next, callback) => {

    const email = req.body[userInfo];

    if (!userInfo) return next();

    body(userInfo).isEmail()(req, res, () => {
      if (!validationResult(req).isEmpty()) return callback('Inválido', 400);

      db.knex('users').where('email', email)
        .then(result => {
          if (result.length < 1) return callback('Inválido 2', 404);
        }).catch((err) => { return callback(err, 404); });

      next();

    });
  });
};

exports.validateNewUser = (info) => {
  return this.executeWithNext((req, res, next, callback) => {

    if (Array.isArray(info)) {
      async.each(info,
        (data, cb) => data(req, res, () => cb(validationResult(req).isEmpty() ? null : true)),
        err => err ? callback('dados invalidos', 400) : next());
    } else {
      info(req, res, () => {
        validationResult(req).isEmpty() ? next() : callback('dado invalido', 400);
      })
    }
  });
};

exports.validateDateBirth = (date) => {
  return this.executeWithNext((req, res, next, callback) => {

    let d = new Date();
    let year = d.getFullYear();
    let month = d.getMonth();
    let day = d.getDate();
    let minAge = new Date(year - 18, month, day).toDateString();
    let maxAge = new Date(year - 100, month, day).toDateString();

    const date_birth = req.body[date];

    console.log("date" + date_birth);
    console.log("MIN" + minAge);
    console.log("MAX" + maxAge);

    if (!date) next();

    body(date_birth).isBefore(minAge).isAfter(maxAge)(req, res, () => {
      if (!validationResult(req).isEmpty()) return callback('Data Invalida.', 400);

      return next();
    });

  });

};



exports.execute = (func) =>
  (req, res) =>
    func(req, res, (err, code, ret) =>
      execCallback(res, err, code, ret));


exports.executeWithNext = (func) =>
  (req, res, next) =>
    func(req, res, next, (err, code, ret) =>
      execCallback(res, err, code, ret));


function execCallback(res, err, code, ret) {
  if (err) {
    // Não retorna a msg de erro original para o client caso seja um erro interno
    if (code >= 500) {
      ret = { error: 'Internal Server Error.' };
      console.error(err);
    } else {
      ret = { error: err };
    }
  }
  if (ret && code !== 204) {
    res.status(code).send(ret);
  } else {
    res.sendStatus(code);
  }
}
