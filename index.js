'use strict';
const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const config = require('./secrets/rules');


const app = express();
const port = process.env.PORT || 3000;

app.use(morgan('[:date[web]] [:response-time ms] [:status] :method :url'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

app.use(require('./routes'));

/**
 * Start do Servidor
 */
app.listen(port, (err) => {
  console.log(`Api Server is up on port ${port}`);
  printAllRoutes();

function printAllRoutes() {
  function print(path, layer) {
      if (layer.route) {
          layer.route.stack.forEach(print.bind(null, path.concat(split(layer.route.path))))
      } else if (layer.name === 'router' && layer.handle.stack) {
          layer.handle.stack.forEach(print.bind(null, path.concat(split(layer.regexp))))
      } else if (layer.method) {
          console.log('%s /%s/', layer.method.toUpperCase(), path.concat(split(layer.regexp)).filter(Boolean).join('/'))
      }
  }

  function split(thing) {
      if (typeof thing === 'string') {
          return thing.split('/')
      } else if (thing.fast_slash) {
          return ''
      } else {
          var match = thing.toString().replace('\\/?', '').replace('(?=\\/|$)', '$').match(/^\/\^((?:\\[.*+?^${}()|[\]\\\/]|[^.*+?^${}()|[\]\\\/])*)\$\//)
          return match ? match[1].replace(/\\(.)/g, '$1').split('/') : '<complex:' + thing.toString() + '>'
      }
  }

  app._router.stack.forEach(print.bind(null, []))
}
});
