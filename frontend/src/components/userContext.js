import { createContext, useState } from "react";

export const userContext = createContext(null);

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(
    localStorage.getItem("data") ? localStorage.getItem("data") : null
  );

  return (
    <userContext.Provider value={{ user, setUser }}>
      {children}
    </userContext.Provider>
  );
};

export default UserProvider;
