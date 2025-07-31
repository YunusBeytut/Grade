// data/Projects.js
export const projects = [
    {
        id: 1,
        title: "Not Takip App",
        description: "Öğrenci ve öğretmenler için gelişmiş not takip platformu",
        image: "/projects/proje1anasayfa.png",
        gallery: [
            "/projects/proje1giris.png",
            "/projects/proje1kayıt.png",
            "/projects/proje1student.png",
            "/projects/proje1mesaj.png",
            "/projects/proje1duyuru.png",
            "/projects/proje1notekleme.png",
            "/projects/proje1istatistik.png"

        ],
        technologies: ["React", "Firebase", "Modern CSS"],
        features: [
            "Öğretmen ve Öğrenci olarak kayıt olabilme ve giriş yapabilme",
            "Gerçek zamanlı not güncelleme ve takip",
            "Öğrenci performans analizi",
            "Duyuru gönderme ve okuma",
            "Eş zamanlı karılıklı mesajlaşma",
            "Notlar hakkında istatistikler"

        ],
        details: "Bu projede modern eğitim teknolojilerini kullanarak kullanıcı dostu bir not takip sistemi geliştirdim. Sistem, öğretmenlerin not girişi yapabildiği ve öğrencilerin notlarını takip edebildiği kapsamlı bir platform sunuyor ve ayrıca mesajlaşabilme ve öğretmenlerin öğrencilere duyuru gönderebildiği bir sistem.",
        demoLink: "https://gradetrackerdemo.netlify.app/auth",
        githubLink: "https://github.com/YunusBeytut/Grade"
    },
    {
        id: 2,
        title: "Quiz App",
        description: " Kullanıcı dostu arayüzüyle tam responsive soru çözme deneyimi 🚀",
        image: "/projects/quizstart.png",
        gallery: [
            "/projects/soru.png",
            "/projects/sonuc.png",
        ],
        technologies: ["LocaStorage", "CSS", "JavaScript"],
        features: [
            "LocalStorage ile puanları kaydetme",
            "Sayaç özelliği ile zamana karşı yarış",
            "Responsive tasarım",
            "Kategori bazlı sorular"
        ],
        details: "Modern bir quiz deneyimi sunan bu projede React ve Modern CSS kullanarak kullanıcı dostu bir arayüz geliştirdim. Uygulama, farklı kategorilerde sorular içeriyor ve kullanıcıların bilgi seviyelerini test etmelerini sağlıyor.",
        demoLink: "https://yunus-beytut-quiz-app.netlify.app/",
        githubLink: "https://github.com/YunusBeytut/Jedi/tree/main/QuizApp"
    },
    {
        id: 3,
        title: "Kişisel Website",
        description: "Next.js ile geliştirdiğim, kendi projelerimi sergilediğim modern portfolyo sitesi",
        image: "/projects/proje3anasayfa.png",
        gallery: [
            "/projects/proje3about.png",
            "/projects/proje3contact.png",
        ],
        technologies: ["Next.js", "Modern CSS", "React"],
        features: [
            "Projelerin detaylı gösterimi",
            "Profesyonel Görünüm",
            "Responsive tasarım",
            "İletişim formu entegrasyonu"
        ],
        details: "React ve Next.js ile dinamik kullanıcı dostu kişisel portföy sitesi. Projeleri sergileyebilir, iletişim entegrasyonu ve hakkımda kısmı ile kendinizi daha iyi tanıtabilirsiniz",
        githubLink: "https://github.com/YunusBeytut/Jedi/tree/main/portfolio%20website"
    }

];