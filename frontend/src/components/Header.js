import { useEffect, useState, useContext } from "react";
import styled from "styled-components";
import { NavLink, Link } from "react-router-dom";
import slingairLogo from "../assets/logo_text.png";
import { userContext } from "./userContext";

const Header = ({ handleChange }) => {
  const [flightNumbers, setFlightNumbers] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const { user } = useContext(userContext);

  useEffect(() => {
    //render it once
    //set loading state
    // TODO: GET all flight numbers
    fetch("/api/get-flights")
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setFlightNumbers(data.flights);
      })
      .then(setIsLoaded(true));
  }, []);

  return (
    <Wrapper>
      <Container>
        <Link to="/">
          <Logo src={slingairLogo} alt="Slingshot Airlines Logo" />
        </Link>
        {isLoaded && (
          <label>
            Flight Number:
            <Select onChange={handleChange}>
              <option value="">Select a flight...</option>
              {isLoaded &&
                flightNumbers.map((flight) => {
                  console.log(flight);
                  return <option>{flight}</option>;
                })}
            </Select>
          </label>
        )}
      </Container>
      <Nav>
        <>
          {user && <StyledNavLink to="/reservation">Reservation</StyledNavLink>}
        </>
      </Nav>
    </Wrapper>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

const Select = styled.select`
  padding: 5px;
  margin-left: 25px;
  margin-top: 10px;
  border-radius: 3px;
  font-size: 18px;
  font-family: var(--font-heading);
  font-weight: bold;
  border: solid 3px black;
`;

const Wrapper = styled.header`
  display: flex;
  justify-content: space-between;
  background: var(--color-alabama-crimson);
  height: 150px;
  padding: var(--padding-page) 18px;
`;
const Logo = styled.img`
  height: 60px;
  width: 550px;
`;
const Nav = styled.nav`
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;
const StyledNavLink = styled(NavLink)`
  background: var(--color-selective-yellow);
  border: 1px solid transparent;
  border-radius: 4px;
  color: var(--color-alabama-crimson);
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: var(--font-heading);
  font-size: 18px;
  height: 42px;
  margin: 0 0 0 8px;
  padding: 0 14px;
  width: 100%;
  text-decoration: none;
  transition: all ease 400ms;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }

  &:hover {
    background: var(--color-alabama-crimson);
    color: var(--color-selective-yellow);
    border-color: var(--color-selective-yellow);
  }
`;

export default Header;
