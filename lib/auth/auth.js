'use strict'
const crypto = require('crypto');
const redis = require('redis');
let redisClient = redis.createClient();
const debug = true

exports.authenticateToken = (key) => {
  if (debug) console.log("authenticateToken")

  redisClient.GET(key, (err, cb) => {
    if (err) return err
    console.log(cb)

  })
}

exports.generateUserToken = (token_data, callback) => {
  if (debug) console.log("generateUserToken")
  const { id, email } = token_data

  const hash = crypto.createHash('sha512').update(email).digest('hex');
  const key = `user${id}`
  const token_ttl = 604800

  redisClient.set(key, hash, (err) => {
    if (err) return {msg: 'Redis DB Error', err: 500}; // Valído apenas se um CB chegou pois o retorno do SET ou tem um cb dizendo 'OK' ou null caso aja algum error.
    return redisClient.EXPIRE(key , token_ttl, (err) => {
      if (err) return {msg: 'Redis DB Error', err: 500};
    })
  })
}