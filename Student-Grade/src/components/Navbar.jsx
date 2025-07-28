import { useState, useEffect } from "react";
import { Modal, Indicator } from "@mantine/core";
import { db, auth } from "../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import Announcements from "../pages/Announcements";

export default function Navbar({ userRole }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);

  // Duyuruların en güncelini bulmak için (simple state)
  const [latestAnnouncementDate, setLatestAnnouncementDate] = useState(null);

  // Kullanıcının en son ne zaman baktığını tut
  const [lastRead, setLastRead] = useState(null);

  // En güncel duyuru tarihini Announcements.jsx'den prop ile de alabilirsin, burada örnek olarak fetch edelim:
  useEffect(() => {
    const fetchAnnouncements = async () => {
      const res = await fetch("/announcements/latest-timestamp"); // Bunu Firestore ile kendin çekebilirsin
      // veya aşağıdaki gibi Firestore'dan alabilirsin:
      // const snapshot = await getDocs(query(collection(db, "announcements"), orderBy("createdAt", "desc"), limit(1)));
      // if (snapshot.docs.length) setLatestAnnouncementDate(snapshot.docs[0].data().createdAt);

      // Bu satırı hemen aşağıda örnekle açıklayacağım, burada API yoksa onu kaldırabilirsin
    };

    // Kullanıcı bilgisini çek
    const fetchUserLastRead = async () => {
      if (auth.currentUser) {
        const userRef = doc(db, "users", auth.currentUser.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setLastRead(userSnap.data().announcementsLastRead?.toMillis?.());
        }
      }
    };

    fetchUserLastRead();
    // fetchAnnouncements(); // Eğer son duyuru tarihini burada çekmek istersen
  }, [auth.currentUser]);

  // Announcements panelinin yeni bir prop'u olacak: "onAnyAnnouncement"
  // Kullanıcı modalı açtığında "okundu" olarak işaretle
  const handleOpen = async () => {
    setModalOpen(true);
    if (auth.currentUser) {
      const userRef = doc(db, "users", auth.currentUser.uid);
      await updateDoc(userRef, {
        announcementsLastRead: new Date()
      });
      setHasUnread(false);
      setLastRead(Date.now());
    }
  };

  // Okunmamış duyuru kontrolü için:
  useEffect(() => {
    // Duyuruların en yenisinin tarihini al, lastRead ile karşılaştır
    // Mantıksal örnek:
    // setHasUnread(latestAnnouncementDate && (!lastRead || latestAnnouncementDate > lastRead));
  }, [latestAnnouncementDate, lastRead]);

  // Butonun yanında Mantine Indicator ile kırmızı rozet koy
  return (
    <nav className="navbar">
      {/* ...diğer navbar elemanların */}
      <Indicator
        inline
        processing
        disabled={!hasUnread}
        color="red"
        size={10}
        offset={3}
        label=""
      >
        <button
          onClick={handleOpen}
          className="navbar-announcement-btn"
        >
          📢 Duyurular
        </button>
      </Indicator>
      <Modal
        opened={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Duyurular"
        size="lg"
        centered
      >
        <Announcements
          canAdd={userRole === "teacher"}
          // Announcements'a yeni bir prop ekleyerek oradan en güncel duyuru tarihini set edebilirsin
          onLatestDateChange={setLatestAnnouncementDate}
        />
      </Modal>
    </nav>
  );
}