import React, { useEffect, useState } from "react";
import { signOut } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { collection, doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import "./StudentDashboard.css";
import Announcements from "./Announcements";
import MessagesPanel from "../components/MessagesPanel";

export default function StudentDashboard() {
  const [user] = useAuthState(auth);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAnnouncements, setShowAnnouncements] = useState(false);
  const [showMessages, setShowMessages] = useState(false);

  const navigate = useNavigate();

  // Email'den ad soyad üret
  const getNameFromEmail = email => {
    if (!email) return "";
    const namePart = email.split("@")[0].replace(/[._]/g, " ");
    return namePart
      .split(" ")
      .map(s => s.charAt(0).toUpperCase() + s.slice(1))
      .join(" ");
  };

  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      setLoading(true);
      // users koleksiyonunda öğrencinin dokümanı
      const userDocRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userDocRef);
      if (userSnap.exists()) {
        const userData = userSnap.data();
        // courses: [{name: "Matematik", grade: 92}, ...] şeklinde tutulduğunu varsayıyoruz
        setCourses(userData.courses || []);
      } else {
        setCourses([]);
      }
      setLoading(false);
    };
    fetchData();
  }, [user]);

  // Not ortalaması ve istatistikler
  const average =
    courses.length > 0
      ? (
        courses.reduce((acc, d) => acc + (d.grade || 0), 0) / courses.length
      ).toFixed(1)
      : "-";
  const basarili = courses.filter(d => d.grade >= 60).length;
  const basarisiz = courses.length - basarili;

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  const toggleAnnouncements = () => {
    setShowAnnouncements(!showAnnouncements);
  };

  return (
    <div className="student-dashboard-main">
      <header className="student-dashboard-header">
        <div className="student-dashboard-welcome">
          <span role="img" aria-label="student">🎓</span> Hoşgeldiniz, <b>{getNameFromEmail(user?.email)}</b>
        </div>
        <div className="student-dashboard-nav-buttons">
          <button
            className={`student-dashboard-announcements-btn ${showAnnouncements ? 'active' : ''}`}
            onClick={toggleAnnouncements}
          >
            📢 Duyurular
          </button>
          <button
            className={`student-dashboard-announcements-btn ${showMessages ? "active" : ""}`}
            onClick={() => setShowMessages(!showMessages)}
          >
            💬 Mesajlarım
          </button>
          <button className="student-dashboard-logout" onClick={handleLogout}>
            Çıkış Yap
          </button>
        </div>
      </header>
      <MessagesPanel open={showMessages} onClose={() => setShowMessages(false)} />
      {showAnnouncements && (
        <div className="announcements-section">
          <Announcements />
        </div>
      )}

      <main className="student-dashboard-content">
        <section className="student-dashboard-info-card">
          <h2 className="headline headline-blue">Öğrenci Bilgileri</h2>
          <div className="student-dashboard-info-list">
            <div>
              <span>Ad Soyad:</span>
              <span>{getNameFromEmail(user?.email)}</span>
            </div>
            <div>
              <span>E-posta:</span>
              <span>{user?.email}</span>
            </div>
            <div>
              <span>Not Ortalaması:</span>
              <span>{average}</span>
            </div>
            <div>
              <span>Genel Durum:</span>
              <span className={average >= 60 ? "success" : "danger"}>
                {average === "-" ? "-" : average >= 60 ? "Başarılı" : "Başarısız"}
              </span>
            </div>
          </div>
        </section>

        <section className="student-dashboard-grades-card">
          <h2 className="headline headline-orange">Ders Notları</h2>
          {loading ? (
            <div className="info-message">Yükleniyor...</div>
          ) : courses.length === 0 ? (
            <div className="info-message info-warning">
              Henüz bir ders eklenmemiş. Dersleriniz buraya eklendiğinde notlarınızı görebileceksiniz.
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Ders</th>
                  <th>Not</th>
                  <th>Durum</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((d, i) => (
                  <tr key={i}>
                    <td>{d.name}</td>
                    <td>{d.grade ?? "-"}</td>
                    <td className={d.grade >= 60 ? "success" : "danger"}>
                      {d.grade === undefined ? "-" : d.grade >= 60 ? "Başarılı" : "Başarısız"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>

        <section className="student-dashboard-stats-card">
          <h2 className="headline headline-purple">İstatistikler</h2>
          <div className="student-dashboard-stats">
            <div>
              <span>Toplam Ders</span>
              <b>{courses.length}</b>
            </div>
            <div>
              <span>Başarılı Ders</span>
              <b className="success">{basarili}</b>
            </div>
            <div>
              <span>Başarısız Ders</span>
              <b className="danger">{basarisiz}</b>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}