import { Link, useNavigate } from "react-router-dom";
import styles from "./CityItem.module.css";
import { UseCitiesContext } from "../contexts/CitiesContext";
// import Button from "./Button";
// import City from "./City
const formatDate = (date) =>
  new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));

function CityItem({ city }) {
  //VARIABLES
  const { currentCity, deleteCity } = UseCitiesContext();
  const { cityName, emoji, date, id, position } = city;
  const navigate = useNavigate();

  async function handleDeleteCity(e) {
    e.preventDefault();
    await deleteCity(id);
    navigate("/app/cities");
  }

  // JSX
  return (
    <li>
      <Link
        className={`${styles.cityItem} ${
          id === currentCity.id ? styles["cityItem--active"] : ""
        }`}
        to={`${id}?lat=${position.lat}&lng=${position.lng}`}
      >
        <span className={styles.emoji}>{emoji}</span>
        <h3 className={styles.name}>{cityName}</h3>
        <time className={styles.date}>{formatDate(date)}</time>
        <button className={styles.deleteBtn} onClick={handleDeleteCity}>
          &times;
        </button>
      </Link>
    </li>
  );
}

export default CityItem;
