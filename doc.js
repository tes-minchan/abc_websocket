
// frontend -->> websocket server

// only dashboard subscribe
let dashboard = {
  type : "subscribe",
  channels : [
    {
      name : "dashboard",
      product_ids : [
        {
          name : "COIN",
          ask_market : [],
          bid_market : []
        }
      ],
    }
  ]
}

// dashboard && market_status subscribe
let dashboard = {
  type : "subscribe",
  channels : [
    {
      name : "dashboard",
      product_ids : [
        {
          name : "COIN",
          ask_market : [],
          bid_market : []
        }
      ],
    },
    {
      name : "market_status"
    }
  ]
}

let orderbook = {
  type : "subscribe",
  channel : [
    {
      name : "orderbook",
      product_ids : [
        {
          name : "COIN",
          ask_market : [],
          bid_market : []
        }
      ]
    }
  ]
}
let aggregate = {
  type : "subscribe",
  channel : [
    {
      name : "aggregate",
      product_ids : [
        {
          name : "BTCKRW",
          ask_market : ['BITHUMB', 'GOPAX'],
          bid_market : ['UPBIT', 'BITHUMB']
        },
        {
          name : "ETHKRW",
          ask_market : ['BITHUMB', 'GOPAX'],
          bid_market : ['UPBIT', 'BITHUMB']
        }
      ]
    }
  ]
}

let aggregate = {
  type : "subscribe",
  channel : [
    {
      name : "dashboard",
      product_ids : [
        {
          name : "BTCKRW",
          ask_market : ['BITHUMB', 'GOPAX'],
          bid_market : ['UPBIT', 'BITHUMB']
        },
        {
          name : "ETHKRW",
          ask_market : ['BITHUMB', 'GOPAX'],
          bid_market : ['UPBIT', 'BITHUMB']
        }
      ]
    }
  ]
}
// subscribe message 수신 후 해당 market list로 redis table 한번 만 make 하여 저장.
