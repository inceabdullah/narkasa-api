const {
    tradeService: {getSignature, getBalance, getAllMarkets, limitBuyOrder, limitSellOrder, credential: tradeCredential},
    wsService: {
        startWS, userDataStream, pushOnMessage,
        orderBook, pushOnMessageOrderBook,
        credential: wsCredential }
} = require("./services/");
module.exports = {
    credential: {
        apiKey: null,
        apiSecret: null,
        signature: null
    },
    setCredential: function(apiKey, apiSecret){
        const signature = getSignature(apiKey, apiSecret);
        this.credential = { apiKey, apiSecret, signature };
        tradeCredential.apiKey = apiKey;
        tradeCredential.apiSecret = apiSecret;
        wsCredential.apiKey = apiKey;
        wsCredential.signature = signature;
    },
    getBalance: async function(asset){
        return getBalance();
    },

    getAllMarkets: async function(){
        return getAllMarkets();
    },

    startWS: async function(){
        return startWS();
    },

    startUserDataStream: async function(){
        return userDataStream();
    },

    pushOnMessage: function(cb){
        return pushOnMessage(cb);
    },

    orderBook: function(symbol){
        return orderBook(symbol);
    },

    pushOnMessageOrderBook: function(cb){
        return pushOnMessageOrderBook(cb);
    },

    limitBuyOrder: async function(symbol, price, amount){
        return limitBuyOrder(symbol, price, amount);
    },

    limitSellOrder: async function(symbol, price, amount){
        return limitSellOrder(symbol, price, amount);
    }

}
