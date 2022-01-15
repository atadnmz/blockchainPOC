const path = require("path");
const solc = require("solc");
const fs = require("fs-extra");

const buildPath = path.resolve(__dirname, "build");
fs.removeSync(buildPath);

const campaignPath = path.resolve(__dirname, "contracts", "Flight.sol");
const source = fs.readFileSync(campaignPath, "utf8");
var input = {
  language: "Solidity",
  sources: {
    "Flight.sol": {
      content: source,
    },
  },
  settings: {
    outputSelection: {
      "*": {
        "*": ["*"],
      },
    },
  },
};

const output = JSON.parse(solc.compile(JSON.stringify(input)));
fs.ensureDirSync(buildPath);
for (let contract in output.contracts["Flight.sol"]) {
  console.log(contract);
  fs.outputJsonSync(
    path.resolve(buildPath, contract.replace(":", "") + ".json"),
    output.contracts["Flight.sol"][contract]
  );
}
