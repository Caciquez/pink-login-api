'use strict';

const async = require('async');
const { validationResult, body } = require('express-validator/check');
const db = require('../wrappers/db');
const pool = db.getPool();
const query = require('../querys/user');
const errMsg = require('../wrappers/constants');
const middleware = require('../auth/auth');
const constants = require('../wrappers/constants');

exports.validateUserPSQL = (userInfo) => {
  return this.executeWithNext((req, res, next, callback) => {
    const email = req.body[userInfo];

    if (!userInfo) return next();

    body(userInfo).isEmail()(req, res, () => {
      if (!validationResult(req).isEmpty()) return callback('Inválido', 400);

      pool.query(query.getUserByEmail, [email]).then(result => {
        if (result.length < 1) return callback(errMsg.existentEmail, 404);
      }).catch((err) => { return callback(err, 404); })

      next();
    });
  });
};

exports.validateNewUser = (info) => {
  return this.executeWithNext((req, res, next, callback) => {

    if (Array.isArray(info)) {
      async.each(info,
        (data, cb) => data(req, res, () => cb(validationResult(req).isEmpty() ? null : true)),
        err => err ? callback(errMsg.invalidData, 400) : next());
    } else {
      info(req, res, () => {
        validationResult(req).isEmpty() ? next() : callback(errMsg.invalidData, 400);
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

    if (!date) next();

    body(date_birth).isBefore(minAge).isAfter(maxAge)(req, res, () => {
      if (!validationResult(req).isEmpty()) return callback(errMsg.invalidDate, 400);

      return next();
    });

  });

};

exports.sanitazeUserToken = () => {
    return this.executeWithNext((req, res, next, callback) => {
        middleware.authenticateToken(res, (err, user) => {
            if (err) return callback(err, 500);
            if (!user) return callback(constants.userNotFound, 404);

            // req.body[field_name] = user;
            next();
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
