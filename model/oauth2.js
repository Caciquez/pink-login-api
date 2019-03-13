'use strict';
const redis = require('redis');
let db = redis.createClient();

let keys = {
    token: 'tokens:%s',
    client: 'client:%s',
    refreshToken: 'refresh_tokens:%s',
    grantTypes: 'clients:%s:grant_types',
    user: 'users:%s'
};

exports.getAcessToken = (acessToken, callback) => {
    

};

