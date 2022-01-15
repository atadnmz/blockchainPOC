import web3 from "./web3";
import Flight from "./build/Flight.json";

const instance = (address) => {
  return new web3.eth.Contract(Flight.abi, address);
};

export default instance;
