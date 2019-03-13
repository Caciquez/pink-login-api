'use strict';

const db = require('../secrets/rules');
const pg = require('pg');
const pool = new pg.Pool(db.conn);

exports.getPool = () => {
    if (pool) return pool; 
    pool = new pg.Pool(config);
    return pool;
};
