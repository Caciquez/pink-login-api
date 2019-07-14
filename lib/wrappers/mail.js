'use strict';
const secrets = require('../../config/rules');
const nodemailer = require('nodemailer');

const conn = {
    transporter: null
};

exports.connect = (callback) => {
    conn.transporter = nodemailer.createTransport(secrets.config);
    this.test(callback);
};

exports.test = (callback) => {
    conn.transporter.verify(callback);
};

exports.send = (options, callback) => {
    conn.transporter = nodemailer.createTransport(secrets.config);
    if (!options) return callback('Mailer Error');
    
    options.from = '"iSim!" <victorcaciquinho@gmail.com>';
    conn.transporter.sendMail(options, callback);
};
