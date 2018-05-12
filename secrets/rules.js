

const pgKnexAWS = {
  client: 'pg',
  connection: {
    host: '54.173.239.35',
    user: 'cacique',
    password: 'Aa123456',
    database: 'postgres',
  },
};

const pgKnexLocal = {
  client: 'pg',
  connection: {
    host: '127.0.0.1',
    user: 'postgres',
    password: 'skyline123',
    database: 'webTest',
  },
};


module.exports = {
  pgKnexAWS,
  pgKnexLocal,
};
