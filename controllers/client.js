'use strict';
const mongoose = require('mongoose');
const clientData = require('../model/client');

exports.add = (req, res, callback) => {
  let newClient = new clientData(req.body);

  newClient.save((err, client) => {
    if (err) return callback(err, 404);
    else return callback(null, 200);
  })
};

exports.get = (req, res, callback) => {
  clientData.find((err, cb) => {
    if (err) return callback(err, 404);
    else return callback(cb, 200);
  })
};

exports.getOne = (req, res, callback) => {
  let name = req.body;
  clientData.find(name, (err, client) => {
    if (err) return callback(err, 404);
    else return callback(client, 200);
  })
};


