const { utils } = require("../src/helpers/");
require("dotenv").config({path: utils.pathJoin(__dirname + "/../.env")});
const { API_KEY: apiKey, API_SECRET: apiSecret } = process.env;
const expect = require("chai").expect;
const services = require("../src/services");
const Narkasa = require("../src/");
const conf = require("../config.json");

describe("Narkasa", ()=>{
    describe("Set Credential", ()=>{
        it("apiKey and apiSecret should not be null. But before", ()=>{
            expect(Narkasa.credential.apiKey).to.be.a("null");
            expect(Narkasa.credential.apiSecret).to.be.a("null");
            Narkasa.setCredential(apiKey, apiSecret)
            expect(Narkasa.credential.apiKey).to.be.a("string");
            expect(Narkasa.credential.apiSecret).to.be.a("string");
        });
    });
    describe("check signature", ()=>{
        it("signature should not be null", ()=>{
            expect(Narkasa.credential.signature).to.be.a("string");
        });
    });
    describe("check balance", ()=>{
        it("balance code should be an array", async ()=>{
            expect(await Narkasa.getBalance()).to.be.an("array");
        });
    });
    describe("start websocket client", ()=>{
        it("if connected, resolved true", async ()=>{
            expect(await services.wsService.startWS()).to.be.true;
            expect(services.wsService.wsObj.client).to.not.be.a("null");
        });
    });
    describe("startuser data stream", ()=>{
        it("get response for user data stream ", async ()=>{
            expect(await services.wsService.userDataStream(
                Narkasa.credential.apiKey,
                Narkasa.credential.signature
                )).to.be.true;
        });
    });
    describe("push on message", ()=>{
        it("should be got 1 for pushed func", async ()=>{
            expect(services.wsService.pushOnMessage((message)=>console.log({message}))).to.equal(1)
        });
    });
    describe("order book", ()=>{
        it("starts order book", async ()=>{
            expect(services.wsService.orderBook()).to.be.true;
        });
    });
    describe("order book with the symbol ETHUSDT", ()=>{
        it("starts order book ETHUSDT", async ()=>{
            expect(services.wsService.orderBook("ETHUSDT")).to.be.true;
        });
    });
    describe("push order book functions", ()=>{
        it("catch some order books", async ()=>{
            expect(services.wsService.pushOnMessageOrderBook(message=>{
                const { symbol, bidPrice: bid, askPrice: ask  } = message
                console.log(`for ${symbol}\nbid: ${bid}\nask: ${ask}`);
            })).to.be.a("number");
        });
    });
    describe("making buy limit", ()=>{
        it("making buy limit. Gets order object", async ()=>{
            const resp = await services.tradeService.limitBuyOrder("ETHUSDT", 1500, 0.01)
            expect(resp).to.be.an("object");
        });
    });
    describe("gel all markets", ()=>{
        it("Gets array includes objects", async ()=>{
            (await services.tradeService.getAllMarkets()).forEach(item=>expect(item).to.be.an("object"));
        });
    });
});