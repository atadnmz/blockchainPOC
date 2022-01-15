const HDWalletProvider = require("@truffle/hdwallet-provider");
const Web3 = require("web3");
const compiledFactory = require("./build/FlightFactory.json");

provider = new HDWalletProvider(
  ["METAMASK_PRIVATE_KEY"],
  "https://rinkeby.infura.io/v3/bfe844f0d4034997bdc3239bdeed3800"
);
const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();

  console.log("Attempting to deploy from account", accounts[0]);

  const result = await new web3.eth.Contract(compiledFactory.abi)
    .deploy({ data: "0x" + compiledFactory.evm.bytecode.object })
    .send({ gas: "10000000", from: accounts[0] });

  console.log("Contract deployed to", result.options.address);
  provider.engine.stop();
};
deploy();
