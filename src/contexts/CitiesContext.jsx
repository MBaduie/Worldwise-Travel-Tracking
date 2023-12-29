import {
  createContext,
  // useState,
  useEffect,
  useContext,
  useReducer,
  useCallback,
} from "react";

const dataUrl = "http://localhost:5000";

const CitiesContext = createContext();

const intialState = {
  cities: [],
  isLoading: false,
  currentCity: {},
  error: "",
};

function reducer(state, action) {
  switch (action.type) {
    case "loading":
      return { ...state, isLoading: true };
    case "cities/loaded":
      return { ...state, isLoading: false, cities: [...action.payload] };
    case "city/created":
      return {
        ...state,
        isLoading: false,
        cities: [...state.cities, action.payload],
      };
    case "city/deleted":
      return {
        ...state,
        isLoading: false,
        cities: state.cities.filter((city) => city.id !== action.payload),
      };
    case "city/get":
      return { ...state, isLoading: false, currentCity: action.payload };
    case "rejected":
      return { ...state, isLoading: false, error: action.payload };
    default:
      throw new Error("Unknown action type");
  }
}

function CitiesProvider({ children }) {
  const [{ cities, isLoading, currentCity }, dispatch] = useReducer(
    reducer,
    intialState
  );
  // VARIABLES
  // const [cities, setCities] = useState([]);
  // const [isLoading, setIsLoading] = useState(false);
  // const [currentCity, setCurrentCity] = useState({});

  //FUNCTIONS
  useEffect(() => {
    async function fetchCities() {
      dispatch({ type: "loading" });
      try {
        // setIsLoading(true);
        const res = await fetch(`${dataUrl}/cities`);
        const data = await res.json();
        dispatch({ type: "cities/loaded", payload: data });
      } catch {
        dispatch({
          type: "rejected",
          payload: "There's an error to fetch data ...",
        });
      }
    }
    fetchCities();
  }, []);
  //FUNCTION TO FETCH CITY BY ID

  const getCity = useCallback(
    () =>
      async function getCity(id) {
        dispatch({ type: "loading" });
        try {
          // setIsLoading(true);
          const res = await fetch(`${dataUrl}/cities/${id}`);
          const data = await res.json();
          // setCurrentCity(data);
          dispatch({ type: "city/get", payload: data });
        } catch {
          dispatch({
            type: "rejected",
            payload: "Error to fetch selected city",
          });
        }
      },
    [currentCity.id]
  );

  async function createCity(newCity) {
    dispatch({ type: "loading" });
    try {
      // setIsLoading(true);
      const res = await fetch(`${dataUrl}/cities`, {
        method: "POST",
        body: JSON.stringify(newCity),
        headers: {
          "content-type": "application/json",
        },
      });
      const data = await res.json();
      // setCities((cities) => [...cities, data]);
      dispatch({
        type: "city/created",
        payload: data,
      });
    } catch {
      dispatch({ type: "rejected", payload: "Error to add visited city" });
      // setIsLoading(false);
      // dispatch({ type: "loaded" });
    }
  }

  async function deleteCity(id) {
    // setIsLoading(true);
    dispatch({ type: "loading" });
    try {
      await fetch(`${dataUrl}/cities/${id}`, {
        method: "DELETE",
      });
      dispatch({
        type: "city/deleted",
        paylaod: id,
      });
    } catch {
      // throw new Error("Error to delete selected city");
      dispatch({ type: "rejected", payload: "Error to delete selected city" });
    }
  }

  return (
    <CitiesContext.Provider
      value={{
        cities,
        isLoading,
        currentCity,
        getCity,
        createCity,
        deleteCity,
      }}
    >
      {children}
    </CitiesContext.Provider>
  );
}

//CUSTOM HOOK
function UseCitiesContext() {
  const context = useContext(CitiesContext);
  if (context === undefined) {
    throw new Error("useCities must be used within a CitiesProvider");
  }
  return context;
}

export { CitiesProvider, UseCitiesContext };
