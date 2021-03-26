const { ws: { connectNarkasa }, ws } = require("../loaders/");

const wsObj = exports.wsObj = {
    client: null
}

const credential = exports.credential = {
    apiKey: null,
    signature: null
}

const prototypes = {
    onMessages: [],
}

const pushOnMessage = exports.pushOnMessage = (cb) => {
    if (!prototypes.onMessages.length){
        wsObj.client.on("message", message=>{
            if (message){
                message = JSON.parse(message);
                for (const onMessage of prototypes.onMessages){
                    onMessage(message);
                }
            }

        });
    }
    prototypes.onMessages.push(cb);
    return prototypes.onMessages.length;
}

exports.pushOnMessageOrderBook = (cb) => {
    const _cb = message=>{
        if (message.type === "orderBook" && message.askAmount){
            cb(message);
        }
    }
    pushOnMessage(_cb);
    return prototypes.onMessages.length;
}

exports.orderBook = (symbol="BTCUSDT") => {
    const msg = { //order book
        method: 'SUBSCRIBE',
        params: [ { type: "orderBook", symbol } ],
        apiKey: credential.apiKey,
        signature: credential.signature,
    };
    wsObj.client.send(JSON.stringify(msg));
    return true;
};

exports.userDataStream = () => new Promise((resolve, reject)=>{
    const { apiKey, signature } = credential;
    const msg = { //USER STREAMS
        method: 'USER_STREAMS',
        apiKey,
        signature,
    };
    wsObj.client.send(JSON.stringify(msg));
    wsObj.client.on("message", message=>{
        if (message){
            message = JSON.parse(message);
            if (message.method === "USER_STREAMS"){
                if (message.status === "success"){
                    return resolve(true);
                }
                reject(false);
            }


        }
    });
});

exports.startWS = () => new Promise((resolve, reject)=>{
    connectNarkasa(clientOnProt, resolve, reject);
});

const clientOnProt = (client) => {
    if (!wsObj.client) wsObj.client = client;
}

