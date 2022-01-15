import React from "react";
import styles from "./create-flight.module.css";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Input from "@mui/material/Input";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import flightFactory from "../../ethereum/factory";
import web3 from "../../ethereum/web3";
import Modal from "@mui/material/Modal";
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "60%",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  fontSize: "2rem",
  lineHeight: "4rem",
};

const CreateFlight = () => {
  const cities = ["Izmir", "Istanbul", "New York", "Amsterdam", "Berlin"];
  const [isTxFinished, setIsTxFinished] = React.useState(true);
  const [txBlockHash, setTxBlockHash] = React.useState("");
  const [txHash, setTxHash] = React.useState("");
  const [openTransactionModal, setOpenTransactionModal] = React.useState(false);
  const [constraints, setConstraints] = React.useState({
    flightId: "",
    from: "",
    to: "",
    flightTime: "",
    arrivalTime: "",
    businessPrice: "",
    economyPrice: "",
    flightMinutes: "",
    flightHours: "",
    arrivalMinutes: "",
    arrivalHours: "",
    capacity: "",
  });
  const handleNumberInputChange = (value, fieldName) => {
    const re = /^[0-9\b]+$/;
    if (value === "" || re.test(value)) {
      setConstraints((prevState) => {
        return {
          ...prevState,
          [fieldName]: value,
        };
      });
    }
  };

  const hourChange = (value, fieldName) => {
    const re = /^[0-9\b]+$/;
    if (value === "" || (re.test(value) && value < 24 && value > -1)) {
      setConstraints((prevState) => {
        return {
          ...prevState,
          [fieldName]: value,
        };
      });
    }
  };
  const minuteChange = (value, fieldName) => {
    const re = /^[0-9\b]+$/;
    if (value === "" || (re.test(value) && value < 60 && value > -1)) {
      setConstraints((prevState) => {
        return {
          ...prevState,
          [fieldName]: value,
        };
      });
    }
  };
  const handleTextInputChange = (value, fieldName) => {
    setConstraints((prevState) => {
      return {
        ...prevState,
        [fieldName]: value,
      };
    });
  };
  const isSubmitValid = () => {
    const re = /\b\d{4}\-\d{2}\-\d{2}\b/;
    return (
      re.test(constraints.flightTime) &&
      re.test(constraints.arrivalTime) &&
      constraints.from !== "" &&
      constraints.to !== "" &&
      constraints.businessPrice !== "" &&
      constraints.economyPrice !== "" &&
      constraints.flightId !== "" &&
      constraints.capacity !== "" &&
      constraints.flightHours.length === 2 &&
      constraints.flightMinutes.length === 2 &&
      constraints.arrivalHours.length === 2 &&
      constraints.arrivalMinutes.length === 2
    );
  };
  const allFieldFilled = () => {
    for (const el in constraints) {
      if (constraints[el] === "") return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!isSubmitValid()) {
      alert(
        "Flight date or arrival date invalid. \nDate format(YYYY-MM-DD). \n Hour and minutes should be 2 digit format."
      );
      return;
    }

    const formattedFlightTime = `${constraints.flightTime}T${constraints.flightHours}:${constraints.flightMinutes}:00`;
    const formattedArrivalTime = `${constraints.arrivalTime}T${constraints.arrivalHours}:${constraints.arrivalMinutes}:00`;
    console.log(formattedFlightTime);
    try {
      if (window.ethereum) {
        await ethereum.enable();
      }
      setOpenTransactionModal(true);
      setIsTxFinished(false);
      const accounts = await web3.eth.getAccounts();
      const result = await flightFactory.methods
        .createFlight(
          constraints.flightId,
          cities[constraints.from],
          cities[constraints.to],
          formattedFlightTime,
          formattedArrivalTime,
          constraints.flightTime,
          constraints.capacity,
          parseInt(constraints.businessPrice),
          parseInt(constraints.economyPrice)
        )
        .send({
          from: accounts[0],
        });

      checkTransaction(result.transactionHash);
    } catch (error) {
      console.log(error);
      setOpenTransactionModal(false);
      setIsTxFinished(true);
      if (error.code === undefined) {
        alert(error.message + "\n Please connect wallet");
      } else {
        alert(error.message);
      }
    }
  };

  const checkTransaction = async (hash) => {
    const result = await web3.eth.getTransaction(hash);
    if (result.blockHash !== null) {
      console.log(result);
      setIsTxFinished(true);
      setTxBlockHash(result.blockHash);
      setTxHash(result.hash);
    }
  };

  function useInterval(callback, delay) {
    const savedCallback = React.useRef(callback);

    React.useEffect(() => {
      savedCallback.current = callback;
    }, [callback]);

    React.useEffect(() => {
      if (!delay && delay !== 0) {
        return;
      }

      const id = setInterval(() => savedCallback.current(), delay);

      return () => clearInterval(id);
    }, [delay]);
  }

  useInterval(
    checkTransaction,
    !isTxFinished && openTransactionModal ? 3000 : null
  );

  return (
    <div className={styles.container}>
      <div className={styles.form}>
        <Input
          style={{ fontSize: "1.5rem", backgroundColor: "white" }}
          placeholder="FlightId"
          onChange={(e) => handleTextInputChange(e.target.value, "flightId")}
        />
        <Box sx={{ minWidth: 120, fontSize: "1.5rem" }}>
          <FormControl fullWidth>
            <InputLabel
              id="demo-simple-select-label3"
              style={{ fontSize: "1.5rem" }}
            >
              From
            </InputLabel>
            <Select
              labelId="demo-simple-select-label3"
              id="demo-simple-select3"
              value={constraints.from}
              label="From"
              style={{ fontSize: "1.5rem", backgroundColor: "white" }}
              onChange={(e) => handleNumberInputChange(e.target.value, "from")}
            >
              {cities.map((city, index) => (
                <MenuItem
                  key={city}
                  value={index}
                  style={{ fontSize: "1.5rem" }}
                >
                  {city}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <Box sx={{ minWidth: 120, fontSize: "1.5rem" }}>
          <FormControl fullWidth>
            <InputLabel
              id="demo-simple-select-label3"
              style={{ fontSize: "1.5rem" }}
            >
              To
            </InputLabel>
            <Select
              labelId="demo-simple-select-label3"
              id="demo-simple-select3"
              value={constraints.to}
              label="To"
              style={{ fontSize: "1.5rem", backgroundColor: "white" }}
              onChange={(e) => handleNumberInputChange(e.target.value, "to")}
            >
              {cities.map((city, index) => (
                <MenuItem
                  key={city}
                  value={index}
                  style={{ fontSize: "1.5rem" }}
                >
                  {city}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <div style={{ display: "flex" }}>
          <Input
            style={{
              fontSize: "1.5rem",
              backgroundColor: "white",
              width: "70%",
            }}
            placeholder="Flight Time (YYYY-MM-DD)"
            onChange={(e) =>
              handleTextInputChange(e.target.value, "flightTime")
            }
          />
          <div className={styles.timeContainer}>
            <Input
              style={{ fontSize: "1.5rem", backgroundColor: "white" }}
              placeholder="HH"
              value={constraints.flightHours}
              onChange={(e) => hourChange(e.target.value, "flightHours")}
            />
            :
            <Input
              style={{ fontSize: "1.5rem", backgroundColor: "white" }}
              placeholder="MM"
              value={constraints.flightMinutes}
              onChange={(e) => minuteChange(e.target.value, "flightMinutes")}
            />
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <Input
            style={{
              fontSize: "1.5rem",
              backgroundColor: "white",
              width: "70%",
            }}
            placeholder="Arrival Time (YYYY-MM-DD)"
            onChange={(e) =>
              handleTextInputChange(e.target.value, "arrivalTime")
            }
          />
          <div className={styles.timeContainer}>
            <Input
              style={{ fontSize: "1.5rem", backgroundColor: "white" }}
              placeholder="HH"
              value={constraints.arrivalHours}
              onChange={(e) => hourChange(e.target.value, "arrivalHours")}
            />
            :
            <Input
              style={{ fontSize: "1.5rem", backgroundColor: "white" }}
              placeholder="MM"
              value={constraints.arrivalMinutes}
              onChange={(e) => minuteChange(e.target.value, "arrivalMinutes")}
            />
          </div>
        </div>
        <Input
          style={{ fontSize: "1.5rem", backgroundColor: "white" }}
          placeholder="Capacity"
          value={constraints.capacity}
          onChange={(e) => handleNumberInputChange(e.target.value, "capacity")}
        />
        <Input
          style={{ fontSize: "1.5rem", backgroundColor: "white" }}
          placeholder="Business Price"
          value={constraints.businessPrice}
          onChange={(e) =>
            handleNumberInputChange(e.target.value, "businessPrice")
          }
        />
        <Input
          style={{ fontSize: "1.5rem", backgroundColor: "white" }}
          placeholder="Economy Price"
          value={constraints.economyPrice}
          onChange={(e) =>
            handleNumberInputChange(e.target.value, "economyPrice")
          }
        />
        <Button
          variant="contained"
          style={{ width: "50%", alignSelf: "center", fontSize: "1.2rem" }}
          onClick={handleSubmit}
          disabled={!allFieldFilled()}
        >
          Create Flight
        </Button>
        <Modal
          open={openTransactionModal}
          onClose={() => setOpenTransactionModal(false)}
          aria-labelledby="modal-modal-title1"
          aria-describedby="modal-modal-description1"
        >
          <Box sx={style}>
            {!isTxFinished ? (
              <div>
                Waiting Metamask Transaction... Plesae do not close this
                window.(approx: 15sec)
              </div>
            ) : (
              <div>
                <div>Transaction finished!</div>
                <div>Block Hash: {txBlockHash}</div>
                <a
                  href={`https://rinkeby.etherscan.io/tx/${txHash}`}
                  target="_blank"
                >
                  Check from Rinkeby
                </a>
              </div>
            )}
          </Box>
        </Modal>
      </div>
    </div>
  );
};

export default CreateFlight;
