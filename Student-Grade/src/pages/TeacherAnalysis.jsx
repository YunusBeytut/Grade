import { useEffect, useState } from "react";
import { db, auth } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import Navbar from "../components/Navbar";
import "./TeacherAnalysis.css";

export default function TeacherAnalysis() {
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [grades, setGrades] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      const coursesCol = collection(db, "courses");
      const snapshot = await getDocs(coursesCol);
      const myCourses = snapshot.docs
        .filter(doc => doc.data().teacherId === auth.currentUser.uid)
        .map(doc => ({ id: doc.id, ...doc.data() }));
      setCourses(myCourses);
    };
    fetchCourses();
  }, []);

  useEffect(() => {
    const fetchStudents = async () => {
      const usersCol = collection(db, "users");
      const snapshot = await getDocs(usersCol);
      setStudents(snapshot.docs
        .filter(doc => doc.data().role === "student")
        .map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchStudents();
  }, []);

  useEffect(() => {
    const fetchGrades = async () => {
      const gradesCol = collection(db, "grades");
      const snapshot = await getDocs(gradesCol);
      setGrades(snapshot.docs.map(doc => doc.data()));
    };
    fetchGrades();
  }, []);

  // Her öğrencinin bu öğretmenin derslerinden aldığı notlar ve analizi
  const getStudentCourseInfo = (studentId, courseId) => {
    const courseGrades = grades.filter(
      g => g.studentId === studentId && g.courseId === courseId
    );
    if (courseGrades.length === 0) return { avg: "-", passed: 0, failed: 0 };
    const avg = (courseGrades.reduce((sum, g) => sum + Number(g.grade), 0) / courseGrades.length).toFixed(2);
    const passed = courseGrades.filter(g => g.grade >= 60).length;
    const failed = courseGrades.filter(g => g.grade < 60).length;
    return { avg, passed, failed, grade: courseGrades[0].grade };
  };

  return (
    <div>
      <Navbar userRole="teacher" />
      <div className="teacher-analysis">
        <h2>Öğrencilerim - Ders Analizi</h2>
        {courses.map(course => (
          <div className="course-block" key={course.id}>
            <h3>{course.name}</h3>
            <table>
              <thead>
                <tr>
                  <th>Öğrenci</th>
                  <th>Not</th>
                  <th>Durum</th>
                </tr>
              </thead>
              <tbody>
                {students.map(stu => {
                  const info = getStudentCourseInfo(stu.id, course.id);
                  if (info.grade === undefined) return null;
                  return (
                    <tr key={stu.id}>
                      <td>{stu.email}</td>
                      <td>{info.grade}</td>
                      <td style={{ color: info.grade >= 60 ? "green" : "red" }}>
                        {info.grade >= 60 ? "Geçti" : "Kaldı"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </div>
  );
}