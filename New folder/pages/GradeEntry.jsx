import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs, addDoc } from "firebase/firestore";
import Navbar from "../components/Navbar";
import "./GradeEntry.css";

export default function GradeEntry() {
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [grade, setGrade] = useState("");

  useEffect(() => {
    const fetchStudents = async () => {
      const usersCol = collection(db, "users");
      const snapshot = await getDocs(usersCol);
      setStudents(snapshot.docs.filter(doc => doc.data().role === "student").map(doc => ({
        id: doc.id,
        email: doc.data().email
      })));
    };
    fetchStudents();
    const fetchCourses = async () => {
      const coursesCol = collection(db, "courses");
      const snapshot = await getDocs(coursesCol);
      setCourses(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchCourses();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addDoc(collection(db, "grades"), {
      studentId: selectedStudent,
      courseId: selectedCourse,
      grade,
      courseName: courses.find(c => c.id === selectedCourse)?.name || ""
    });
    setGrade("");
  };

  return (
    <div>
      <Navbar userRole="teacher" />
      <div className="grade-entry">
        <h2>Not Girişi</h2>
        <form onSubmit={handleSubmit}>
          <select required value={selectedStudent} onChange={e => setSelectedStudent(e.target.value)}>
            <option value="">Öğrenci Seç</option>
            {students.map(s => <option key={s.id} value={s.id}>{s.email}</option>)}
          </select>
          <select required value={selectedCourse} onChange={e => setSelectedCourse(e.target.value)}>
            <option value="">Ders Seç</option>
            {courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <input
            type="number"
            min={0}
            max={100}
            required
            value={grade}
            onChange={e => setGrade(e.target.value)}
            placeholder="Not"
          />
          <button type="submit">Kaydet</button>
        </form>
      </div>
    </div>
  );
}