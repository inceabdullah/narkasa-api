const WebSocket = require("ws");

const conf = require("../../config.json");
const { utils } = require("../helpers/");

const connectNarkasa = (clientOnProt, resolve, reject) => {
    const openWs = () => {
        const client = new WebSocket(conf.ws);
        client.on('open', () => {
            resolve(true);
            clientOnProt(client);
        });
        client.on('close', () => {
            utils.logger('disconnected from ' + conf.ws);
            reject("closed");
        setTimeout(openWs, 15000);
      });
    };
    openWs();
};

exports.connectNarkasa = connectNarkasa;
