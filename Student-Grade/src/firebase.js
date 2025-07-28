// Firebase'i projene entegre eden temel dosya

import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"

// Senin Firebase projenin ayarları
const firebaseConfig = {
  apiKey: "AIzaSyCoeCSXrOhpRl8E5ZsRlZ1NW9k3vGVc9u0",
  authDomain: "obs-system2.firebaseapp.com",
  projectId: "obs-system2",
  storageBucket: "obs-system2.appspot.com",
  messagingSenderId: "936038276745",
  appId: "1:936038276745:web:ddb3d7478368007e797058",
}

// Firebase'i başlat
const app = initializeApp(firebaseConfig)

// Kullanılacak servisleri dışa aktar
export const auth = getAuth(app)
export const db = getFirestore(app)

// Firebase bağlantısını test et
auth.onAuthStateChanged((user) => {
  if (user) {
    console.log("Firebase Auth bağlantısı başarılı, kullanıcı oturum açmış:", user.uid)
  } else {
    console.log("Firebase Auth bağlantısı başarılı, kullanıcı oturum açmamış")
  }
})
