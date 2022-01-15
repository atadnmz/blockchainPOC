import web3 from "./web3";
import FlightFactory from "./build/FlightFactory.json";

const instance = new web3.eth.Contract(
  FlightFactory.abi,
  "0x648bF0338CC23874703C9875Ea4eC0E9c38bCa9C"
);

export default instance;
