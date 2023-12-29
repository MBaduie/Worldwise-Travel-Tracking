// "https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=0&longitude=0"

import { useEffect, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";

import styles from "./Form.module.css";
import Button from "./Button";
import BackButton from "./BackButton";

import { UseUrlPosition } from "../hooks/UseUrlPosition";
import Spinner from "./Spinner";
import Message from "./Message";
import DatePicker from "react-datepicker";
import { UseCitiesContext } from "../contexts/CitiesContext";
import { useNavigate } from "react-router-dom";

export function convertToEmoji(countryCode) {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}

function Form() {
  const { createCity, isLoading } = UseCitiesContext();
  const [country, setCountry] = useState("");
  const [lat, lng] = UseUrlPosition();
  const [cityName, setCityName] = useState("");
  const [date, setDate] = useState(new Date());
  const [notes, setNotes] = useState("");
  const [isLoadingGeoCoding, setIsLoadingGeoCoding] = useState(false);
  const [emoji, setEmoji] = useState("");
  const [geoCodingError, setGoeCodingError] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    if (!cityName || !date) return;
    const newCity = {
      cityName,
      emoji,
      date,
      notes,
      position: { lat, lng },
    };
    await createCity(newCity);
    navigate("/app/cities");
  }

  useEffect(() => {
    if (!lat && !lng) return;
    async function fetchCity() {
      setIsLoadingGeoCoding(true);
      setGoeCodingError("");
      try {
        const response = await fetch(
          `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}`
        );
        const data = await response.json();
        console.log(data);

        if (!data.countryCode)
          throw new Error(
            "That doesn't seem to be a valid city, Click to another Location😎"
          );
        setCityName(data.city || data.locality || "");
        setCountry(data.country);
        setEmoji(convertToEmoji(data.countryCode));
      } catch (error) {
        setGoeCodingError(error.message);
      } finally {
        setIsLoadingGeoCoding(false);
      }
    }
    fetchCity();
  }, [lat, lng]);

  if (isLoadingGeoCoding) return <Spinner />;
  if (geoCodingError) return <Message message={geoCodingError} />;
  if (!lat && !lng)
    return <Message message="Click on The Map to get a new City 👀" />;

  return (
    <form
      className={`${styles.form} ${isLoading ? styles.isLoading : ""}`}
      onSubmit={handleSubmit}
    >
      <div className={styles.row}>
        <label htmlFor="cityName">City name</label>
        <input
          id="cityName"
          onChange={(e) => setCityName(e.target.value)}
          value={cityName}
        />
        <span className={styles.flag}>{emoji}</span>
      </div>

      <div className={styles.row}>
        <label htmlFor="date">When did you go to {cityName}?</label>
        {/* <input
          id="date"
          onChange={(e) => setDate(e.target.value)}
          value={date}
        /> */}
        <DatePicker selected={date} onChange={(date) => setDate(date)} />
      </div>

      <div className={styles.row}>
        <label htmlFor="notes">Notes about your trip to {}</label>
        <textarea
          id="notes"
          onChange={(e) => setNotes(e.target.value)}
          value={notes}
        />
      </div>

      <div className={styles.buttons}>
        <Button type="primary">Add</Button>
        <BackButton />
      </div>
    </form>
  );
}

export default Form;
