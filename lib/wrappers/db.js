'use strict';

const db = require('../../config/rules');
const pg = require('pg');
let pool = new pg.Pool(db.conn);

exports.getPool = () => {
    if (pool) return pool; 
    pool = new pg.Pool(db.conn);
    return pool;
};
