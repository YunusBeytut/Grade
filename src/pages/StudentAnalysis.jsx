import Navbar from "../components/Navbar";
import "../styles/StudentAnalysis.css";

export default function StudentAnalysis() {
  // Örnek veriyle analiz tablosu
  const grades = [
    { courseName: "Matematik", grade: 80 },
    { courseName: "Fizik", grade: 55 },
    { courseName: "Kimya", grade: 70 },
  ];
  const avg = (grades.reduce((sum, g) => sum + g.grade, 0) / grades.length).toFixed(2);
  const passed = grades.filter(g => g.grade >= 60).length;
  const failed = grades.filter(g => g.grade < 60).length;

  return (
    <div>
      <Navbar userRole="student" />
      <div className="analysis-box">
        <h2>Akademik Analiz</h2>
        <div className="analysis-summary">
          <div>Geçilen Ders: <b>{passed}</b></div>
          <div>Kaldığı Ders: <b>{failed}</b></div>
          <div>Not Ortalaması: <b>{avg}</b></div>
        </div>
        <table>
          <thead>
            <tr>
              <th>Ders</th>
              <th>Not</th>
              <th>Durum</th>
            </tr>
          </thead>
          <tbody>
            {grades.map((g, i) => (
              <tr key={i}>
                <td>{g.courseName}</td>
                <td>{g.grade}</td>
                <td style={{ color: g.grade >= 60 ? "green" : "red" }}>
                  {g.grade >= 60 ? "Geçti" : "Kaldı"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}