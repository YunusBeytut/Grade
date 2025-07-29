import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { collection, addDoc, getDocs, orderBy, query, deleteDoc, doc } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import "./Announcements.css";

export default function Announcements({ canAdd = false }) {
    const [user] = useAuthState(auth);
    const [announcements, setAnnouncements] = useState([]);
    const [newAnnouncement, setNewAnnouncement] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchAnnouncements();
    }, []);

    const fetchAnnouncements = async () => {
        try {
            const q = query(collection(db, 'announcements'), orderBy('createdAt', 'desc'));
            const querySnapshot = await getDocs(q);
            const announcementsData = [];
            querySnapshot.forEach((doc) => {
                announcementsData.push({ id: doc.id, ...doc.data() });
            });
            setAnnouncements(announcementsData);
        } catch (error) {
            console.error('Duyurular yüklenirken hata:', error);
        }
    };

    const handleAddAnnouncement = async (e) => {
        e.preventDefault();
        if (!newAnnouncement.trim()) return;

        setLoading(true);
        try {
            await addDoc(collection(db, 'announcements'), {
                text: newAnnouncement.trim(),
                authorId: user.uid,
                authorEmail: user.email,
                createdAt: new Date(),
            });
            setNewAnnouncement('');
            fetchAnnouncements();
        } catch (error) {
            console.error('Duyuru eklenirken hata:', error);
            alert('Duyuru eklemek için yetkili değilsiniz.');
        }
        setLoading(false);
    };

    const handleDeleteAnnouncement = async (announcementId, authorId) => {
        if (user.uid !== authorId) {
            alert('Sadece kendi duyurularınızı silebilirsiniz.');
            return;
        }

        if (window.confirm('Bu duyuruyu silmek istediğinizden emin misiniz?')) {
            try {
                await deleteDoc(doc(db, 'announcements', announcementId));
                fetchAnnouncements();
            } catch (error) {
                console.error('Duyuru silinirken hata:', error);
                alert('Duyuru silinirken bir hata oluştu.');
            }
        }
    };

    const formatDate = (date) => {
        if (!date) return '';
        const d = date.toDate ? date.toDate() : new Date(date);
        return d.toLocaleDateString('tr-TR', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="announcements-main">
            <h2 className="announcements-title">📢 Duyurular</h2>

            {canAdd && (
                <div className="announcements-add">
                    <p style={{ marginBottom: '14px', color: '#e11d48', fontWeight: '600' }}>
                        ⚠️ Bu sayfa <strong>demo</strong> görünümündedir. Gerçek veriler içermez.
                    </p>
                    <form onSubmit={handleAddAnnouncement} className="announcements-form">
                        <textarea
                            className="announcements-textarea"
                            value={newAnnouncement}
                            onChange={(e) => setNewAnnouncement(e.target.value)}
                            placeholder="Yeni duyuru yazın..."
                            required
                        />
                        <button
                            type="submit"
                            className="announcements-add-btn"
                            disabled={loading}
                        >
                            {loading ? 'Ekleniyor...' : 'Duyuru Ekle'}
                        </button>
                    </form>
                </div>
            )}

            <div className="announcements-list">
                {announcements.length === 0 ? (
                    <div className="announcements-empty">
                        <p>📭 Henüz duyuru bulunmuyor.</p>
                    </div>
                ) : (
                    announcements.map((announcement) => (
                        <div key={announcement.id} className="announcement-card">
                            <div className="announcement-header">
                                <div className="announcement-title">
                                    👤 {announcement.authorEmail}
                                </div>
                                <div className="announcement-date">
                                    {formatDate(announcement.createdAt)}
                                </div>
                            </div>
                            <div className="announcement-desc">
                                {announcement.text}
                            </div>
                            {canAdd && user && user.uid === announcement.authorId && (
                                <div className="announcement-footer">
                                    <button
                                        className="announcements-delete-btn"
                                        onClick={() => handleDeleteAnnouncement(announcement.id, announcement.authorId)}
                                    >
                                        🗑️ Sil
                                    </button>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}