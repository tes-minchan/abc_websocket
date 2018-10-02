const redisControl = require('lib/redis');
const _ = require('lodash');


module.exports = {

  sendAggregate : (client, data) => {
    let toSendData = {}
    
    data.coinList.forEach(coin => {
      toSendData[`${coin}_ASK`] = [];
      toSendData[`${coin}_BID`] = [];
      toSendData['coinName'] = coin;
    });

    redisControl.getSortedTable(data.redisTable, 1)
      .then(res => {
        res.forEach((item, index) => {
          const coin = data.redisTable[index][1].split('_')[1];
          const type = data.redisTable[index][1].split('_')[2];

          if(type === 'ASK') {            
            item.forEach((element, index) => {
              if(index%2 === 0) {
                if(data.askMarket[coin].indexOf(element.split('_')[0]) != -1) {

                  toSendData[`${coin}_ASK`].push({
                    price : item[index+1],
                    volume : element.split('_')[1],
                    market : element.split('_')[0]
                  });
                }
              }
            });

          }
          else if(type === 'BID') {
            item.forEach((element, index) => {
              if(index%2 === 0) {
                if(data.bidMarket[coin].indexOf(element.split('_')[0]) != -1) {
                  
                  toSendData[`${coin}_BID`].push({
                    price : item[index+1],
                    volume : element.split('_')[1],
                    market : element.split('_')[0]
                  });
                }
              }
            });
          }

        });

        client.send(JSON.stringify(toSendData));

      });


  },

  sendArbitrage : (client) => {

    const userArbInfo = client.arbitrage;

    let redisTable = [];
    let toSendData = {};

    redisTable.push(['hgetall',`${userArbInfo.korea_base_market}_${userArbInfo.base_currency}KRW_ASK`]);
    redisTable.push(['hgetall',`${userArbInfo.korea_base_market}_${userArbInfo.base_currency}KRW_BID`]);

    redisTable.push(['hgetall',`${userArbInfo.korea_counter_market}_${userArbInfo.counter_currency}KRW_ASK`]);
    redisTable.push(['hgetall',`${userArbInfo.korea_counter_market}_${userArbInfo.counter_currency}KRW_BID`]);

    redisTable.push(['hgetall',`${userArbInfo.abroad_market}_${userArbInfo.counter_currency}${userArbInfo.base_currency}_ASK`]);
    redisTable.push(['hgetall',`${userArbInfo.abroad_market}_${userArbInfo.counter_currency}${userArbInfo.base_currency}_BID`]);

    redisControl.getMultiTable(redisTable)
      .then(res => {
        res.forEach((item, index) => {     
          const tableName = redisTable[index][1].split('_');

          if(tableName[0] !== 'BINANCE') {

            if(tableName[2] === 'ASK') {
              toSendData[redisTable[index][1]] = {
                price  : 0,
                volume : 0
              };
              toSendData[redisTable[index][1]].price = Object.keys(item)[0];
              toSendData[redisTable[index][1]].volume = Object.values(item)[0];
            }
            else {
              const length = Object.keys(item).length - 1;
              toSendData[redisTable[index][1]] = {
                price  : 0,
                volume : 0
              };
              toSendData[redisTable[index][1]].price = Object.keys(item)[length];
              toSendData[redisTable[index][1]].volume = Object.values(item)[length];
            }
          }
          else {
            if(tableName[2] === 'ASK') {
              const askArr = _.map(item, (volume, price) => {
                return {
                  price : Number(price),
                  volume : volume
                };
              });
              const askSorted = _.sortBy(askArr, ['price', 'volume']);
              toSendData[redisTable[index][1]] = {
                price  : askSorted[0].price,
                volume : askSorted[0].volume
              };

            }
            else {
              const bidArr = _.map(item, (volume, price) => {
                return {
                  price : Number(price),
                  volume : volume
                };
              });

              const bidSorted = _.sortBy(bidArr, ['price', 'volume']);
              bidSorted.reverse();

              toSendData[redisTable[index][1]] = {
                price  : bidSorted[0].price,
                volume : bidSorted[0].volume
              };

            }
          }
        });

        client.send(JSON.stringify(toSendData));

      })
      .catch(err => {
        console.log(err);
      });

  }

}