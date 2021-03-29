const axios = require("axios");
const conf = require("../../config.json");
const { utils } = require("../helpers");

const { rest } = conf;

const credential = exports.credential = {
    apiKey: null,
    apiSecret: null
};

const getSignature = exports.getSignature = (apiKey, apiSecret, data) => {
    let signature;
    if (data){
        const queryData = utils.objectToQueryString(data);
        signature = utils.generateSha256Text(queryData, apiSecret);
        return signature;
    }
    signature = utils.generateSha256Text(apiKey, apiSecret);
    return signature;
}

const getSignatured = (apiKey, apiSecret, data={}) => {
    const timestamp = new Date().getTime();
    data = {...data, timestamp};
    const signature = getSignature(apiKey, apiSecret, data);
    data = {...data, signature};
    return data;
}

exports.getBalance = (asset) => new Promise(async (resolve, reject)=>{// asset or symbol
    const { apiKey, apiSecret } = credential;
    const data = getSignatured(apiKey, apiSecret);
    const response = await axios.get(rest + "/balance/wallet", {
        headers: {
            "x-apnk-apikey": apiKey
        },
        params: data
    })
    .catch(err=>{
        utils.logger("Error in the module getBalanceNarkasa", err);
        reject(err);
    });
    if (!response) return;
    if (response.data.code !== "00000") return reject(response.data);
    if (asset){
        if (asset.length > 4){
            const baseAsset  = response.data.wallet.find(({symbol})=>symbol === utils.paritySeperator(asset).base);
            const quoteAsset  = response.data.wallet.find(({symbol})=>symbol === utils.paritySeperator(asset).quote);
            return resolve([baseAsset, quoteAsset]);
        }
        const oneAsset = response.data.wallet.find(({symbol})=>symbol === asset);
        return resolve(oneAsset);
    }
    resolve(response.data.wallet);
});

exports.getAllMarkets = () =>
    new Promise((resolve, reject)=>
        axios.get(rest+ "/market/markets")
            .then(res=>{
                if (res.data.code !== "00000" || !res.data.markets) return reject(res.data);
                resolve(res.data.markets);
            })
            .catch(reject));

exports.limitBuyOrder = (symbol, price, amount) =>
    new Promise(async (resolve, reject) => {
        const { apiKey, apiSecret } = credential;
        let data;
        data = { symbol, price, amount};
        data = getSignatured(apiKey, apiSecret, data);
        const response = await axios.post(rest + "/market/limit-buy", data, {
            headers: {
                "x-apnk-apikey": apiKey
            }
        })
        .catch(err=>{
            utils.logger("Error in the module limitBuyOrder", err);
            reject(err);
        });
        if (!response) return;
        if (response.data.code !== "00000") return reject(response.data);
        resolve(response.data.order);
    });

exports.limitSellOrder = (symbol, price, amount) =>
new Promise(async (resolve, reject) => {
    const { apiKey, apiSecret } = credential;
    let data;
    data = { symbol, price, amount};
    data = getSignatured(apiKey, apiSecret, data);
    const response = await axios.post(rest + "/market/limit-sell", data, {
        headers: {
            "x-apnk-apikey": apiKey
        }
    })
    .catch(err=>{
        utils.logger("Error in the module limitSellOrder", err);
        reject(err);
    });
    if (!response) return;
    if (response.data.code !== "00000") return reject(response.data);
    resolve(response.data.order);
});

exports.cancelOrder = (orderId) =>
    new Promise(async (resolve, reject)=>{
        const { apiKey, apiSecret } = credential;
        let data;
        data = { orderId };
        data = getSignatured(apiKey, apiSecret, data);
        const response = await axios.post(rest + "/market/cancel-order", data, {
            headers: {
                "x-apnk-apikey": apiKey
            }
        })
        .catch(err=>{
            utils.logger("Error in the module cancelOrder", err);
            reject(err);
        });
        if (!response) return;
        if (response.data.code !== "00000") return reject(response.data);
        resolve(response.data.order);
    });

exports.marketBuy = (symbol, amount) =>
    new Promise(async (resolve, reject)=>{
        const { apiKey, apiSecret } = credential;
        let data;
        data = { symbol, amount };
        data = getSignatured(apiKey, apiSecret, data);
        const response = await axios.post(rest + "/market/market-buy", data, {
            headers: {
                "x-apnk-apikey": apiKey
            }
        })
        .catch(err=>{
            utils.logger("Error in the module marketBuy", err);
            reject(err);
        });
        if (!response) return;
        if (response.data.code !== "00000") return reject(response.data);
        resolve(response.data.order);
    })

exports.marketSell = (symbol, amount) =>
    new Promise(async (resolve, reject)=>{
        const { apiKey, apiSecret } = credential;
        let data;
        data = { symbol, amount };
        data = getSignatured(apiKey, apiSecret, data);
        const response = await axios.post(rest + "/market/market-sell", data, {
            headers: {
                "x-apnk-apikey": apiKey
            }
        })
        .catch(err=>{
            utils.logger("Error in the module marketSell", err);
            reject(err);
        });
        if (!response) return;
        if (response.data.code !== "00000") return reject(response.data);
        resolve(response.data.order);
    })
