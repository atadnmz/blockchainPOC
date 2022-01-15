import * as React from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import styles from "./reservation.module.css";
import TextField from "@mui/material/TextField";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import DatePicker from "@mui/lab/DatePicker";
import SearchIcon from "@mui/icons-material/DoubleArrow";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Button from "@mui/material/Button";
import { useRouter } from "next/router";
const theme = createTheme({
  typography: {
    htmlFontSize: 10,
  },
  components: {
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          fontSize: "2rem",
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          fontSize: "2rem",
        },
      },
    },
  },
});

export default function Reservation() {
  const [from, setFrom] = React.useState("");
  const [to, setTo] = React.useState("");
  const cities = ["Izmir", "Istanbul", "New York", "Amsterdam", "Berlin"];
  const router = useRouter();
  const [value, setValue] = React.useState(new Date());

  const navigate = () => {
    const formattedDate = convert(value);
    router.push(`/flight/${formattedDate}`);
  };
  const navigateCreateFlight = () => {
    router.push(`/flight/create`);
  };
  const navigateCheckReservation = () => {
    router.push(`/flight/check-reservation`);
  };

  const convert = (time) => {
    const date = new Date(time),
      mnth = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
    return [date.getFullYear(), mnth, day].join("-");
  };
  return (
    <>
      <div className={styles.reservationContainer}>
        <Box sx={{ minWidth: 200 }}>
          <FormControl fullWidth>
            <InputLabel
              id="demo-simple-select-label1"
              style={{ fontSize: "2rem", color: "black" }}
            >
              From
            </InputLabel>
            <Select
              labelId="demo-simple-select-label1"
              id="demo-simple-select1"
              value={from}
              label="From"
              onChange={(e) => setFrom(e.target.value)}
              style={{ fontSize: "2rem" }}
            >
              {cities.map((city, index) => (
                <MenuItem key={city} value={index}>
                  {city}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <Box sx={{ minWidth: 200 }}>
          <FormControl fullWidth>
            <InputLabel
              id="demo-simple-select-label2"
              style={{ fontSize: "2rem", color: "black" }}
            >
              To
            </InputLabel>
            <Select
              labelId="demo-simple-select-label2"
              id="demo-simple-select2"
              value={to}
              label="To"
              style={{ fontSize: "2rem" }}
              onChange={(e) => setTo(e.target.value)}
            >
              {cities.map((city, index) => (
                <MenuItem key={city} value={index}>
                  {city}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <ThemeProvider theme={theme}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              views={["year", "month", "day"]}
              label="Year, month and date"
              minDate={new Date("2022-01-01")}
              maxDate={new Date("2023-01-01")}
              value={value}
              onChange={(newValue) => {
                setValue(newValue);
              }}
              renderInput={(params) => (
                <TextField {...params} helperText={null} />
              )}
            />
          </LocalizationProvider>
        </ThemeProvider>
        {/*  <Link href={`/flight/${convert(value)}`}> */}
        <SearchIcon
          className={styles.searchIcon}
          color="error"
          onClick={navigate}
        />
        {/*  </Link> */}
        <div className={styles.verticalDivider} />
        <Button
          style={{ fontSize: "1.5rem" }}
          variant="outlined"
          color="primary"
          onClick={navigateCreateFlight}
        >
          Create Flight
        </Button>
        <Button
          style={{ fontSize: "1.5rem", minWidth: "120px" }}
          variant="outlined"
          color="primary"
          onClick={navigateCheckReservation}
        >
          Check Reservation
        </Button>
      </div>
    </>
  );
}
