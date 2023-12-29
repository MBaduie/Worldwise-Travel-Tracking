// import PropTypes from "prop-types";
import CountryItem from "./CountryItem";
import Spinner from "./Spinner";
import Message from "./Message";
import styles from "./CountryList.module.css";
import { UseCitiesContext } from "../contexts/CitiesContext";

function CountryList() {
  const { citiesList, isLoading } = UseCitiesContext();

  const countries = citiesList.reduce((arr, city) => {
    {
      if (!arr.map((el) => el.city).includes(city.country)) {
        return [...arr, { country: city.country, emoji: city.emoji }];
      } else return arr;
    }
  }, []);

  if (isLoading) return <Spinner />;
  if (countries.length < 1)
    return <Message message="Add your first Country from The Map" />;

  return (
    <ul className={styles.countryList}>
      {countries.map((country) => (
        <CountryItem country={country} key={country.country} />
      ))}
    </ul>
  );
}
// CountryList.prototype = {
//   citiesList: PropTypes.array.isRequired,
//   isLoading: PropTypes.bool.isRequired,
// };
export default CountryList;
