import ShowedFlights from "../../components/Flight/showed-flight";
import factory from "../../ethereum/factory";
function FlightSearch(props) {
  const formattedFlights = [];
  props.flights.forEach((flight) => {
    if (
      flight[2].toLowerCase() === props.from ||
      (props.from === "All" && flight[3].toLowerCase() === props.to) ||
      props.to === "All"
    ) {
      formattedFlights.push({
        flightAdress: flight[0],
        flightId: flight[1],
        from: flight[2],
        to: flight[3],
        flyDate: flight[4],
        arrivalDate: flight[5],
        businessPrice: flight[6],
        economyPrice: flight[7],
      });
    }
  });
  return (
    <>
      {formattedFlights.map((flight) => (
        <ShowedFlights key={flight.flightId} flight={flight} />
      ))}
    </>
  );
}

FlightSearch.getInitialProps = async (ctx) => {
  const flights = await factory.methods.getFlightsOnDate(ctx.query.date).call();
  return { flights, from: ctx.query.from, to: ctx.query.to };
};

export default FlightSearch;
