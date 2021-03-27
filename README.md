## Narkasa API for node.js (npm)
Narkasa API is an asynchronous node.js library for the Narkasa API designed to be easy to use.

### Install
`npm i narkasa-api`

### Set Credential
```Javascript
const Narksa = require("narkasa-api");
const apiKey = "";
const apiSecret = "";

Narkasa.setCredential(apiKey, apiSecret);
```


### Get Balance
`Narkasa.getBalance().then(balance=>console.log({balance}));`
```Javascript
//expected
{
  balance: [
    {
      symbol: 'UNI',
      total: 0.00386,
      available: 0.00386,
      reserved: 0,
      maxLength: 6
    },
    {
      symbol: '1INCH',
      total: 0,
      available: 0,
      reserved: 0,
      maxLength: 6
    },
    {
      symbol: 'TRY',
      total: 1.89079026,
      available: 1.89079026,
      reserved: 0,
      maxLength: 2
    },
    {
      symbol: 'HOT',
      total: 0,
      available: 0,
      reserved: 0,
      maxLength: 6
    },
    {
      symbol: 'ETH',
      total: 0.05043415,
      available: 0.02572115,
      reserved: 0.024713,
      maxLength: 8
    },
    {
      symbol: 'XRP',
      total: 3.02044,
      available: 3.02044,
      reserved: 0,
      maxLength: 6
    },
    {
      symbol: 'LINK',
      total: 0.001656,
      available: 0.001656,
      reserved: 0,
      maxLength: 8
    },
    {
      symbol: 'USDT',
      total: 36.269465499999995,
      available: 3.6494655,
      reserved: 32.62,
      maxLength: 6
    },
    {
      symbol: 'BTC',
      total: 9.4e-7,
      available: 9.4e-7,
      reserved: 0,
      maxLength: 8
    }
  ]
}
```

### Start Websocket Client
```Javascript
await Narkasa.userDataStream();
Narkasa.pushOnMessage((message)=>{
        console.log({message}));
    }
```

```Javascript
//expected
{
  message: {
    type: 'orderUpdate',
    order: {
      orderId: '*******',
      status: 'CANCELLED',
      market: 'ETHUSDT',
      orderType: 0,
      side: 0,
      price: 1500,
      amount: 0.01,
      filledAmount: 0,
      stopPrice: 0,
      time: 1616789285342
    }
  }
}
{
  message: { type: 'reservedUpdate', symbol: 'USDT', reserved: 33.24 }
}
{
  message: { type: 'balanceUpdate', symbol: 'USDT', available: 22.22 }
}
```

### Start Order Book
```Javascript
Narkasa.orderBook();//default symbol: "BTCUSDT"
//or
Narkasa.orderBook("ETHUSDT");

//load onMessage Function for order book
Narkasa.pushOnMessageOrderBook((message)=>{
        const { symbol, bidPrice: bid, askPrice: ask  } = message
        console.log(`for ${symbol}\nbid: ${bid}\nask: ${ask}`);
    });
```
```Javascript
//expected console.log
for ETHUSDT
bid: 1668.52
ask: 1673.59
```

### Buy Limit Order
`Narkasa.limitBuyOrder("ETHUSDT", 1500, 0.01).then(res=>console.log({res}));`
```Javascript
//expected
{
  res: {
    status: 'NEW',
    orderId: '****',
    market: 'ETHUSDT',
    orderType: 'LIMIT',
    side: 'BUY',
    price: 1500,
    amount: 0.01,
    filledAmount: 0,
    time: 1616790209584
  }
}
```

### Get All Markets 24h
`Narkasa.getAllMarkets().then(res=>console.log({res}));`
<details><summary>expected result</summary>
<p>

