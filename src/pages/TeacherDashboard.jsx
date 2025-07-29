"use client"

import { useEffect, useState } from "react"
import "./TeacherDashboard.css"
import { db, auth } from "../firebase"
import { collection, getDocs, doc, getDoc, updateDoc } from "firebase/firestore"
import { signOut } from "firebase/auth"
import { useNavigate } from "react-router-dom"
import Announcements from "./Announcements"
import MessagesPanel from "../components/MessagesPanel"

export default function TeacherDashboard() {
  const [teacherName, setTeacherName] = useState("Öğretmen")
  const [teacherDepartments, setTeacherDepartments] = useState([]) // Öğretmenin dersleri
  const [students, setStudents] = useState([])
  const [selectedStudentId, setSelectedStudentId] = useState("")
  const [courseName, setCourseName] = useState("")
  const [grade, setGrade] = useState("")
  const [editState, setEditState] = useState({})
  const [showAnnouncements, setShowAnnouncements] = useState(false)
  const [showMessages, setShowMessages] = useState(false)
  const navigate = useNavigate()

  // Giriş yapan öğretmenin bilgilerini çek
  useEffect(() => {
    const fetchTeacherInfo = async () => {
      if (!auth.currentUser) return
      const userDoc = await getDoc(doc(db, "users", auth.currentUser.uid))
      if (userDoc.exists()) {
        const data = userDoc.data()
        // Username varsa onu kullan, yoksa email'in @ öncesini al
        if (data.username && data.username.trim() !== "") {
          setTeacherName(data.username)
        } else if (data.email) {
          setTeacherName(data.email.split("@")[0])
        } else {
          setTeacherName("Öğretmen")
        }

        // Öğretmenin derslerini al
        setTeacherDepartments(data.departments || [])

        // İlk ders varsa varsayılan olarak seç
        if (data.departments && data.departments.length > 0) {
          setCourseName(data.departments[0])
        }
      }
    }
    fetchTeacherInfo()
  }, [])

  useEffect(() => {
    const fetchStudents = async () => {
      const q = await getDocs(collection(db, "users"))
      const data = []
      q.forEach((docu) => {
        const d = docu.data()
        if (d.role === "student") {
          data.push({
            id: docu.id,
            name: d.username || (d.email ? d.email.split("@")[0] : ""),
            email: d.email,
            courses: d.courses || [],
          })
        }
      })
      setStudents(data)
      if (data.length && !selectedStudentId) setSelectedStudentId(data[0].id)
    }
    fetchStudents()
    // eslint-disable-next-line
  }, [])

  const handleAddGrade = async (e) => {
    e.preventDefault()
    if (!selectedStudentId || !courseName.trim() || grade === "") return

    // Öğretmenin sadece kendi derslerinin notunu ekleyebilmesi kontrolü
    if (!teacherDepartments.includes(courseName.trim())) {
      alert("Bu dersin öğretmeni değilsiniz! Sadece kendi derslerinizin notunu ekleyebilirsiniz.")
      return
    }

    const studentRef = doc(db, "users", selectedStudentId)

    const student = students.find((s) => s.id === selectedStudentId)
    const newCourses = Array.isArray(student.courses) ? [...student.courses] : []

    const idx = newCourses.findIndex((c) => c.name === courseName.trim())
    if (idx !== -1) {
      newCourses[idx] = { ...newCourses[idx], grade: Number(grade) }
    } else {
      newCourses.push({ name: courseName.trim(), grade: Number(grade) })
    }

    await updateDoc(studentRef, { courses: newCourses })

    setStudents((prev) => prev.map((stu) => (stu.id === selectedStudentId ? { ...stu, courses: newCourses } : stu)))
    setGrade("")
  }

  const handleDeleteGrade = async (studentId, courseName) => {
    // Öğretmenin sadece kendi derslerinin notunu silebilmesi kontrolü
    if (!teacherDepartments.includes(courseName)) {
      alert("Bu dersin öğretmeni değilsiniz! Sadece kendi derslerinizin notunu silebilirsiniz.")
      return
    }

    const student = students.find((s) => s.id === studentId)
    const studentRef = doc(db, "users", studentId)
    const newCourses = student.courses.filter((c) => c.name !== courseName)
    await updateDoc(studentRef, { courses: newCourses })

    setStudents((prev) => prev.map((stu) => (stu.id === studentId ? { ...stu, courses: newCourses } : stu)))
  }

  const handleStartEdit = (studentId, courseName, oldGrade) => {
    // Öğretmenin sadece kendi derslerinin notunu düzenleyebilmesi kontrolü
    if (!teacherDepartments.includes(courseName)) {
      alert("Bu dersin öğretmeni değilsiniz! Sadece kendi derslerinizin notunu düzenleyebilirsiniz.")
      return
    }

    setEditState({
      ...editState,
      [studentId + "___" + courseName]: { editing: true, value: oldGrade },
    })
  }

  const handleEditChange = (studentId, courseName, newVal) => {
    setEditState({
      ...editState,
      [studentId + "___" + courseName]: { ...editState[studentId + "___" + courseName], value: newVal },
    })
  }

  const handleSaveEdit = async (studentId, courseName) => {
    const newVal = editState[studentId + "___" + courseName].value
    if (newVal === "" || isNaN(Number(newVal))) return
    const student = students.find((s) => s.id === studentId)
    const studentRef = doc(db, "users", studentId)
    const newCourses = student.courses.map((c) => (c.name === courseName ? { ...c, grade: Number(newVal) } : c))
    await updateDoc(studentRef, { courses: newCourses })
    setStudents((prev) => prev.map((stu) => (stu.id === studentId ? { ...stu, courses: newCourses } : stu)))
    setEditState({ ...editState, [studentId + "___" + courseName]: { editing: false, value: "" } })
  }

  const handleCancelEdit = (studentId, courseName) => {
    setEditState({ ...editState, [studentId + "___" + courseName]: { editing: false, value: "" } })
  }

  // ÇIKIŞ FONKSİYONU
  const handleLogout = async () => {
    await signOut(auth)
    navigate("/login")
  }

  const toggleAnnouncements = () => {
    setShowAnnouncements(!showAnnouncements)
  }

  // İstatistikler - Sadece öğretmenin derslerini say
  const totalStudents = students.length
  const ungradedStudents = students.filter((s) => !s.courses || s.courses.length === 0).length

  // Sadece öğretmenin derslerindeki notları say
  const teacherGrades = students.flatMap((s) =>
    (s.courses || []).filter((c) => teacherDepartments.includes(c.name)).map((c) => c.grade),
  )
  const passed = teacherGrades.filter((g) => g >= 60).length
  const failed = teacherGrades.filter((g) => g < 60).length

  return (
    <>
      {/* MODERN GLASS NAVBAR */}
      <nav className="klas-navbar">
        <div className="klas-navbar-inner">
          <div className="klas-navbar-left">
            <div className="klas-navbar-logo">🎓</div>
            <span className="klas-navbar-title">
              Hoşgeldiniz, <b>{teacherName}</b>
              {teacherDepartments.length > 0 && (
                <div style={{ fontSize: "12px", color: "#ffe77a", marginTop: "2px" }}>
                  📚 {teacherDepartments.join(", ")} Öğretmeni
                </div>
              )}
            </span>
          </div>
          <div className="klas-navbar-right">
            <button
              className={`klas-navbar-announcements-btn ${showAnnouncements ? "active" : ""}`}
              onClick={toggleAnnouncements}
            >
              📢 Duyurular
            </button>
            <button
              className={`klas-navbar-announcements-btn ${showMessages ? "active" : ""}`}
              style={{ marginLeft: 8 }}
              onClick={() => setShowMessages(!showMessages)}
            >
              💬 Mesajlarım
            </button>
            <button className="klas-navbar-logout-btn" onClick={handleLogout}>
              Çıkış Yap
            </button>
          </div>
        </div>
      </nav>
       <div className="demo-banner">
    ⚠️ Bu panel demo sürümündedir. Verileriniz kalıcı değildir.
  </div>
      <MessagesPanel open={showMessages} onClose={() => setShowMessages(false)} />
      {showAnnouncements && (
        <div className="announcements-section">
          <Announcements canAdd={true} />
        </div>
      )}

      <main className="dashboard-center-main">
        {/* Not ekleme formu - Sadece öğretmenin dersleri */}
        <section className="modern-form-section">
          <form className="modern-grade-form glass-box" onSubmit={handleAddGrade}>
            <h2>Öğrenciye Not Ekle</h2>
            {teacherDepartments.length === 0 && (
              <div
                style={{
                  background: "#fef2f2",
                  color: "#dc2626",
                  padding: "10px",
                  borderRadius: "8px",
                  marginBottom: "15px",
                  textAlign: "center",
                }}
              >
                ⚠️ Henüz hiçbir dersin öğretmeni olarak atanmamışsınız!
              </div>
            )}
            <div className="modern-grade-form-row">
              <select
                className="modern-form-input"
                value={selectedStudentId}
                onChange={(e) => setSelectedStudentId(e.target.value)}
                required
              >
                {students.map((stu) => (
                  <option key={stu.id} value={stu.id}>
                    {stu.name}
                  </option>
                ))}
              </select>

              {/* Ders seçimi - Sadece öğretmenin dersleri */}
              <select
                className="modern-form-input"
                value={courseName}
                onChange={(e) => setCourseName(e.target.value)}
                required
                disabled={teacherDepartments.length === 0}
              >
                <option value="">Ders Seçin</option>
                {teacherDepartments.map((dept) => (
                  <option key={dept} value={dept}>
                    📖 {dept}
                  </option>
                ))}
              </select>

              <input
                type="number"
                className="modern-form-input"
                placeholder="Not"
                min={0}
                max={100}
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                required
                disabled={teacherDepartments.length === 0}
              />
              <button className="modern-form-btn" type="submit" disabled={teacherDepartments.length === 0}>
                Ekle
              </button>
            </div>
          </form>
        </section>

        {/* Öğrenciler Ortadaki Büyük Beyaz Div */}
        <section className="students-center-area">
          <div className="students-area-inner glass-box">
            <div className="students-grid">
              {students.map((student) => (
                <div className="student-big-card" key={student.id}>
                  <div className="student-big-name">{student.name}</div>
                  <div className="student-big-mail">{student.email}</div>
                  <div className="student-big-notlar">
                    <div className="notlar-title">Notlar</div>
                    {(student.courses || []).length === 0 ? (
                      <div className="student-no-grade">Henüz not yok</div>
                    ) : (
                      <div className="student-notlar-list">
                        {student.courses.map((course, cidx) => {
                          const editKey = student.id + "___" + course.name
                          const isEditing = editState[editKey]?.editing
                          const isTeacherCourse = teacherDepartments.includes(course.name)

                          return (
                            <div className="notlar-row" key={cidx}>
                              <span className="notlar-ders">
                                {isTeacherCourse ? "📖" : "📚"} {course.name}
                                {!isTeacherCourse && (
                                  <span style={{ fontSize: "11px", color: "#6b7280", marginLeft: "5px" }}>
                                    (Başka öğretmen)
                                  </span>
                                )}
                              </span>
                              {isEditing ? (
                                <>
                                  <input
                                    type="number"
                                    className="edit-grade-input"
                                    min={0}
                                    max={100}
                                    value={editState[editKey].value}
                                    onChange={(e) => handleEditChange(student.id, course.name, e.target.value)}
                                    style={{ width: "64px", marginRight: 10 }}
                                  />
                                  <button
                                    className="edit-grade-btn"
                                    type="button"
                                    onClick={() => handleSaveEdit(student.id, course.name)}
                                  >
                                    Kaydet
                                  </button>
                                  <button
                                    className="edit-cancel-btn"
                                    type="button"
                                    onClick={() => handleCancelEdit(student.id, course.name)}
                                  >
                                    İptal
                                  </button>
                                </>
                              ) : (
                                <>
                                  <span className={`notlar-grade ${course.grade >= 60 ? "passed" : "failed"}`}>
                                    {course.grade}
                                  </span>
                                  {isTeacherCourse ? (
                                    <>
                                      <button
                                        className="icon-btn"
                                        title="Notu düzenle"
                                        onClick={() => handleStartEdit(student.id, course.name, course.grade)}
                                      >
                                        ✏️
                                      </button>
                                      <button
                                        className="icon-btn"
                                        title="Notu sil"
                                        onClick={() => handleDeleteGrade(student.id, course.name)}
                                      >
                                        🗑️
                                      </button>
                                    </>
                                  ) : (
                                    <span style={{ fontSize: "12px", color: "#6b7280", marginLeft: "10px" }}>🔒</span>
                                  )}
                                </>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Modern İstatistik Kartları - Sadece öğretmenin dersleri */}
        <section className="modern-stats-section">
          <div className="modern-stats-cards">
            <div className="modern-stats-card gradient-blue">
              <div className="modern-stats-icon">👥</div>
              <div>
                <div className="modern-stats-main">{totalStudents}</div>
                <div className="modern-stats-desc">Toplam Öğrenci</div>
              </div>
            </div>
            <div className="modern-stats-card gradient-green">
              <div className="modern-stats-icon">🏆</div>
              <div>
                <div className="modern-stats-main">{passed}</div>
                <div className="modern-stats-desc">Derslerimde Geçen</div>
              </div>
            </div>
            <div className="modern-stats-card gradient-red">
              <div className="modern-stats-icon">🚫</div>
              <div>
                <div className="modern-stats-main">{failed}</div>
                <div className="modern-stats-desc">Derslerimde Kalan</div>
              </div>
            </div>
            <div className="modern-stats-card gradient-yellow">
              <div className="modern-stats-icon">📚</div>
              <div>
                <div className="modern-stats-main">{teacherDepartments.length}</div>
                <div className="modern-stats-desc">Verdiğim Ders</div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
