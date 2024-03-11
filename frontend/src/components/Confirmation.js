import styled from "styled-components";
import { useState, useEffect, useContext } from "react";

import tombstone from "../assets/tombstone.png";
import { userContext } from "./userContext";

const Confirmation = () => {
  //usestate
  const [flight, setFlight] = useState(null);
  const { user } = useContext(userContext);

  //fetch reservation
  useEffect(() => {
    // TODO: GET seating data for selected flight
    fetch(`/api/get-reservation/${user}`)
      .then((res) => res.json())
      .then((data) => setFlight(data.data));
  }, [user]);

  return flight && user ? (
    <Wrapper>
      <Border>
        <Header>Your flight is confirmed</Header>
        <Div>
          <p>Reservation:{flight.id}</p>
          <p>Flight:{flight.flight}</p>
          <p>seat #:{flight.seat}</p>
          <p>
            Lastname:{flight.lastName} Firstname: {flight.firstName}
          </p>
          <p>Email:{flight.email}</p>
        </Div>
      </Border>
      <Img src={tombstone} />
    </Wrapper>
  ) : (
    <h1>Loading</h1>
  );
  // TODO: Display the POSTed reservation information
};

const Wrapper = styled.div`
  margin-top: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 2%;
`;
const Div = styled.div`
  font-weight: bold;
  width: 400px;
  padding: 1%;
  display: flex;
  text-align: left;
  flex-direction: column;
  justify-content: center;
`;

const Border = styled.div`
  border: #aa001e solid 3px;
`;

const Header = styled.h3`
  color: #aa001e;
`;

const Img = styled.img`
  margin-top: 20px;
  height: 150px;
  width: 150px;
`;

export default Confirmation;
