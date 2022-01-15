import React from "react";
import Button from "@mui/material/Button";
import Input from "@mui/material/Input";
import flight from "../../ethereum/flight";
import web3 from "../../ethereum/web3";
import styles from "./check-reservation.module.css";
const CheckReservation = () => {
  const [walletAddress, setWalletAddress] = React.useState("");
  const [flightAddress, setFlightAddress] = React.useState("");
  const [ticket, setTicket] = React.useState({});

  const checkTransaction = async (hash) => {
    const result = await web3.eth.getTransaction(hash);
    if (result.blockHash !== null) {
      console.log(result);
      setIsTxFinished(true);
      setTxBlockHash(result.blockHash);
      setTxHash(result.transactionHash);
    }
  };

  const handleQueryTickets = async () => {
    try {
      const passengers = await flight(flightAddress)
        .methods.getPassengers()
        .call();
      const flightInfo = await flight(flightAddress)
        .methods.getFlightInfo()
        .call();
      console.log(passengers);
      console.log(passengers[0][0]);
      console.log(passengers[0][4]);
      console.log(flightInfo);
      const ticketInfo = {};
      passengers.forEach((passenger) => {
        if (passenger[0] === walletAddress) {
          ticketInfo.passenger = {
            name: passenger[1],
            surname: passenger[2],
            passportNumber: passenger[3],
            seatNumber: passenger[4],
          };
        }
      });
      ticketInfo.flightId = flightInfo[0];
      ticketInfo.from = flightInfo[1];
      ticketInfo.to = flightInfo[2];
      ticketInfo.flightTime = formatDate(flightInfo[3]);
      ticketInfo.arrivalTime = formatDate(flightInfo[4]);
      setTicket(ticketInfo);
    } catch (error) {
      console.log(error.message);
      alert(error.message);
    }
  };
  const formatDate = (date) => {
    return new Date(date)
      .toLocaleDateString("en-US", {
        minute: "2-digit",
        hour: "2-digit",
        day: "numeric",
        month: "long",
        year: "numeric",
      })
      .split(/,(?= \d{1,2}:)/);
  };
  return (
    <div className={styles.container}>
      <div className={styles.form}>
        <Input
          style={{ fontSize: "1.5rem", backgroundColor: "white" }}
          placeholder="Metamask Account Address"
          onChange={(e) => setWalletAddress(e.target.value)}
        />
        <Input
          style={{ fontSize: "1.5rem", backgroundColor: "white" }}
          placeholder="Fligth Address"
          onChange={(e) => setFlightAddress(e.target.value)}
        />
        <Button
          variant="contained"
          style={{ width: "50%", alignSelf: "center", fontSize: "1.2rem" }}
          onClick={handleQueryTickets}
        >
          Show Tickets
        </Button>
      </div>
      {ticket.passenger !== undefined && (
        <div className={styles.ticketInfo}>
          <div className={styles.header}>Flight number </div>
          <div className={styles.header}>From </div>
          <div className={styles.header}>To </div>
          <div className={styles.header}>Flight Time </div>
          <div className={styles.header}>Arrival Time </div>
          <div className={styles.header}>Full name </div>
          <div className={styles.header}>Passport number </div>
          <div className={styles.header}>Seat number </div>
          <div className={styles.content}>{ticket.flightId}</div>
          <div className={styles.content}>{ticket.from}</div>
          <div className={styles.content}>{ticket.to}</div>
          <div className={styles.content}>{ticket.flightTime}</div>
          <div className={styles.content}>{ticket.arrivalTime}</div>
          <div className={styles.content}>
            {ticket.passenger.name} {ticket.passenger.surname}
          </div>
          <div className={styles.content}>
            {ticket.passenger.passportNumber}
          </div>
          <div className={styles.content}>{ticket.passenger.seatNumber}</div>
        </div>
      )}
    </div>
  );
};

export default CheckReservation;
