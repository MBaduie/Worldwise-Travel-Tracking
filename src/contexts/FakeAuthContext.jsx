import { useContext, useState } from "react";
import { createContext } from "react";

const AuthContext = createContext();

// const intialState = {
//   user: null,
//   isAuthenticated: false,
// };

const fakeUser = {
  name: "Jack",
  email: "jack@example.com",
  password: "qwerty",
  avatar: "https://i.pravatar.cc/100?u=zz",
};

// function reducer(state, action) {
//   switch (action) {
//     case "login":
//       return { ...state, user: action.payload, isAuthenticated: true };
//     case "logout":
//       return { ...state, user: null, isAuthenticated: false };
//   }
// }

// eslint-disable-next-line react/prop-types
function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isValid, setIsValid] = useState(true);

  // const [{ user, isAuthenticated }, dispatch] = useReducer(
  //   reducer,
  //   intialState
  // );

  function login(email, password) {
    if (email === fakeUser.email && password === fakeUser.password) {
      // dispatch({ type: "login", payload: fakeUser });
      setUser(fakeUser);
      setIsAuthenticated(true);
    } else setIsValid(false);
  }

  function logout() {
    // dispatch({ type: "logout" });
    setUser(null);
    setIsAuthenticated(false);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isValid,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("AuthContext was used outside provider");
  }
  return context;
};

export { AuthProvider, useAuth };
