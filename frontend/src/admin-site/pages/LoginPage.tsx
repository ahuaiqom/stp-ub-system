import { useState, type FormEvent } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ApiError } from "../../services/api";
import heroPhoto from "../../assets/images/login.jpg";
import "./LoginPage.css";

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const fromPath =
    (location.state as { from?: string } | null)?.from || "/admin/pertanian";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await login(username.trim(), password);
      navigate(fromPath, { replace: true });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Login gagal. Coba lagi.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="login-shell">
      <section className="login-pane">
        <div className="login-form-wrap">
          <header className="login-heading">
            <h1>Welcome!</h1>
            <p>Please enter your credentials.</p>
          </header>

          <form onSubmit={onSubmit} className="login-form" autoComplete="on">
            <div className="login-field">
              <label htmlFor="username">Email</label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoFocus
                autoComplete="username"
              />
            </div>

            <div className="login-field">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>

            {error && <div className="login-error">{error}</div>}

            <button type="submit" className="login-submit" disabled={submitting}>
              {submitting ? "Memproses…" : "Log in"}
            </button>
          </form>
        </div>
      </section>

      <aside
        className="login-photo"
        style={{ backgroundImage: `url(${heroPhoto})` }}
        aria-hidden
      />
    </div>
  );
};

export default LoginPage;
