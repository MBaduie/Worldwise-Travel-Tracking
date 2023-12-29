// import { Link } from "react-router-dom";
import styles from "./Login.module.css";
import { useState, useEffect } from "react";
import { useAuth } from "../contexts/FakeAuthContext";
import Button from "../components/Button";
import PageNav from "../components/PageNav";
import { useNavigate } from "react-router-dom";
export default function Login() {
  // PRE-FILL FOR DEV PURPOSES
  const { login, isAuthenticated, isValid } = useAuth();
  const [email, setEmail] = useState("jack@example.com");
  const [password, setPassword] = useState("qwerty");
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    if ((email, password)) {
      login(email, password);
    }
  }

  useEffect(() => {
    isAuthenticated && navigate("/app");
  }, [isAuthenticated, navigate]);

  return (
    <main className={styles.login}>
      <PageNav />
      {isValid ? (
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.row}>
            <label htmlFor="email">Email address</label>
            <input
              type="email"
              id="email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
          </div>

          <div className={styles.row}>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />
          </div>

          <div>
            {/* <Link to="/app" className="cta">
            Login
          </Link> */}
            <Button type="primary">Login</Button>
          </div>
        </form>
      ) : (
        "Retry"
      )}
    </main>
  );
}
