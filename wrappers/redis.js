'use strict';

const redis = require('redis');

const conn = {
    client: null
};

exports.connect = (callback) => {
    conn.client = redis.createClient();
    conn.client.on('error', callback);
    conn.client.on('ready', () => {
        conn.client.PING(callback);
    });
};

exports.client = () => {
    return conn.client;
};