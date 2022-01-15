import style from "./home-description.module.css";
const HomeDescription = () => {
  return (
    <section className={style.homeDescription}>
      <h1>Solidity / Web3.js / Blockchain</h1>
      <p>
        Below projects consist of different technology stacks, approches and
        protocols. The objective is to demonstrate how to communicate blockchain
        network via web3.js library and development of smart contracts.{" "}
      </p>
      <br />
      <ul>
        <li>Flight project - Airplane ticket service based on blockchain.</li>
        <li>
          NFT Marketplace - Create, sell and buy NFT's based on ERC20 protocol.
          (Under Construction)
        </li>
        <li>
          Whale Tracker - Reveal the whales transaction in real-time. (Under
          Construction)
        </li>
      </ul>
    </section>
  );
};

export default HomeDescription;
