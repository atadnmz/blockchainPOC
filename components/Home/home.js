import React from "react";
import HomeDescription from "./home-description";
import style from "./home.module.css";
import ProjectCard from "./project-card";

const PROJECT_DATA = [
  {
    title: "Flight Ticket",
    desc: "Flight ticket purchasing platform based on blockchain",
    image: "flight.jpg",
    route: "/flight",
  },
  {
    title: "NFT Marketplace",
    desc: "Create, sell and buy NFT's",
    image: "nft_market_place.png",
    route: "/nft-marketplace",
  },
  {
    title: "Whale Tracker",
    desc: "Access ethereum whale in real-time.",
    image: "whale.jpg",
    route: "/whale-tracker",
  },
];
const Home = () => {
  return (
    <>
      <HomeDescription />
      <div className={style.container}>
        {PROJECT_DATA.map((project) => (
          <ProjectCard key={project.image} project={project} />
        ))}
      </div>
    </>
  );
};

export default Home;
