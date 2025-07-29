import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { collection, addDoc, getDocs, orderBy, query, deleteDoc, doc } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';

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
            alert('Duyuru eklenirken bir hata oluştu.');
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
        <div style={{
            maxWidth: '800px',
            margin: '0 auto',
            padding: '20px',
            background: '#fff',
            borderRadius: '12px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                marginBottom: '20px',
                borderBottom: '2px solid #e5e7eb',
                paddingBottom: '15px'
            }}>
                <span style={{ fontSize: '1.5rem' }}>📢</span>
                <h2 style={{
                    margin: 0,
                    color: '#374151',
                    fontSize: '1.5rem',
                    fontWeight: '700'
                }}>
                    Duyurular
                </h2>
            </div>

            {canAdd && (
                <form onSubmit={handleAddAnnouncement} style={{ marginBottom: '30px' }}>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                        <textarea
                            value={newAnnouncement}
                            onChange={(e) => setNewAnnouncement(e.target.value)}
                            placeholder="Yeni duyuru yazın..."
                            style={{
                                flex: 1,
                                padding: '12px',
                                border: '2px solid #d1d5db',
                                borderRadius: '8px',
                                fontSize: '1rem',
                                resize: 'vertical',
                                minHeight: '80px',
                                fontFamily: 'inherit'
                            }}
                            required
                        />
                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                padding: '12px 20px',
                                background: loading ? '#9ca3af' : '#3b82f6',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '8px',
                                cursor: loading ? 'not-allowed' : 'pointer',
                                fontWeight: '600',
                                fontSize: '0.95rem',
                                transition: 'background 0.2s'
                            }}
                        >
                            {loading ? 'Ekleniyor...' : 'Duyuru Ekle'}
                        </button>
                    </div>
                </form>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {announcements.length === 0 ? (
                    <div style={{
                        textAlign: 'center',
                        color: '#6b7280',
                        padding: '40px 20px',
                        background: '#f9fafb',
                        borderRadius: '8px',
                        border: '2px dashed #d1d5db'
                    }}>
                        <div style={{ fontSize: '2rem', marginBottom: '10px' }}>📭</div>
                        <p style={{ margin: 0, fontSize: '1.1rem' }}>Henüz duyuru bulunmuyor.</p>
                    </div>
                ) : (
                    announcements.map((announcement) => (
                        <div
                            key={announcement.id}
                            style={{
                                background: '#f8fafc',
                                border: '1px solid #e2e8f0',
                                borderRadius: '8px',
                                padding: '20px',
                                borderLeft: '4px solid #3b82f6',
                                transition: 'transform 0.2s, box-shadow 0.2s'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-2px)';
                                e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = 'none';
                            }}
                        >
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'flex-start',
                                marginBottom: '10px'
                            }}>
                                <div style={{
                                    fontSize: '0.85rem',
                                    color: '#6b7280',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px'
                                }}>
                                    <span>👨‍🏫</span>
                                    <span>{announcement.authorEmail}</span>
                                    <span>•</span>
                                    <span>{formatDate(announcement.createdAt)}</span>
                                </div>
                                {canAdd && user && user.uid === announcement.authorId && (
                                    <button
                                        onClick={() => handleDeleteAnnouncement(announcement.id, announcement.authorId)}
                                        style={{
                                            background: 'none',
                                            border: 'none',
                                            color: '#ef4444',
                                            cursor: 'pointer',
                                            fontSize: '1.2rem',
                                            padding: '4px',
                                            borderRadius: '4px',
                                            transition: 'background 0.2s'
                                        }}
                                        onMouseEnter={(e) => e.target.style.background = '#fee2e2'}
                                        onMouseLeave={(e) => e.target.style.background = 'none'}
                                        title="Duyuruyu sil"
                                    >
                                        🗑️
                                    </button>
                                )}
                            </div>
                            <p style={{
                                margin: 0,
                                lineHeight: '1.6',
                                color: '#374151',
                                fontSize: '1rem',
                                whiteSpace: 'pre-wrap'
                            }}>
                                {announcement.text}
                            </p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}