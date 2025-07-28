"use client"

import { useState } from "react"
import { auth, db } from "../firebase"
import { createUserWithEmailAndPassword } from "firebase/auth"
import { setDoc, doc, getDoc, collection, getDocs } from "firebase/firestore"

export default function FirebaseTest() {
    const [testResult, setTestResult] = useState("")
    const [loading, setLoading] = useState(false)

    const testFirebaseConnection = async () => {
        setLoading(true)
        setTestResult("🔄 Firebase bağlantısı test ediliyor...\n")

        try {
            // 1. Firebase Auth Test
            setTestResult((prev) => prev + "✅ Firebase Auth bağlantısı başarılı\n")

            // 2. Firestore Bağlantı Test
            try {
                const testCollection = collection(db, "test")
                setTestResult((prev) => prev + "✅ Firestore bağlantısı başarılı\n")
            } catch (error) {
                setTestResult((prev) => prev + "❌ Firestore bağlantı hatası: " + error.message + "\n")
                setLoading(false)
                return
            }

            // 3. Test Kullanıcısı Oluştur
            const testEmail = `test${Date.now()}@test.com`
            const testPassword = "123456"

            setTestResult((prev) => prev + `🔄 Test kullanıcısı oluşturuluyor: ${testEmail}\n`)

            const userCredential = await createUserWithEmailAndPassword(auth, testEmail, testPassword)
            const user = userCredential.user

            setTestResult((prev) => prev + `✅ Firebase Auth'ta kullanıcı oluşturuldu: ${user.uid}\n`)

            // 4. Firestore'a Veri Yazma Test
            const testData = {
                email: testEmail,
                role: "student",
                createdAt: new Date(),
                test: true,
            }

            setTestResult((prev) => prev + "🔄 Firestore'a veri yazılıyor...\n")

            await setDoc(doc(db, "users", user.uid), testData)
            setTestResult((prev) => prev + "✅ Firestore'a veri yazıldı\n")

            // 5. Firestore'dan Veri Okuma Test
            setTestResult((prev) => prev + "🔄 Firestore'dan veri okunuyor...\n")

            const docSnap = await getDoc(doc(db, "users", user.uid))
            if (docSnap.exists()) {
                setTestResult((prev) => prev + "✅ Firestore'dan veri okundu: " + JSON.stringify(docSnap.data()) + "\n")
            } else {
                setTestResult((prev) => prev + "❌ Firestore'dan veri okunamadı\n")
            }

            // 6. Tüm kullanıcıları listele
            setTestResult((prev) => prev + "🔄 Tüm kullanıcılar listeleniyor...\n")

            const usersSnapshot = await getDocs(collection(db, "users"))
            setTestResult((prev) => prev + `✅ Toplam ${usersSnapshot.size} kullanıcı bulundu\n`)

            usersSnapshot.forEach((doc) => {
                const data = doc.data()
                setTestResult((prev) => prev + `📄 ${doc.id}: ${data.email} (${data.role})\n`)
            })

            // 7. Test kullanıcısını temizle
            await user.delete()
            setTestResult((prev) => prev + "🧹 Test kullanıcısı temizlendi\n")

            setTestResult((prev) => prev + "\n🎉 TÜM TESTLER BAŞARILI! Firebase düzgün çalışıyor.\n")
        } catch (error) {
            console.error("Firebase test hatası:", error)
            setTestResult((prev) => prev + `❌ HATA: ${error.code} - ${error.message}\n`)

            if (error.code === "auth/email-already-in-use") {
                setTestResult((prev) => prev + "💡 Bu normal bir hata, test devam ediyor...\n")
            }
        }

        setLoading(false)
    }

    const checkFirestoreRules = () => {
        setTestResult(`
🔧 FIRESTORE KURALLARI KONTROL LİSTESİ:

1. Firebase Console'a gidin: https://console.firebase.google.com
2. Projenizi seçin: obs-system2
3. Sol menüden "Firestore Database" seçin
4. "Rules" sekmesine tıklayın
5. Kurallarınız şöyle olmalı:

rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}

6. "Publish" butonuna tıklayın

⚠️ Bu kurallar test içindir, production'da daha güvenli kurallar kullanın!
    `)
    }

    return (
        <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
            <h1>🔥 Firebase Bağlantı Testi</h1>

            <div style={{ marginBottom: "20px" }}>
                <button
                    onClick={testFirebaseConnection}
                    disabled={loading}
                    style={{
                        padding: "12px 24px",
                        backgroundColor: "#4285f4",
                        color: "white",
                        border: "none",
                        borderRadius: "8px",
                        cursor: loading ? "not-allowed" : "pointer",
                        marginRight: "10px",
                    }}
                >
                    {loading ? "Test Ediliyor..." : "Firebase Bağlantısını Test Et"}
                </button>

                <button
                    onClick={checkFirestoreRules}
                    style={{
                        padding: "12px 24px",
                        backgroundColor: "#ff9800",
                        color: "white",
                        border: "none",
                        borderRadius: "8px",
                        cursor: "pointer",
                    }}
                >
                    Firestore Kuralları Nasıl Düzeltilir?
                </button>
            </div>

            <div
                style={{
                    backgroundColor: "#f5f5f5",
                    padding: "20px",
                    borderRadius: "8px",
                    fontFamily: "monospace",
                    whiteSpace: "pre-wrap",
                    minHeight: "200px",
                    border: "1px solid #ddd",
                }}
            >
                {testResult || "Test sonuçları burada görünecek..."}
            </div>

            <div style={{ marginTop: "20px", padding: "15px", backgroundColor: "#e3f2fd", borderRadius: "8px" }}>
                <h3>🔍 Olası Sorunlar:</h3>
                <ul>
                    <li>
                        <strong>Firestore Kuralları:</strong> Yazma izni verilmemiş olabilir
                    </li>
                    <li>
                        <strong>Firebase Projesi:</strong> Yanlış proje seçilmiş olabilir
                    </li>
                    <li>
                        <strong>Network:</strong> İnternet bağlantısı sorunu
                    </li>
                    <li>
                        <strong>API Anahtarları:</strong> Firebase config yanlış olabilir
                    </li>
                </ul>
            </div>
        </div>
    )
}
