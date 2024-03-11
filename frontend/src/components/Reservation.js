import { useContext, useState, useEffect } from "react";
import styled from "styled-components";

import tombstone from "../assets/tombstone.png";
import { userContext } from "./userContext";

const Reservation = () => {
  const [reservation, setReservation] = useState();
  const { user } = useContext(userContext);

  useEffect(() => {
    // TODO: GET seating data for selected flight
    fetch(`/api/get-reservation/${user}`)
      .then((res) => res.json())
      .then((data) => setReservation(data.data));
  }, []);

  return (
    <Wrapper>
      <Border>
        <Header>Your Flight Reservation</Header>
        {reservation && user ? (
          <Div>
            <p>Reservation:{reservation.id}</p>
            <p>Flight:{reservation.flight}</p>
            <p>seat #:{reservation.seat}</p>
            <p>
              Lastname:{reservation.lastName} Firstname: {reservation.firstName}
            </p>
            <p>Email:{reservation.email}</p>
          </Div>
        ) : (
          <h1>loading</h1>
        )}
      </Border>
      <Img src={tombstone} />
    </Wrapper>
    // TODO: Display the latest reservation information
    // STRETCH: add FE components to fetch/update/delete reservations
  );
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

export default Reservation;
