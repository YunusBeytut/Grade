import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { collection, addDoc, getDocs, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';

export default function MessagesPanel({ open, onClose }) {
    const [user] = useAuthState(auth);
    const [messages, setMessages] = useState([]);
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState('');
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (open && user) {
            fetchUsers();
            fetchMessages();
        }
    }, [open, user]);

    const fetchUsers = async () => {
        try {
            const usersSnapshot = await getDocs(collection(db, 'users'));
            const usersData = [];
            usersSnapshot.forEach((doc) => {
                const userData = doc.data();
                if (doc.id !== user.uid) { // Kendisi hariç
                    usersData.push({
                        id: doc.id,
                        name: userData.username || userData.email?.split('@')[0] || 'Kullanıcı',
                        email: userData.email,
                        role: userData.role
                    });
                }
            });
            setUsers(usersData);
        } catch (error) {
            console.error('Kullanıcılar yüklenirken hata:', error);
        }
    };

    const fetchMessages = () => {
        if (!user) return;

        const q = query(
            collection(db, 'messages'),
            where('participants', 'array-contains', user.uid),
            orderBy('createdAt', 'desc')
        );

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const messagesData = [];
            querySnapshot.forEach((doc) => {
                messagesData.push({ id: doc.id, ...doc.data() });
            });
            setMessages(messagesData);
        });

        return unsubscribe;
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedUser) return;

        setLoading(true);
        try {
            await addDoc(collection(db, 'messages'), {
                text: newMessage.trim(),
                senderId: user.uid,
                senderEmail: user.email,
                receiverId: selectedUser,
                participants: [user.uid, selectedUser],
                createdAt: new Date(),
                read: false
            });
            setNewMessage('');
        } catch (error) {
            console.error('Mesaj gönderilirken hata:', error);
            alert('Mesaj gönderilirken bir hata oluştu.');
        }
        setLoading(false);
    };

    const formatDate = (date) => {
        if (!date) return '';
        const d = date.toDate ? date.toDate() : new Date(date);
        return d.toLocaleDateString('tr-TR', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getOtherUser = (message) => {
        return message.senderId === user.uid
            ? users.find(u => u.id === message.receiverId)
            : users.find(u => u.id === message.senderId);
    };

    if (!open) return null;

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px'
        }}>
            <div style={{
                background: '#fff',
                borderRadius: '12px',
                width: '100%',
                maxWidth: '600px',
                maxHeight: '80vh',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)'
            }}>
                {/* Header */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '20px',
                    borderBottom: '1px solid #e5e7eb',
                    background: '#f8fafc',
                    borderRadius: '12px 12px 0 0'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontSize: '1.5rem' }}>💬</span>
                        <h3 style={{ margin: 0, color: '#374151', fontSize: '1.3rem', fontWeight: '700' }}>
                            Mesajlarım
                        </h3>
                    </div>
                    <button
                        onClick={onClose}
                        style={{
                            background: 'none',
                            border: 'none',
                            fontSize: '1.5rem',
                            cursor: 'pointer',
                            color: '#6b7280',
                            padding: '5px',
                            borderRadius: '6px',
                            transition: 'background 0.2s'
                        }}
                        onMouseEnter={(e) => e.target.style.background = '#e5e7eb'}
                        onMouseLeave={(e) => e.target.style.background = 'none'}
                    >
                        ✖️
                    </button>
                </div>

                {/* Message Form */}
                <div style={{ padding: '20px', borderBottom: '1px solid #e5e7eb' }}>
                    <form onSubmit={handleSendMessage}>
                        <div style={{ marginBottom: '15px' }}>
                            <label style={{
                                display: 'block',
                                marginBottom: '8px',
                                fontWeight: '600',
                                color: '#374151',
                                fontSize: '0.95rem'
                            }}>
                                Kime:
                            </label>
                            <select
                                value={selectedUser}
                                onChange={(e) => setSelectedUser(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '10px',
                                    border: '2px solid #d1d5db',
                                    borderRadius: '8px',
                                    fontSize: '1rem',
                                    background: '#fff'
                                }}
                                required
                            >
                                <option value="">Kullanıcı seçin...</option>
                                {users.map((u) => (
                                    <option key={u.id} value={u.id}>
                                        {u.role === 'teacher' ? '👨‍🏫' : '🎓'} {u.name} ({u.email})
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <textarea
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder="Mesajınızı yazın..."
                                style={{
                                    flex: 1,
                                    padding: '12px',
                                    border: '2px solid #d1d5db',
                                    borderRadius: '8px',
                                    fontSize: '1rem',
                                    resize: 'vertical',
                                    minHeight: '60px',
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
                                    whiteSpace: 'nowrap'
                                }}
                            >
                                {loading ? 'Gönderiliyor...' : 'Gönder'}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Messages List */}
                <div style={{
                    flex: 1,
                    overflow: 'auto',
                    padding: '20px',
                    maxHeight: '400px'
                }}>
                    {messages.length === 0 ? (
                        <div style={{
                            textAlign: 'center',
                            color: '#6b7280',
                            padding: '40px 20px'
                        }}>
                            <div style={{ fontSize: '2rem', marginBottom: '10px' }}>📭</div>
                            <p style={{ margin: 0, fontSize: '1.1rem' }}>Henüz mesaj bulunmuyor.</p>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {messages.map((message) => {
                                const otherUser = getOtherUser(message);
                                const isSent = message.senderId === user.uid;

                                return (
                                    <div
                                        key={message.id}
                                        style={{
                                            background: isSent ? '#dbeafe' : '#f3f4f6',
                                            border: `1px solid ${isSent ? '#93c5fd' : '#d1d5db'}`,
                                            borderRadius: '8px',
                                            padding: '15px',
                                            borderLeft: `4px solid ${isSent ? '#3b82f6' : '#6b7280'}`
                                        }}
                                    >
                                        <div style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            marginBottom: '8px'
                                        }}>
                                            <div style={{
                                                fontSize: '0.85rem',
                                                color: '#6b7280',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '8px'
                                            }}>
                                                <span>{isSent ? '➡️' : '⬅️'}</span>
                                                <span>
                                                    {isSent ? 'Size' : otherUser?.name || 'Bilinmeyen Kullanıcı'}
                                                </span>
                                                <span>•</span>
                                                <span>{formatDate(message.createdAt)}</span>
                                            </div>
                                        </div>
                                        <p style={{
                                            margin: 0,
                                            lineHeight: '1.5',
                                            color: '#374151',
                                            whiteSpace: 'pre-wrap'
                                        }}>
                                            {message.text}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}