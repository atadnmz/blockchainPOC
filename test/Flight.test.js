const assert = require("assert");
const ganache = require("ganache-cli");
const options = { gasLimit: 100000000 };
const Web3 = require("web3");
const web3 = new Web3(ganache.provider(options));

const compiledFactory = require("../ethereum/build/FlightFactory.json");
const compiledFlight = require("../ethereum/build/Flight.json");

let accounts;
let factory;
let flightAdress;
let flight;

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();
  factory = await new web3.eth.Contract(compiledFactory.abi)
    .deploy({ data: "0x" + compiledFactory.evm.bytecode.object })
    .send({ from: accounts[0], gas: "10000000" });

  const result = await factory.methods
    .createFlight(
      "TK3710",
      "izmir",
      "istanbul",
      "2022-03-13T13:00:00",
      "2022-03-13T14:10:00",
      "03-03-2022",
      300,
      1500,
      1000
    )
    .send({
      from: accounts[0],
      gas: "10000000",
    });
  [flightAdress] = await factory.methods.getDeployedFlights().call();

  flight = await new web3.eth.Contract(
    JSON.parse(compiledFlight.interface),
    flightAdress
  );
});

describe("Flights", () => {
  it("deploys a factory and flight", () => {
    assert.ok(factory.options.address);
    assert.ok(flight.options.address);
  });
  it("marks caller as the flight manager", async () => {
    const flightManager = await flight.methods.flightManager().call();
    assert.equal(accounts[0], flightManager);
  });
  it("allows people buy the business ticket", async () => {
    await flight.methods.buyBusinessTicket("ata", "dnmz", "1234").send({
      value: 2000,
      from: accounts[1],
      gas: "10000000",
    });
    const passengerClass = await flight.methods
      .passengerClass(accounts[1])
      .call();
    assert.equal(passengerClass, "business");
  });

  it("person should spend exactly requested price (business)", async () => {
    try {
      await flight.methods.buyBusinessTicket("ata", "dnmz", "1234").send({
        value: 1000,
        from: accounts[1],
        gas: "10000000",
      });
      assert(false);
    } catch (error) {
      assert(error);
    }
  });

  it("person should spend more than minimum price (business)", async () => {
    try {
      await flight.methods.buyBusinessTicket("ata", "dnmz", "1234").send({
        value: 1000,
        from: accounts[1],
        gas: "10000000",
      });
      assert(false);
    } catch (error) {
      assert(error);
    }
  });
});
