"use client"
import { motion } from "framer-motion"
import { Mail, Phone, MapPin, Linkedin, Github, Twitter, Instagram, ArrowUp } from "lucide-react"
import "../styles/Footer.css";

export function Footer() {
    const currentYear = new Date().getFullYear()
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        })
    }
    return (
        <footer className="footer">
            <div className="footer-container">
                <motion.div
                    className="footer-content"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                >
                    <div className="footer-section">
                        <motion.div className="footer-logo" whileHover={{ scale: 1.05 }}>
                            Yunus Beytut
                        </motion.div>
                        <p className="footer-description">
                            Modern web teknolojileri ile kullanıcı deneyimini ön planda tutan çözümler geliştiren bir yazılım
                            geliştirici.
                        </p>
                    </div>
                    <div className="footer-section">
                        <h4 className="footer-title">Hızlı Linkler</h4>
                        <ul className="footer-links">
                            <motion.li whileHover={{ x: 5 }}>
                                <a href="#home">Ana Sayfa</a>
                            </motion.li>
                            <motion.li whileHover={{ x: 5 }}>
                                <a href="#about">Hakkımda</a>
                            </motion.li>
                            <motion.li whileHover={{ x: 5 }}>
                                <a href="#projects">Projeler</a>
                            </motion.li>
                            <motion.li whileHover={{ x: 5 }}>
                                <a href="#contact">İletişim</a>
                            </motion.li>
                        </ul>
                    </div>
                    <div className="footer-section">
                        <h4 className="footer-title">İletişim</h4>
                        <div className="footer-contact">
                            <p className="contact-info-item">
                                <Mail className="w-4 h-4" />
                                yunus@example.com
                            </p>
                            <p className="contact-info-item">
                                <Phone className="w-4 h-4" />
                                {"+90 555 123 4567"}
                            </p>
                            <p className="contact-info-item">
                                <MapPin className="w-4 h-4" />
                                İstanbul, Türkiye
                            </p>
                        </div>
                    </div>
                    <div className="footer-section">
                        <h4 className="footer-title">Sosyal Medya</h4>
                        <div className="footer-social">
                            <motion.a href="#" className="social-link" whileHover={{ y: -3, scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                                <Linkedin className="w-6 h-6" />
                            </motion.a>
                            <motion.a href="#" className="social-link" whileHover={{ y: -3, scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                                <Github className="w-6 h-6" />
                            </motion.a>
                            <motion.a href="#" className="social-link" whileHover={{ y: -3, scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                                <Twitter className="w-6 h-6" />
                            </motion.a>
                            <motion.a href="#" className="social-link" whileHover={{ y: -3, scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                                <Instagram className="w-6 h-6" />
                            </motion.a>
                        </div>
                    </div>
                </motion.div>
                <motion.div
                    className="footer-bottom"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    viewport={{ once: true }}
                >
                    <div className="footer-bottom-content">
                        <p className="copyright">© {currentYear} Yunus Beytüt. Tüm hakları saklıdır.</p>
                        <motion.button
                            onClick={scrollToTop}
                            className="scroll-top"
                            whileHover={{ scale: 1.1, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <ArrowUp className="w-5 h-5" />
                        </motion.button>
                    </div>
                </motion.div>
            </div>
        </footer>
    )
}
