import React, { useState } from "react";
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import "../styles/AuthPage.css";

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log("✅ Giriş başarılı:", userCredential.user.uid);
      navigate("/");
    } catch (error) {
      console.error("🚨 Giriş hatası:", error);
      if (error.code === "auth/user-not-found" || error.code === "auth/wrong-password") {
        setErr("E-posta veya şifre hatalı!");
      } else if (error.code === "auth/invalid-email") {
        setErr("Geçersiz e-posta adresi.");
      } else if (error.code === "auth/network-request-failed") {
        setErr("Ağ bağlantısı hatası. İnternetinizi kontrol edin.");
      } else {
        setErr(`Hata: ${error.message}`);
      }
    }

    setLoading(false);
  };

  return (
    <div className="auth-bg">
      <form className="auth-card" onSubmit={handleSubmit}>
        <div className="auth-title">Giriş Yap (Demo Hesapları Kullanınız)</div>

        {err && <div className="auth-error">{err}</div>}

        <label className="auth-label" htmlFor="email">E-posta</label>
        <input
          id="email"
          className="auth-input"
          type="email"
          placeholder="ogrenci1@gmail.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label className="auth-label" htmlFor="password">Şifre</label>
        <input
          id="password"
          type="password"
          className="auth-input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="123456"
          required
        />

        <button className="auth-btn" type="submit" disabled={loading}>
          {loading ? "İşlem yapılıyor..." : "Giriş Yap"}
        </button>

        <div style={{ marginTop: 16, fontSize: "0.9em", color: "#555" }}>
          <b>Demo Hesaplar:</b><br />
          Öğrenci: testhesap1@gmail.com / 123456 <br />
          Öğretmen: testogretmen1@gmail.com / 123456
        </div>
      </form>
    </div>
  );
}
