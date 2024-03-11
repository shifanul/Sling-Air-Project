import { useState, useEffect, useContext } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import Plane from "./Plane";
import Form from "./Form";
import { userContext } from "../userContext";

const SeatSelect = ({ selectedFlight }) => {
  let navigate = useNavigate();
  const [selectedSeat, setSelectedSeat] = useState("");
  const { user, setUser } = useContext(userContext);

  const handleSubmit = (e, formData) => {
    e.preventDefault();
    // TODO: POST info to server
    fetch("/api/add-reservation", {
      method: `POST`,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        flight: selectedFlight,
        seat: selectedSeat,
        ...formData,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        localStorage.setItem("data", data.data);
        setUser(data.data);
      })
      .then(navigate("/confirmation"));
  };

  return (
    <Wrapper>
      <h2>Select your seat and Provide your information!</h2>
      <>
        <FormWrapper>
          <Plane
            setSelectedSeat={setSelectedSeat}
            selectedFlight={selectedFlight}
          />
          <Form handleSubmit={handleSubmit} selectedSeat={selectedSeat} />
        </FormWrapper>
      </>
    </Wrapper>
  );
};

const FormWrapper = styled.div`
  display: flex;
  margin: 50px 0px;
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 50px;
`;

export default SeatSelect;
