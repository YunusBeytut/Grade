"use client"

import { useAuthState } from "react-firebase-hooks/auth"
import { useEffect, useState } from "react"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { auth, db } from "./firebase"
import { doc, getDoc } from "firebase/firestore"
import LoginPage from "./pages/LoginPage"
import StudentDashboard from "./pages/StudentDashboard"
import TeacherDashboard from "./pages/TeacherDashboard"
import FirebaseTest from "./pages/FirebaseTest"

export default function App() {
  const [user, loading] = useAuthState(auth)
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

  if (loading || roleLoading) {
    return (
      <div
        style={{
          textAlign: "center",
          marginTop: 40,
          fontSize: "18px",
          color: "#6366f1",
        }}
      >
        🔄 Yükleniyor...
      </div>
    )
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/firebase-test" element={<FirebaseTest />} />

        {/* Ana sayfa - Rol kontrolü ile yönlendirme */}
        <Route
          path="/"
          element={
            !user ? (
              <Navigate to="/login" replace />
            ) : role === "teacher" ? (
              <TeacherDashboard />
            ) : role === "student" ? (
              <StudentDashboard />
            ) : (
              <div
                style={{
                  textAlign: "center",
                  marginTop: 40,
                  color: "#ef4444",
                  fontSize: "18px",
                }}
              >
                ❌ Kullanıcı rolü bulunamadı. Lütfen tekrar giriş yapın.
                <br />
                <button
                  onClick={() => auth.signOut()}
                  style={{
                    marginTop: "20px",
                    padding: "10px 20px",
                    background: "#ef4444",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                  }}
                >
                  Çıkış Yap
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
