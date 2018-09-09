const redisControl = require('lib/redis');


module.exports = {

  sendAggregate : (client, data) => {
    let toSendData = {
      name : 'aggregate',
      data : []
    }
    redisControl.getSortedTable(data.redisTable, 1)
      .then(res => {
        res.forEach((item, index) => {
          const coin = data.redisTable[index][1].split('_')[1];
          const type = data.redisTable[index][1].split('_')[2];
          if(type === 'ASK') {
            item.forEach((element, index) => {

            });
            // supported market data.askMarket[coin]
            console.log();


          }
        })
      })

    // client.send("test")

  } 

}