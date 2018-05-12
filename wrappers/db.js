'use strict';

const redis = require('redis');
const secret = require('../secrets/rules');
const knex = require('knex')(secret.pgKnexLocal);

const conn = {
    client: null
};

exports.connectPSQL = (callback) => {
    knex
}

exports.connectRedis = (callback) => {
    conn.client = redis.createClient();
    conn.client.on('error', callback);
    conn.client.on('ready', () => {
        conn.client.PING(callback);
    });
};

exports.client = () => {
    return conn.client;
};
