import React, { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import Input from "@mui/material/Input";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import styles from "./purchase-modal.module.css";
import flightWeb3 from "../../ethereum/flight";
import web3 from "../../ethereum/web3";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const PurchaseModal = (props) => {
  const prices = [props.businessPrice, props.economyPrice];
  const [flightClass, setFlightClass] = useState("");
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [passportNumber, setPassportNumber] = useState("");
  const [flightAddress, setFlightAddress] = useState("");
  const [loadingPurchase, setLoadingPurchase] = useState(false);
  const onPurchase = async () => {
    const tempCapacity = await flightWeb3(props.flightAdress)
      .methods.getCapacity()
      .call();
    if (tempCapacity <= 0) {
      alert("no available seat!");
      return;
    }
    try {
      if (window.ethereum) {
        await ethereum.enable();
      }
      setLoadingPurchase(true);
      const accounts = await web3.eth.getAccounts();
      if (flightClass === 0) {
        const result = await flightWeb3(props.flightAdress)
          .methods.buyBusinessTicket(name, surname, passportNumber)
          .send({
            from: accounts[0],
            value: web3.utils.toWei(props.businessPrice, "wei"),
          });
        setFlightAddress(result.to);
        setLoadingPurchase(false);
      } else {
        const result = await flightWeb3(props.flightAdress)
          .methods.buyEconomyTicket(name, surname, passportNumber)
          .send({
            from: accounts[0],
            value: web3.utils.toWei(props.economyPrice, "wei"),
          });
        setFlightAddress(result.to);
        setLoadingPurchase(false);
      }
    } catch (error) {
      setLoadingPurchase(false);
      alert(error + "\n Please connect wallet");
    }
  };

  return (
    <Modal
      open={true}
      onClose={() => props.handleClose(false)}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h5" component="h3">
          Purchase Ticket
        </Typography>
        <div className={styles.infoContainer}>
          <Input
            style={{ fontSize: "1.5rem" }}
            placeholder="Name"
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            style={{ fontSize: "1.5rem" }}
            placeholder="Surname"
            onChange={(e) => setSurname(e.target.value)}
          />
          <Input
            style={{ fontSize: "1.5rem" }}
            placeholder="Passport number"
            onChange={(e) => setPassportNumber(e.target.value)}
          />
          <Box sx={{ minWidth: 120, fontSize: "1.5rem" }}>
            <FormControl fullWidth>
              <InputLabel
                id="demo-simple-select-label3"
                style={{ fontSize: "1.5rem", color: "black" }}
              >
                Class
              </InputLabel>
              <Select
                labelId="demo-simple-select-label3"
                id="demo-simple-select3"
                value={flightClass}
                label="Class"
                style={{ fontSize: "1rem", color: "black" }}
                onChange={(e) => setFlightClass(e.target.value)}
              >
                <MenuItem value={0}>Business</MenuItem>
                <MenuItem value={1}>Economy</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <label style={{ fontSize: "1.5rem" }}>
            Price: {prices[flightClass]}
          </label>
          <Button
            variant="contained"
            size="large"
            style={{ fontSize: "1.5rem" }}
            onClick={onPurchase}
            disabled={
              flightClass === "" ||
              name === "" ||
              surname === "" ||
              passportNumber === "" ||
              loadingPurchase
            }
          >
            {loadingPurchase ? (
              <label>Waiting Transaction</label>
            ) : (
              <label>Purchase</label>
            )}
          </Button>
          {flightAddress !== "" ? (
            <div style={{ fontSize: "1.5rem" }}>
              <div>
                This is your flight adress. To check your flight please keep.
              </div>
              <div style={{ color: "red" }}>{flightAddress}</div>
            </div>
          ) : (
            <div style={{ color: "red", fontSize: "1.5rem" }}>
              After transaction please wait until to get flight address.(approx:
              15sec)
            </div>
          )}
        </div>
      </Box>
    </Modal>
  );
};

export default PurchaseModal;
