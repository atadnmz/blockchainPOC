// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.7;

contract FlightFactory {
    mapping(string => FlightTemplate[]) public deployedFlightsDate;

    struct FlightTemplate {
        address flightAdress;
        string flightId;
        string from;
        string destination;
        string flyTime;
        string arrivalTime;
        uint256 businessPrice;
        uint256 economyPrice;
    }

    function createFlight(
        string memory _flightId,
        string memory _from,
        string memory _destination,
        string memory _flyTime,
        string memory _arrivalTime,
        string memory _searchableDate,
        uint256 _capacity,
        uint256 _businessPrice,
        uint256 _economyPrice
    ) public {
        address newFlight = address(
            new Flight(
                msg.sender,
                _flightId,
                _from,
                _destination,
                _flyTime,
                _arrivalTime,
                _capacity,
                _businessPrice,
                _economyPrice
            )
        );

        FlightTemplate memory f = FlightTemplate({
            flightAdress: newFlight,
            flightId: _flightId,
            from: _from,
            destination: _destination,
            flyTime: _flyTime,
            arrivalTime: _arrivalTime,
            businessPrice: _businessPrice,
            economyPrice: _economyPrice
        });
        deployedFlightsDate[_searchableDate].push(f);
    }

    function getFlightsOnDate(string memory time)
        public
        view
        returns (FlightTemplate[] memory)
    {
        return deployedFlightsDate[time];
    }
}

contract Flight {
    struct Passenger {
        address ticketHost;
        string name;
        string surname;
        string passportNumber;
        uint256 seatNumber;
    }
    string flightId;
    string from;
    string destination;
    string flyTime;
    string arrivalTime;
    uint256 businessPrice;
    uint256 economyPrice;
    address public flightManager;
    uint256 public capacity;
    mapping(address => string) public passengerClass;
    Passenger[] public passengers;

    constructor(
        address creator,
        string memory _flightId,
        string memory _from,
        string memory _destination,
        string memory _flyTime,
        string memory _arrivalTime,
        uint256 _capacity,
        uint256 _businessPrice,
        uint256 _economyPrice
    ) {
        flightManager = creator;
        flightId = _flightId;
        from = _from;
        destination = _destination;
        flyTime = _flyTime;
        arrivalTime = _arrivalTime;
        capacity = _capacity;
        businessPrice = _businessPrice;
        economyPrice = _economyPrice;
    }

    function buyBusinessTicket(
        string memory name,
        string memory surname,
        string memory passportNumber
    ) public payable {
        require(msg.value == businessPrice);
        require(capacity > 0);
        Passenger memory newPassenger = Passenger({
            ticketHost: msg.sender,
            name: name,
            surname: surname,
            passportNumber: passportNumber,
            seatNumber: passengers.length + 1
        });
        passengers.push(newPassenger);
        passengerClass[msg.sender] = "business";
        capacity--;
    }

    function buyEconomyTicket(
        string memory name,
        string memory surname,
        string memory passportNumber
    ) public payable {
        require(msg.value == economyPrice);
        require(capacity > 0);
        Passenger memory newPassenger = Passenger({
            ticketHost: msg.sender,
            name: name,
            surname: surname,
            passportNumber: passportNumber,
            seatNumber: passengers.length + 1
        });
        passengers.push(newPassenger);
        passengerClass[msg.sender] = "economy";
        capacity--;
    }

    function getCapacity() public view returns (uint256) {
        return capacity;
    }

    function getPassengers() public view returns (Passenger[] memory) {
        return passengers;
    }

    function getFlightInfo()
        public
        view
        returns (
            string memory,
            string memory,
            string memory,
            string memory,
            string memory
        )
    {
        return (flightId, from, destination, flyTime, arrivalTime);
    }
}
