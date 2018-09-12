const redisControl = require('lib/redis');


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


  } 

}