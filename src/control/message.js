
const subscribe = require('./subscribe');

module.exports = {

  setSubsType : (ws, data) => {
    if(data.type === 'subscribe') {

      ws.subscribe = [];

      data.channel.forEach(element => {
        let channel = {
          name : element.name,
          askMarket : {},
          bidMarket : {},
          redisTable : []
        }

        element.product_ids.forEach(item => {
          channel.askMarket[item.name] = item.ask_market;
          channel.bidMarket[item.name] = item.bid_market;

          channel.redisTable.push(['zrange',`Aggregate_${item.name.toUpperCase()}_ASK`, 0, -1, 'WITHSCORES']);
          channel.redisTable.push(['zrange',`Aggregate_${item.name.toUpperCase()}_BID`, 0, -1, 'WITHSCORES']);

        });
        
        ws.subscribe.push(channel);
      });

    }
  },

  sendData : (client) => {
    client.subscribe.forEach(element => {
      if(element.name === 'aggregate') {
        subscribe.sendAggregate(client, element);
      }


    });

  }



}