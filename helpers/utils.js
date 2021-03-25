require("json-circular-stringify");
const randomFloat = require('random-float');
const crypto = require('crypto');
const fs = require('fs');
const path = require("path");
const uuid = require("uuid");

exports.sumOfKeys = (...objs) => {
    const keysVals = {};
    if (Array.isArray(objs[0])) objs = objs[0];
    objs.forEach(obj=>{
        Object.keys(obj).forEach(key=>{
            keysVals[key] = (keysVals[key] || 0) + parseFloat(obj[key]);
        })
    });

    return keysVals;
}

const countDecimals = exports.countDecimals = function(value) {
    if (Math.floor(value) !== value)
        return value.toString().split(".")[1].length || 0;
    return 0;
}

exports.roundN = (num, dec) => (Math.round(num * Math.pow(10, dec)) / Math.pow(10, dec));

exports.generateRandomNumber = (min, max, precision) => {
    if (Array.isArray(min)){
        numbers = min;
        max = numbers[1];
        min = numbers[0];
    }
    if (!precision) precision = Math.max(countDecimals(min), countDecimals(max));
    let highlightedNumber = randomFloat(min, max);
    highlightedNumber = parseFloat(highlightedNumber.toFixed(precision));
    return highlightedNumber;
}

exports.waitMs = ms => new Promise(resolve => setTimeout(resolve, ms>=0 ? ms : 0));
exports.waitSec = (sec) => new Promise((resolve)=>setTimeout(resolve, sec*1000));

exports.base64Decode = (data) => {
    return new Buffer.from(data, 'base64').toString('ascii')
}
exports.base64Encode = (data) => {
    return new Buffer.from(data).toString('base64')
}
exports.generateSha256Text = (key, secret) => {
    return crypto.createHmac('SHA256', secret).update(key).digest('hex');
}
exports.generateSha256WBase64Secret = (message, secret) => {
    return crypto.createHmac("sha256", new Buffer.from(secret, "base64")).update(message).digest("base64");
}
exports.pointFixer = (value, length) => {
    let fixedValue = parseFloat(value);
    let power = Math.pow(10,length);
    fixedValue = Math.floor(fixedValue * power) / power;
    return parseFloat(fixedValue.toFixed(length));
}

const colored = exports.colored = (text, ...colors) => {
    const Colors = {
        black : '\033[30m',
        red : '\x1b[31m',
        green : '\x1b[32m',
        yellow : '\x1b[33m',
        blue : '\033[34m',
        magenta : '\033[35m',
        cyan : '\033[36m',
        white : '\033[37m',
        blackBg: '\033[40m',
        redBg: '\033[41m',
        greenBg: '\033[42m',
        yellowBg: '\033[43m',
        blueBg: '\033[44m',
        magentaBg: '\033[45m',
        cyanBg: '\033[46m',
        whiteBg: '\033[47m'
    }
    let [color, bgColor] = colors;
    color = Object.keys(Colors).find(key=>key.includes(color));
    bgColor = Object.keys(Colors).filter(key=>key.search(/Bg$/) >= 0).find(key=>key.includes(bgColor));
    return `${Colors[color]}${bgColor ? Colors[bgColor] : ""}${text}\x1b[0m`;
}

exports.logger = (log, ...objArgs) => {
    console.log("\n\n");
    const date = new Date();
    const day = date.toLocaleDateString('en', {day: '2-digit'});;
    const month = date.toLocaleDateString('en', {month: '2-digit'});
    const year = date.toLocaleDateString('en', {year: '2-digit'});
    const hour = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    const milliseconds = date.getMilliseconds();
    console.log(colored(day + "." + month + "." + year + " " + hour + ":" + minutes + ":" + seconds + ":" + milliseconds, "red"));
    console.log(colored(JSON.stringify(log), "blue"));
    if (objArgs.length){
        objArgs.forEach((obj, i)=>{
            console.log("\nLog obj. " + (i+1) + "/" + objArgs.length + ":");
            console.log(obj);
        });
    }
    console.log(colored("\r\n", "white", "red"));
}

exports.writeFile = async (filePath, fileName, data) => {
    return new Promise((resolve, reject) => {
        fs.writeFile(path.join(filePath + '/' + fileName), isJsonParsable(data) ? data : JSON.stringify(data), (err) => {
            if (err) return reject(err);
            return resolve(true)
        });
    })
}

exports.readFile = async (file) => {
    return new Promise((resolve, reject) => {
        fs.readFile(path.join(file), (err, data) => {
            if (err) return reject(err);
            return resolve(data);
        });
    })
}

exports.appendFile = async (filePath, fileName, data) => {
    return new Promise((resolve, reject) => {
        fs.appendFile(path.join(filePath + '/' + fileName), data, (err) => {
            if (err) return reject(err);
            return resolve(true);
        });
    })
}

exports.pathJoin = path.join;
exports.getUUIDV1 = uuid.v1;

const isJsonParsable = exports.isJsonParsable = (str) => {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

exports.isObject = (val) => val instanceof Object;
exports.object2Html = (obj) => JSON.stringify(obj, null, 2)
    .replace(/\n\s\s/g, "<br />&nbsp;&nbsp;")
    .replace(/\n/, "<br />");

exports.sort = (a,b)=>{
    if (a<b) return -1;
    if (a>b) return 1;
    return 0;
}

exports.setToHappen = (fn, timestamp) => {
    const currentTimestamp = (new Date).getTime();
    const differenceMs = timestamp - currentTimestamp;
    let waitingTimeBeforeNextPeriod;
    if (differenceMs <= 0){
        waitingTimeBeforeNextPeriod = 0;
    } else{
        waitingTimeBeforeNextPeriod = differenceMs;
    }
    setTimeout(fn, waitingTimeBeforeNextPeriod);
}

exports.getRandomInt = (...numbers) => {
    let min, max;
    if (Array.isArray(numbers[0])) numbers = numbers[0];
    max = numbers[1]
    min = numbers[0];

    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

exports.objectToQueryString = (obj) => Object.keys(obj).map(key => encodeURIComponent(key) + '=' + encodeURIComponent(obj[key])).join('&');

exports.parityNormalize = (parity) => {
    const symbols = ["ETH", "USDT", "TRY", "BTC", "LINK", "XRP"];
    symbols.forEach(symbol=>{
      if (parity.search(/\_/) !== -1) return;
      if (parity.search(new RegExp(`\^${symbol}`)) === 0) {
        parity = parity.replace(new RegExp(symbol), symbol + "_");
      }
    })

    return parity;
  }

exports.paritySeperator = (parity) =>{
    let base, quote;
    const symbols = ["ETH", "USDT", "TRY", "BTC", "LINK", "XRP", "UNI"];
    parity = parity.replace(/\_|\-/g, "");
    symbols.forEach(symbol=>{
        if (parity.search(new RegExp(`\^${symbol}`, "i")) === 0) {
            base = symbol;
            quote = parity.replace(new RegExp(symbol, "i"), "");
        }
      });
    return {base, quote};
}
