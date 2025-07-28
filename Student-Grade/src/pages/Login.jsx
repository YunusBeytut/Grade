import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const userId = userCredential.user.uid;
      const docRef = doc(db, "users", userId);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
        setError("Kullanıcı bulunamadı.");
        return;
      }
      const userData = docSnap.data();
      if (userData.role !== role) {
        setError(
          `Bu bir ${role === "teacher" ? "Öğretmen" : "Öğrenci"} hesabı değildir!`
        );
        return;
      }
      // Yönlendirme
      if (role === "teacher") navigate("/teacher-dashboard");
      else navigate("/student-dashboard");
    } catch (err) {
      setError("E-posta veya şifre hatalı!");
    }
  };

  return (
    <div className="login-glass-container">
      <form className="login-glass-box" onSubmit={handleLogin}>
        <h2>Giriş Yap</h2>
        <div className="login-role-row">
          <label>
            <input
              type="radio"
              name="role"
              value="teacher"
              checked={role === "teacher"}
              onChange={() => setRole("teacher")}
            />
            Öğretmen
          </label>
          <label>
            <input
              type="radio"
              name="role"
              value="student"
              checked={role === "student"}
              onChange={() => setRole("student")}
            />
            Öğrenci
          </label>
        </div>
        <input
          type="email"
          placeholder="E-posta"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          className="login-glass-input"
        />
        <input
          type="password"
          placeholder="Şifre"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          className="login-glass-input"
        />
        {error && <div className="login-error">{error}</div>}
        <button type="submit" className="login-glass-btn">Giriş Yap</button>
      </form>
    </div>
  );
}