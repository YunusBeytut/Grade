import React, { useState } from "react";
import { auth, db } from "../firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import "../styles/AuthPage.css";

const OGRETMEN_KODU = "uni2024";

export default function AuthPage() {
    const [isLogin, setIsLogin] = useState(true);
    const [role, setRole] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState("");
    const [teacherCode, setTeacherCode] = useState("");
    const navigate = useNavigate();

    const getEmailFromUsername = (username, role) => {
        const domain = role === "teacher" ? "ogretmen.com" : "ogrenci.com";
        return `${username}@${domain}`;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErr("");
        setLoading(true);

        // Validation kontrolleri
        if (!/^[a-z0-9._-]+$/i.test(username)) {
            setErr("Kullanıcı adı harf, rakam, nokta, tire veya alt çizgi içermelidir.");
            setLoading(false);
            return;
        }
        if (password.length < 6) {
            setErr("Şifre en az 6 karakter olmalı.");
            setLoading(false);
            return;
        }

        try {
            if (isLogin) {
                // GİRİŞ YAP - Hem öğrenci hem öğretmen e-postalarını dene
                let userCredential = null;
                let actualRole = null;

                try {
                    // Önce öğrenci e-postasını dene
                    const studentEmail = getEmailFromUsername(username.toLowerCase(), "student");
                    userCredential = await signInWithEmailAndPassword(auth, studentEmail, password);
                    actualRole = "student";
                } catch (studentError) {
                    try {
                        // Öğrenci başarısız olursa öğretmen e-postasını dene
                        const teacherEmail = getEmailFromUsername(username.toLowerCase(), "teacher");
                        userCredential = await signInWithEmailAndPassword(auth, teacherEmail, password);
                        actualRole = "teacher";
                    } catch (teacherError) {
                        throw new Error("auth/user-not-found");
                    }
                }

                // Kullanıcının veritabanındaki rolünü kontrol et
                const userDoc = await getDoc(doc(db, "users", userCredential.user.uid));
                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    if (userData.role !== actualRole) {
                        throw new Error("auth/role-mismatch");
                    }
                } else {
                    throw new Error("auth/user-not-found");
                }

                console.log("✅ Giriş başarılı, yönlendiriliyor...");
                navigate("/");
            } else {
                // KAYIT OL
                if (!role) {
                    setErr("Lütfen kullanıcı tipini seçin.");
                    setLoading(false);
                    return;
                }

                // Öğretmen kodu kontrolü
                if (role === "teacher" && teacherCode !== OGRETMEN_KODU) {
                    setErr("Geçersiz öğretmen güvenlik kodu!");
                    setLoading(false);
                    return;
                }

                const email = getEmailFromUsername(username.toLowerCase(), role);

                // Kayıt ol
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;

                // Firestore'a kullanıcı bilgilerini kaydet
                const userData = {
                    email: email,
                    username: username.toLowerCase(),
                    role: role,
                    courses: [],
                    departments: role === "teacher" ? [] : undefined, // Öğretmenlere departments array'i ekle
                    createdAt: new Date(),
                };

                await setDoc(doc(db, "users", user.uid), userData);

                console.log("✅ Kayıt başarılı, giriş sayfasına yönlendiriliyor...");

                // Kayıt başarılı, giriş formuna geç
                setIsLogin(true);
                setUsername("");
                setPassword("");
                setRole("");
                setTeacherCode("");
                setErr("");
                alert("Kayıt başarılı! Şimdi giriş yapabilirsiniz.");
            }
        } catch (error) {
            console.error("🚨 Auth Hatası:", error);

            if (error.code === "auth/user-not-found" || error.code === "auth/wrong-password" || error.message === "auth/user-not-found") {
                setErr("Kullanıcı adı veya şifre hatalı!");
            } else if (error.message === "auth/role-mismatch") {
                setErr("Rol uyuşmazlığı! Lütfen doğru kullanıcı tipini seçin.");
            } else if (error.code === "auth/email-already-in-use") {
                setErr("Bu kullanıcı adı zaten kullanılıyor!");
            } else if (error.code === "auth/weak-password") {
                setErr("Şifre çok zayıf. En az 6 karakter olmalı.");
            } else if (error.code === "auth/invalid-email") {
                setErr("Geçersiz e-posta formatı.");
            } else if (error.code === "auth/network-request-failed") {
                setErr("Ağ bağlantısı hatası. İnternet bağlantınızı kontrol edin.");
            } else {
                setErr(`Hata: ${error.message}`);
            }
        }
        setLoading(false);
    };

    const toggleMode = () => {
        setIsLogin(!isLogin);
        setErr("");
        setTeacherCode("");
        setRole("");
    };

    return (
        <div className="auth-bg">
            <form className="auth-card" onSubmit={handleSubmit}>
                <div className="auth-title">{isLogin ? "Giriş Yap" : "Kayıt Ol"}</div>

                {/* Demo bilgi kutusu - sadece giriş modunda göster */}
                {isLogin && (
                    <div style={{
                        background: "#f0f9ff",
                        border: "2px solid #0ea5e9",
                        borderRadius: "8px",
                        padding: "12px",
                        marginBottom: "16px",
                        fontSize: "0.9em"
                    }}>
                        <div style={{ fontWeight: "700", color: "#0ea5e9", marginBottom: "6px" }}>
                            🎯 Demo Hesapları:
                        </div>
                        <div style={{ color: "#075985" }}>
                            <strong>Öğrenci:</strong> ogrenci1 / 123456<br />
                            <strong>Öğretmen:</strong> ogretmen1 / 123456
                        </div>
                    </div>
                )}

                {err && <div className="auth-error">{err}</div>}

                <label className="auth-label" htmlFor="username">Kullanıcı Adı</label>
                <input
                    id="username"
                    className="auth-input"
                    type="text"
                    autoComplete="username"
                    placeholder="kullaniciadi"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    required
                />

                <label className="auth-label" htmlFor="password">Şifre</label>
                <input
                    id="password"
                    type="password"
                    className="auth-input"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Şifreniz"
                    autoComplete={isLogin ? "current-password" : "new-password"}
                    required
                />

                {/* Kayıt modunda kullanıcı tipi ve teacherCode alanı */}
                {!isLogin && (
                    <div>
                        <span className="auth-label">Kullanıcı Tipi</span>
                        <div className="auth-radio-group">
                            <label className="auth-radio-label">
                                <input
                                    type="radio"
                                    className="auth-radio"
                                    name="role"
                                    value="student"
                                    checked={role === "student"}
                                    onChange={() => setRole("student")}
                                    required
                                /> Öğrenci
                            </label>
                            <label className="auth-radio-label">
                                <input
                                    type="radio"
                                    className="auth-radio"
                                    name="role"
                                    value="teacher"
                                    checked={role === "teacher"}
                                    onChange={() => setRole("teacher")}
                                    required
                                /> Öğretmen
                            </label>
                        </div>
                        {role === "teacher" && (
                            <div
                                className="teacher-code-section"
                                style={{
                                    background: 'rgba(48, 102, 190, 0.08)',
                                    border: '2px solid rgba(48, 102, 190, 0.2)',
                                    borderRadius: '12px',
                                    padding: '16px',
                                    marginTop: '12px',
                                    animation: 'slideDown 0.3s ease-out'
                                }}
                            >
                                <label
                                    className="auth-label"
                                    htmlFor="teacher-code"
                                    style={{
                                        color: '#3066be',
                                        fontWeight: '700',
                                        marginBottom: '8px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '6px'
                                    }}
                                >
                                    🔐 Öğretmen Güvenlik Kodu
                                </label>
                                <input
                                    id="teacher-code"
                                    className="auth-input"
                                    type="password"
                                    placeholder="Güvenlik kodunu giriniz"
                                    value={teacherCode}
                                    onChange={e => setTeacherCode(e.target.value)}
                                    required
                                    style={{
                                        background: 'rgba(255, 255, 255, 0.9)',
                                        border: '2px solid rgba(48, 102, 190, 0.3)',
                                        marginBottom: '0'
                                    }}
                                />
                                <div
                                    className="teacher-code-hint"
                                    style={{
                                        fontSize: '0.9em',
                                        color: '#5ea5e6',
                                        fontStyle: 'italic',
                                        marginTop: '6px',
                                        textAlign: 'center'
                                    }}
                                >
                                    Öğretmen hesabı oluşturmak için geçerli güvenlik kodu gereklidir
                                </div>
                            </div>
                        )}
                    </div>
                )}

                <button className="auth-btn" type="submit" disabled={loading}>
                    {loading ? "..." : isLogin ? "Giriş Yap" : "Kayıt Ol"}
                </button>

                <div style={{ textAlign: "center", marginTop: 10, fontSize: "0.98em" }}>
                    {isLogin ? "Hesabın yok mu?" : "Zaten hesabın var mı?"}
                    <button
                        type="button"
                        className="auth-toggle"
                        onClick={toggleMode}
                        tabIndex={-1}
                    >
                        {isLogin ? "Kayıt Ol" : "Giriş Yap"}
                    </button>
                </div>
            </form>
        </div>
    );
}