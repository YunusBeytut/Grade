import React, { useEffect, useState } from "react";
import { db, auth } from "../firebase";
import {
    collection,
    addDoc,
    getDocs,
    Timestamp,
    deleteDoc,
    doc,
    query,
    orderBy,
} from "firebase/firestore";
import "./Announcements.css";

export default function Announcements({ canAdd = false, onLatestDateChange }) {
    const [announcements, setAnnouncements] = useState([]);
    const [title, setTitle] = useState("");
    const [desc, setDesc] = useState("");
    const [loading, setLoading] = useState(false);
    const [addMode, setAddMode] = useState(false);

    const fetchAnnouncements = async () => {
        const q = query(collection(db, "announcements"), orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);
        const list = snapshot.docs.map((docu) => ({
            id: docu.id,
            ...docu.data(),
        }));
        setAnnouncements(list);
        if (list.length && onLatestDateChange) {
            // Firestore Timestamp'u milisaniyeye çevir
            const ts = list[0].createdAt?.toMillis?.() || (list[0].createdAt instanceof Date ? list[0].createdAt.getTime() : null);
            onLatestDateChange(ts);
        }
    };

    useEffect(() => {
        fetchAnnouncements();
        // eslint-disable-next-line
    }, []);

    const handleAdd = async (e) => {
        e.preventDefault();
        setLoading(true);
        await addDoc(collection(db, "announcements"), {
            title,
            desc,
            createdAt: Timestamp.now(),
            teacher: auth.currentUser?.email || "Bilinmeyen"
        });
        setTitle("");
        setDesc("");
        setAddMode(false);
        setLoading(false);
        fetchAnnouncements();
    };

    const handleDelete = async (id, teacher) => {
        if (window.confirm("Duyuru silinsin mi?") && (auth.currentUser?.email === teacher)) {
            await deleteDoc(doc(db, "announcements", id));
            fetchAnnouncements();
        }
    };

    return (
        <div className="announcements-main">
            <h2 className="announcements-title">Duyurular</h2>
            {canAdd && (
                <div className="announcements-add">
                    {!addMode ? (
                        <button onClick={() => setAddMode(true)} className="announcements-add-btn">
                            + Yeni Duyuru Ekle
                        </button>
                    ) : (
                        <form onSubmit={handleAdd} className="announcements-form">
                            <input
                                type="text"
                                placeholder="Başlık"
                                value={title}
                                onChange={e => setTitle(e.target.value)}
                                required
                                className="announcements-input"
                            />
                            <textarea
                                placeholder="Açıklama"
                                value={desc}
                                onChange={e => setDesc(e.target.value)}
                                required
                                className="announcements-textarea"
                            />
                            <div>
                                <button type="submit" disabled={loading} className="announcements-add-btn">
                                    {loading ? "Ekleniyor..." : "Ekle"}
                                </button>
                                <button type="button" onClick={() => setAddMode(false)} className="announcements-cancel-btn">
                                    İptal
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            )}
            <div className="announcements-list">
                {announcements.length === 0 && <div className="announcements-empty">Henüz duyuru yok.</div>}
                {announcements.map(a => (
                    <div key={a.id} className="announcement-card">
                        <div className="announcement-header">
                            <span className="announcement-title">{a.title}</span>
                            <span className="announcement-date">
                                {a.createdAt?.toDate?.().toLocaleString("tr-TR") || ""}
                            </span>
                        </div>
                        <div className="announcement-desc">{a.desc}</div>
                        <div className="announcement-footer">
                            <span className="announcement-teacher">{a.teacher}</span>
                            {canAdd && auth.currentUser?.email === a.teacher && (
                                <button className="announcements-delete-btn" onClick={() => handleDelete(a.id, a.teacher)}>
                                    Sil
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}