```Javascript
//expected
{
  res: [
    {
      symbol: 'BTCTRY',
      name: 'Bitcoin',
      firstSymbol: 'BTC',
      secondSymbol: 'TRY',
      changeAmount: 13969,
      changePercent: 3.32,
      last: 434497,
      firstBid: 433241,
      firstAsk: 433272,
      open: 420528,
      high: 434758,
      low: 414972,
      avg: 424965,
      volume: 3713472,
      volumeQty: 8.7383,
      openTime: 1616704025248,
      tradeCount: 1314
    },
    {
      symbol: 'HOTTRY',
      name: 'Holo',
      firstSymbol: 'HOT',
      secondSymbol: 'TRY',
      changeAmount: 0.00606,
      changePercent: 9.34,
      last: 0.07097,
      firstBid: 0.0704,
      firstAsk: 0.07095,
      open: 0.06491,
      high: 0.07615,
      low: 0.06477,
      avg: 0.0699,
      volume: 242667.3564,
      volumeQty: 3471636,
      openTime: 1616704055259,
      tradeCount: 639
    },
    {
      symbol: 'LINKTRY',
      name: 'ChainLink',
      firstSymbol: 'LINK',
      secondSymbol: 'TRY',
      changeAmount: 6.292,
      changePercent: 2.96,
      last: 218.778,
      firstBid: 217.807,
      firstAsk: 218.56,
      open: 212.486,
      high: 219.614,
      low: 203.964,
      avg: 210.074,
      volume: 345622.148,
      volumeQty: 1645.24,
      openTime: 1616704027248,
      tradeCount: 1478
    },
    {
      symbol: 'ETHTRY',
      name: 'Ethereum',
      firstSymbol: 'ETH',
      secondSymbol: 'TRY',
      changeAmount: 435.96,
      changePercent: 3.37,
      last: 13368.03,
      firstBid: 13358.05,
      firstAsk: 13377.37,
      open: 12932.07,
      high: 13434.73,
      low: 12743.85,
      avg: 13084.3,
      volume: 576906.41,
      volumeQty: 44.0915,
      openTime: 1616704051258,
      tradeCount: 743
    },
    {
      symbol: 'XRPTRY',
      name: 'Ripple',
      firstSymbol: 'XRP',
      secondSymbol: 'TRY',
      changeAmount: 0.253,
      changePercent: 6.03,
      last: 4.446,
      firstBid: 4.446,
      firstAsk: 4.483,
      open: 4.193,
      high: 4.704,
      low: 4.068,
      avg: 4.326,
      volume: 727081.419,
      volumeQty: 168072.45,
      openTime: 1616704005239,
      tradeCount: 1633
    },
    {
      symbol: 'UNITRY',
      name: 'Uniswap',
      firstSymbol: 'UNI',
      secondSymbol: 'TRY',
      changeAmount: 11.978,
      changePercent: 5.47,
      last: 231.006,
      firstBid: 226.681,
      firstAsk: 230.068,
      open: 219.028,
      high: 233.654,
      low: 210.74,
      avg: 221.963,
      volume: 203444.627,
      volumeQty: 916.57,
      openTime: 1616704031248,
      tradeCount: 490
    },
    {
      symbol: 'USDTTRY',
      name: 'Tether',
      firstSymbol: 'USDT',
      secondSymbol: 'TRY',
      changeAmount: -0.043,
      changePercent: -0.53,
      last: 8.014,
      firstBid: 8.014,
      firstAsk: 8.034,
      open: 8.057,
      high: 8.11,
      low: 7.967,
      avg: 8.037,
      volume: 1560246.841,
      volumeQty: 194132.99,
      openTime: 1616703757049,
      tradeCount: 1740
    },
    {
      symbol: '1INCHUSDT',
      name: '1inch',
      firstSymbol: '1INCH',
      secondSymbol: 'USDT',
      changeAmount: 0.2096,
      changePercent: 5.62,
      last: 3.9373,
      firstBid: 3.9189,
      firstAsk: 3.9762,
      open: 3.7277,
      high: 3.997,
      low: 3.7131,
      avg: 3.8533,
      volume: 1619.1567,
      volumeQty: 420.2,
      openTime: 1616704061261,
      tradeCount: 47
    },
    {
      symbol: 'HOTUSDT',
      name: 'Holo',
      firstSymbol: 'HOT',
      secondSymbol: 'USDT',
      changeAmount: 0.0007549,
      changePercent: 9.42,
      last: 0.0087709,
      firstBid: 0.0087572,
      firstAsk: 0.0088192,
      open: 0.008016,
      high: 0.009208,
      low: 0.008016,
      avg: 0.0086111,
      volume: 11063.9460017,
      volumeQty: 1284847,
      openTime: 1616704057260,
      tradeCount: 284
    },
    {
      symbol: 'ETHUSDT',
      name: 'Ethereum',
      firstSymbol: 'ETH',
      secondSymbol: 'USDT',
      changeAmount: 59.62,
      changePercent: 3.72,
      last: 1661.87,
      firstBid: 1662.65,
      firstAsk: 1668.86,
      open: 1602.25,
      high: 1678.74,
      low: 1578.77,
      avg: 1627.99,
      volume: 76902.83,
      volumeQty: 47.2379,
      openTime: 1616704055259,
      tradeCount: 4623
    },
    {
      symbol: 'BTCUSDT',
      name: 'Bitcoin',
      firstSymbol: 'BTC',
      secondSymbol: 'USDT',
      changeAmount: 1748.76,
      changePercent: 3.35,
      last: 53963.13,
      firstBid: 53935.71,
      firstAsk: 53949.94,
      open: 52214.37,
      high: 54250.61,
      low: 51265.46,
      avg: 52871.35,
      volume: 637401.13,
      volumeQty: 12.0557,
      openTime: 1616704061261,
      tradeCount: 7776
    },
    {
      symbol: 'XRPUSDT',
      name: 'Ripple',
      firstSymbol: 'XRP',
      secondSymbol: 'USDT',
      changeAmount: 0.04271,
      changePercent: 8.25,
      last: 0.56017,
      firstBid: 0.55415,
      firstAsk: 0.55846,
      open: 0.51746,
      high: 0.57563,
      low: 0.50644,
      avg: 0.53858,
      volume: 34726.66896,
      volumeQty: 64478.2,
      openTime: 1616704021241,
      tradeCount: 1307
    },
    {
      symbol: '1INCHTRY',
      name: '1inch',
      firstSymbol: '1INCH',
      secondSymbol: 'TRY',
      changeAmount: 2.184,
      changePercent: 7.33,
      last: 31.972,
      firstBid: 31.519,
      firstAsk: 31.992,
      open: 29.788,
      high: 32.338,
      low: 29.412,
      avg: 31.053,
      volume: 187854.813,
      volumeQty: 6049.49,
      openTime: 1616704053258,
      tradeCount: 691
    },
    {
      symbol: 'LINKUSDT',
      name: 'ChainLink',
      firstSymbol: 'LINK',
      secondSymbol: 'USDT',
      changeAmount: 0.7204,
      changePercent: 2.72,
      last: 27.1938,
      firstBid: 27.1343,
      firstAsk: 27.2112,
      open: 26.4734,
      high: 27.356,
      low: 25.3589,
      avg: 26.148,
      volume: 51722.8358,
      volumeQty: 1978.08,
      openTime: 1616704063261,
      tradeCount: 1016
    },
    {
      symbol: 'UNIUSDT',
      name: 'Uniswap',
      firstSymbol: 'UNI',
      secondSymbol: 'USDT',
      changeAmount: 1.1743,
      changePercent: 4.31,
      last: 28.4298,
      firstBid: 28.243,
      firstAsk: 28.7496,
      open: 27.2555,
      high: 28.7745,
      low: 26.2849,
      avg: 27.6079,
      volume: 3290.3095,
      volumeQty: 119.18,
      openTime: 1616702644198,
      tradeCount: 82
    }
  ]
}
```

</p>
</details>

Follow this [link](https://narkasa.com/register?ref=20202738) to register.
