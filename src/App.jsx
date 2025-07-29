"use client"

import { useAuthState } from "react-firebase-hooks/auth"
import { useEffect, useState } from "react"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { auth, db } from "./firebase"
import { doc, getDoc } from "firebase/firestore"
import AuthPage from "./pages/AuthPage"
import StudentDashboard from "./pages/StudentDashboard"
import TeacherDashboard from "./pages/TeacherDashboard"

export default function App() {
  const [user, loading, error] = useAuthState(auth)
  const [role, setRole] = useState(null)
  const [roleLoading, setRoleLoading] = useState(false)

  useEffect(() => {
    if (user) {
      console.log("App.jsx - Kullanıcı var:", user.uid)
      setRoleLoading(true)
      getDoc(doc(db, "users", user.uid))
        .then((snap) => {
          if (snap.exists()) {
            const userData = snap.data()
            console.log("App.jsx - Kullanıcı rolü:", userData.role)
            setRole(userData.role)
          } else {
            console.log("App.jsx - Kullanıcı dokümanı bulunamadı")
            setRole(null)
          }
          setRoleLoading(false)
        })
        .catch((error) => {
          console.error("App.jsx - Rol alma hatası:", error)
          setRole(null)
          setRoleLoading(false)
        })
    } else {
      console.log("App.jsx - Kullanıcı yok")
      setRole(null)
      setRoleLoading(false)
    }
  }, [user])

  // Auth hatası varsa göster
  if (error) {
    return (
      <div
        style={{
          textAlign: "center",
          marginTop: 40,
          fontSize: "18px",
          color: "#ef4444",
        }}
      >
        ❌ Firebase bağlantı hatası: {error.message}
        <br />
        <button
          onClick={() => window.location.reload()}
          style={{
            marginTop: "20px",
            padding: "10px 20px",
            background: "#6366f1",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          Sayfayı Yenile
        </button>
      </div>
    )
  }

  if (loading || roleLoading) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "#fff",
          fontFamily: "'Inter', sans-serif",
        }}
      >
        <div
          style={{
            fontSize: "3rem",
            marginBottom: "20px",
            animation: "spin 2s linear infinite",
          }}
        >
          🔄
        </div>
        <div style={{ fontSize: "1.2rem", fontWeight: "600" }}>
          {loading ? "Kimlik doğrulanıyor..." : "Kullanıcı bilgileri yükleniyor..."}
        </div>
        <style>
          {`
            @keyframes spin {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
          `}
        </style>
      </div>
    )
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={<AuthPage />} />

        {/* Ana sayfa - Rol kontrolü ile yönlendirme */}
        <Route
          path="/"
          element={
            !user ? (
              <Navigate to="/auth" replace />
            ) : role === "teacher" ? (
              <TeacherDashboard />
            ) : role === "student" ? (
              <StudentDashboard />
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  minHeight: "100vh",
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  color: "#fff",
                  fontFamily: "'Inter', sans-serif",
                  textAlign: "center",
                  padding: "20px",
                }}
              >
                <div style={{ fontSize: "4rem", marginBottom: "20px" }}>❌</div>
                <h2 style={{ fontSize: "1.5rem", marginBottom: "15px" }}>
                  Kullanıcı Rolü Bulunamadı
                </h2>
                <p style={{ fontSize: "1.1rem", marginBottom: "30px", opacity: 0.9 }}>
                  Hesabınızda bir sorun var. Lütfen tekrar giriş yapın.
                </p>
                <button
                  onClick={() => auth.signOut()}
                  style={{
                    padding: "15px 30px",
                    fontSize: "1.1rem",
                    background: "rgba(255, 255, 255, 0.2)",
                    color: "#fff",
                    border: "2px solid rgba(255, 255, 255, 0.3)",
                    borderRadius: "12px",
                    cursor: "pointer",
                    fontWeight: "600",
                    transition: "all 0.3s ease",
                    backdropFilter: "blur(10px)",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = "rgba(255, 255, 255, 0.3)"
                    e.target.style.transform = "translateY(-2px)"
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = "rgba(255, 255, 255, 0.2)"
                    e.target.style.transform = "translateY(0)"
                  }}
                >
                  Çıkış Yap ve Tekrar Giriş Yap
                </button>
              </div>
            )
          }
        />

        {/* Diğer tüm route'lar ana sayfaya yönlendir */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  )
}