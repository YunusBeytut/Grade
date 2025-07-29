"use client"

import { useState } from "react"
import { auth, db } from "../firebase"
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth"
import { setDoc, doc } from "firebase/firestore"
import "../styles/AuthPage.css"
import { useNavigate } from "react-router-dom"

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState("")
  const [success, setSuccess] = useState("")
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErr("")
    setSuccess("")
    setLoading(true)


    try {
      if (isLogin) {
        // GİRİŞ YAP
        console.log("🔑 Giriş denemesi başlıyor:", email)

        const userCredential = await signInWithEmailAndPassword(auth, email, password)
        const user = userCredential.user

        console.log("✅ Firebase Auth başarılı:", user.uid)
        console.log("✅ User object:", user)

        setSuccess("✅ Giriş başarılı! Yönlendiriliyorsunuz...")

        // 2 saniye bekle ve yönlendir
        setTimeout(() => {
          console.log("📍 Ana sayfaya yönlendiriliyor...")
          navigate("/", { replace: true })
        }, 2000)

      } else {

        const userCredential = await createUserWithEmailAndPassword(auth, email, password)
        const user = userCredential.user


        // Firestore'a veri yaz

        await setDoc(doc(db, "users", user.uid), {
          email: email,
          role: "student", // Sadece student test için
          courses: [],
          createdAt: new Date(),
        })


        // Kullanıcıyı çıkış yap
        await auth.signOut()
        console.log("🚪 Otomatik çıkış yapıldı")

        setSuccess("✅ Kayıt başarılı! Şimdi giriş yapabilirsiniz.")

        // Giriş formuna geç
        setTimeout(() => {
          setIsLogin(true)
          setEmail("")
          setPassword("")
          setSuccess("")
        }, 3000)
      }
    } catch (error) {
      console.error("🚨 HATA:", error)
      console.error("🚨 Hata kodu:", error.code)
      console.error("🚨 Hata mesajı:", error.message)

      switch (error.code) {
        case "auth/email-already-in-use":
          setErr("Bu e-posta adresi zaten kullanılıyor.")
          break
        case "auth/user-not-found":
          setErr("Bu e-posta adresi ile kayıtlı kullanıcı bulunamadı.")
          break
        case "auth/wrong-password":
          setErr("E-posta veya şifre hatalı!")
          break
        case "auth/invalid-email":
          setErr("Geçersiz e-posta adresi.")
          break
        case "auth/weak-password":
          setErr("Şifre çok zayıf. En az 6 karakter olmalı.")
          break
        case "auth/network-request-failed":
          setErr("Ağ bağlantısı hatası. İnternet bağlantınızı kontrol edin.")
          break
        case "permission-denied":
          setErr("Firestore izin hatası. Kuralları kontrol edin.")
          break
        default:
          setErr(`Hata: ${error.code} - ${error.message}`)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-bg">
      <form className="auth-card" onSubmit={handleSubmit}>
        <div className="auth-title">
          {isLogin ? "🔑 Giriş Yap" : "📝 Kayıt Ol"}
        </div>

        {err && <div className="auth-error">{err}</div>}
        {success && <div className="auth-success">{success}</div>}

        <label className="auth-label" htmlFor="email">
          E-posta
        </label>
        <input
          id="email"
          className="auth-input"
          type="email"
          placeholder="test@test.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label className="auth-label" htmlFor="password">
          Şifre (en az 6 karakter)
        </label>
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
          {loading ? "İşlem yapılıyor..." : isLogin ? "Giriş Yap" : "Kayıt Ol"}
        </button>

        <div style={{ textAlign: "center", marginTop: 10 }}>
          {isLogin ? "Hesabın yok mu?" : "Zaten hesabın var mı?"}
          <button
            type="button"
            className="auth-toggle"
            onClick={() => {
              setIsLogin(!isLogin)
              setErr("")
              setSuccess("")
            }}
          >
            {isLogin ? "Kayıt Ol" : "Giriş Yap"}
          </button>
        </div>
      </form>
    </div>
  )
}