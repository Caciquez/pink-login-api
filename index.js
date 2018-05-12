
const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const config = require('./secrets/rules');
const redis = require('./wrappers/db');
const mongoose = require('mongoose');

const app = express();
const port = process.env.PORT || 3000;

app.use(morgan('[:date[web]] [:response-time ms] [:status] :method :url'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());


redis.connectRedis((err, cb) => {
  if (err) return callback(err, 500);
  console.log('Redis Connected!');
  return callback(cb, 200);
});

app.use(require('./routes'));

/**
 * Start do Servidor
 */
app.listen(port, (err) => {
  console.log(`Api Server is up on port ${port}`);
  printAllRoutes();


  function split(thing) {
    if (typeof thing === 'string') {
      return thing.split('/');
    } else if (thing.fast_slash) {
      return '';
    }
    const match = thing.toString().replace('\\/?', '').replace('(?=\\/|$)', '$').match(/^\/\^((?:\\[.*+?^${}()|[\]\\\/]|[^.*+?^${}()|[\]\\\/])*)\$\//);
    return match ? match[1].replace(/\\(.)/g, '$1').split('/') : `<complex:${thing.toString()}>`;
  }

  function printAllRoutes() {
    function print(path, layer) {
      if (layer.route) {
        layer.route.stack.forEach(print.bind(null, path.concat(split(layer.route.path))));
      } else if (layer.name === 'router' && layer.handle.stack) {
        layer.handle.stack.forEach(print.bind(null, path.concat(split(layer.regexp))));
      } else if (layer.method) {
        console.log('%s /%s/', layer.method.toUpperCase(), path.concat(split(layer.regexp)).filter(Boolean).join('/'));
      }
    }

    app.router.stack.forEach(print.bind(null, []));
  }
});
