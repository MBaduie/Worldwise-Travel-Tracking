// import PropTypes from "prop-types";
import CityItem from "./CityItem";
import Spinner from "./Spinner";
import Message from "./Message";
import styles from "./CityList.module.css";
import { UseCitiesContext } from "../contexts/CitiesContext";
function CityList() {
  //VARIABLES
  const { cities, isLoading } = UseCitiesContext();

  //JSX DOM
  if (isLoading) return <Spinner />;
  if (cities.length < 1)
    return <Message message="Add your first City from The Map" />;

  return (
    <ul className={styles.cityList}>
      {cities.map((city) => (
        <CityItem city={city} key={city.id} />
      ))}
    </ul>
  );
}
// CityList.prototype = {
//   citiesList: PropTypes.array.isRequired,
//   isLoading: PropTypes.bool.isRequired,
// };
export default CityList;
