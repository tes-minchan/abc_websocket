const config   = require('config');
const redis    = require('redis');
const bluebird = require('bluebird');

bluebird.promisifyAll(redis);

const redisClientQuotes    = redis.createClient(config.redisQuotes);
const redisClientAggregate = redis.createClient(config.redisAggregate);

module.exports = {

  getSortedTable : (table, db, orderby) => {
    if(db === 0) {
      return redisClientQuotes.multi(table).execAsync();

    }
    else if (db === 1) {
      return redisClientAggregate.multi(table).execAsync();
    }
  }



}