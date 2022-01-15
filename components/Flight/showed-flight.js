import React, { useState } from "react";
import styles from "./showed-flight.module.css";
import Button from "@mui/material/Button";
import factory from "../../ethereum/factory";
import flightWeb3 from "../../ethereum/flight";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import PurchaseModal from "./purchase-modal";
const ShowedFlights = (props) => {
  const {
    flightAdress,
    flightId,
    from,
    to,
    flyDate,
    arrivalDate,
    businessPrice,
    economyPrice,
  } = props.flight;
  const [showCheckout, setShowCheckout] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [openPurchaseModal, setOpenPurchaseModal] = useState(false);
  const [capacity, setCapacity] = useState(0);
  const formattedDate = new Date(flyDate)
    .toLocaleDateString("en-US", {
      minute: "2-digit",
      hour: "2-digit",
      day: "numeric",
      month: "long",
      year: "numeric",
    })
    .split(/,(?= \d{1,2}:)/);
  const calculatedArrivalTime = new Date(arrivalDate)
    .toLocaleDateString("en-US", {
      minute: "2-digit",
      hour: "2-digit",
      day: "numeric",
      month: "long",
      year: "numeric",
    })
    .split(/,(?= \d{1,2}:)/);

  const onCheckout = async () => {
    if (!showCheckout) {
      setCheckoutLoading(true);
      const tempCapacity = await flightWeb3(flightAdress)
        .methods.getCapacity()
        .call();
      setCapacity(tempCapacity);
      setCheckoutLoading(false);
      setShowCheckout(true);
    }
    setIsMounted(!isMounted);
  };
  const onPurchase = async () => {
    setButtonLoading(true);
    const allFlights = await factory.methods.getDeployedFlights().call();
    setIsMounted(!isMounted);
    if (!showCheckout) setShowCheckout(true);
  };

  return (
    <>
      <div className={styles.container}>
        <div className={styles.header}>FLIGHT</div>
        <div className={styles.header}>FROM</div>
        <div className={styles.header}>TO</div>
        <div className={styles.header}>
          <AccountBalanceWalletIcon />
        </div>
        <div className={styles.content}>{flightId}</div>
        <div className={styles.content}>
          <div>{from}</div> <div>{formattedDate[0]}</div>
          <div>{formattedDate[1]}</div>
        </div>
        <div className={styles.content}>
          <div>{to}</div> <div>{calculatedArrivalTime[0]}</div>
          <div>{calculatedArrivalTime[1]}</div>
        </div>
        <div className={styles.content}>
          <Button variant="contained" color="success" onClick={onCheckout}>
            {checkoutLoading ? (
              <label>loading...</label>
            ) : showCheckout ? (
              <label>Hide</label>
            ) : (
              <label>Checkout</label>
            )}
          </Button>
        </div>

        {showCheckout && (
          <div
            className={isMounted ? styles.checkoutOpen : styles.checkoutClose}
            onAnimationEnd={() => {
              if (!isMounted) setShowCheckout(false);
            }}
          >
            <div className={styles.checkoutContainer}>
              <label className={styles.label}>Avail seats: {capacity}</label>
            </div>
            <Button
              variant="outlined"
              color="primary"
              className={styles.purchaseBtn}
              style={{ marginRight: "7rem", marginTop: "1.2rem" }}
              onClick={() => setOpenPurchaseModal(true)}
            >
              Continue
            </Button>
          </div>
        )}
      </div>
      {openPurchaseModal && (
        <PurchaseModal
          handleClose={setOpenPurchaseModal}
          businessPrice={businessPrice}
          economyPrice={economyPrice}
          flightAdress={flightAdress}
        />
      )}
    </>
  );
};

export default ShowedFlights;
