import React, { useEffect, useState } from "react";
import { db, auth } from "../firebase";
import {
    collection,
    query,
    where,
    orderBy,
    getDocs,
    addDoc,
    serverTimestamp,
    doc,
    getDoc
} from "firebase/firestore";
import "./MessagesPanel.css";

export default function MessagesPanel({ open, onClose }) {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMsg, setNewMsg] = useState("");
    const [loading, setLoading] = useState(false);

    // Mevcut kullanıcı
    const currentUser = auth.currentUser;

    // Kullanıcı listesini çek (kendini hariç tut)
    useEffect(() => {
        if (!open) return;
        const fetchUsers = async () => {
            const q = query(collection(db, "users"));
            const snap = await getDocs(q);
            setUsers(
                snap.docs
                    .map((docu) => ({ id: docu.id, ...docu.data() }))
                    .filter((u) => u.id !== currentUser.uid)
            );
        };
        fetchUsers();
    }, [open, currentUser]);

    // Seçili kullanıcı ile mesajları çek
    useEffect(() => {
        if (!selectedUser) {
            setMessages([]);
            return;
        }
        const fetchMessages = async () => {
            setLoading(true);
            // Mesajlar için ortak bir id: iki uid’yi sıralayıp birleştir
            const [a, b] = [currentUser.uid, selectedUser.id].sort();
            const chatId = `${a}_${b}`;
            const msgsRef = collection(db, "messages", chatId, "items");
            const q = query(msgsRef, orderBy("createdAt", "asc"));
            const snap = await getDocs(q);
            setMessages(
                snap.docs.map((d) => ({
                    id: d.id,
                    ...d.data(),
                }))
            );
            setLoading(false);
        };
        fetchMessages();
        // Otomatik scroll için ekle
    }, [selectedUser, currentUser.uid]);

    // Mesaj gönder
    const sendMessage = async (e) => {
        e.preventDefault();
        if (!newMsg.trim() || !selectedUser) return;
        const [a, b] = [currentUser.uid, selectedUser.id].sort();
        const chatId = `${a}_${b}`;
        const msgsRef = collection(db, "messages", chatId, "items");
        await addDoc(msgsRef, {
            text: newMsg,
            from: currentUser.uid,
            to: selectedUser.id,
            createdAt: serverTimestamp(),
            read: false,
        });
        setNewMsg("");
        // Mesaj listesini yenile
        const q = query(msgsRef, orderBy("createdAt", "asc"));
        const snap = await getDocs(q);
        setMessages(
            snap.docs.map((d) => ({
                id: d.id,
                ...d.data(),
            }))
        );
    };

    // Panel kapatıldığında state temizle
    useEffect(() => {
        if (!open) {
            setSelectedUser(null);
            setMessages([]);
        }
    }, [open]);

    return (
        <div className={`messages-panel-overlay${open ? " open" : ""}`}>
            <div className="messages-panel">
                <div className="messages-panel-header">
                    <span>Mesajlarım</span>
                    <button className="close-btn" onClick={onClose}>✖</button>
                </div>
                <div className="messages-panel-body">
                    {/* Kullanıcı listesi */}
                    <div className="messages-user-list">
                        <h4>Kişiler</h4>
                        {users.map((u) => (
                            <div
                                key={u.id}
                                className={`user-list-item${selectedUser?.id === u.id ? " selected" : ""}`}
                                onClick={() => setSelectedUser(u)}
                            >
                                <span className="avatar">{u.username?.[0]?.toUpperCase() || u.email?.[0]?.toUpperCase() || "?"}</span>
                                <span className="user-name">{u.username || u.email}</span>
                            </div>
                        ))}
                        {users.length === 0 && (
                            <div className="no-users">Hiç kullanıcı yok.</div>
                        )}
                    </div>
                    {/* Sohbet */}
                    <div className="messages-chat-area">
                        {selectedUser ? (
                            <div className="chat-area-inner">
                                <div className="chat-header">
                                    <b>{selectedUser.username || selectedUser.email}</b>
                                </div>
                                <div className="chat-messages" id="chat-messages">
                                    {loading ? (
                                        <div className="loading">Yükleniyor...</div>
                                    ) : messages.length === 0 ? (
                                        <div className="no-messages">Henüz mesaj yok.</div>
                                    ) : (
                                        messages.map((msg) => (
                                            <div
                                                key={msg.id}
                                                className={`chat-msg${msg.from === currentUser.uid ? " mine" : " theirs"}`}
                                            >
                                                <span>{msg.text}</span>
                                                <span className="time">
                                                    {msg.createdAt?.toDate?.().toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" }) || ""}
                                                </span>
                                            </div>
                                        ))
                                    )}
                                </div>
                                <form className="chat-input-row" onSubmit={sendMessage}>
                                    <input
                                        type="text"
                                        placeholder="Mesajınızı yazın..."
                                        value={newMsg}
                                        onChange={e => setNewMsg(e.target.value)}
                                        className="chat-input"
                                    />
                                    <button type="submit" className="send-btn" disabled={!newMsg.trim()}>Gönder</button>
                                </form>
                            </div>
                        ) : (
                            <div className="select-user-hint">Bir kullanıcı seçin…</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}