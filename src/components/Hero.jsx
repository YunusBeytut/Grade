"use client"

import { motion } from "framer-motion"
import { Code, Mail, Download } from "lucide-react"
import "../styles/Hero.css";


export function Hero() {
    // HeroSection yerine Hero
    const scrollToSection = (sectionId) => {
        const element = document.getElementById(sectionId)
        if (element) {
            element.scrollIntoView({ behavior: "smooth" })
        }
    }

    return (
        <section id="home" className="hero-section">
            <div className="hero-background">
                <div className="gradient-overlay"></div>
            </div>
            <div className="floating-element floating-1" />
            <div className="floating-element floating-2" />
            <div className="floating-element floating-3" />

            <div className="hero-container">
                <motion.div
                    className="hero-content"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    <motion.h1
                        className="hero-title"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                    >
                        Yunus Beytüt
                    </motion.h1>

                    <motion.p
                        className="hero-subtitle"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                    >
                        Bilgisayar Programcısı & Web Geliştirici
                    </motion.p>

                    <motion.p
                        className="hero-description"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.8 }}
                    >
                        Modern web teknolojileri ile kullanıcı deneyimini ön planda tutan çözümler geliştiriyorum. Frontend ve
                        backend teknolojilerinde uzmanlaşmış, sürekli öğrenmeye açık bir geliştiriciyim.
                    </motion.p>

                    <motion.div
                        className="hero-buttons"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 1 }}
                    >
                        <motion.button
                            onClick={() => scrollToSection("projects")}
                            className="btn-primary"
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Code className="w-5 h-5 mr-2" />
                            Projelerimi İncele
                        </motion.button>

                        <motion.a
                            href="/cv/yunusbeytut_cv.pdf"
                            download="/cv/yunusbeytut_cv.pdf"
                            className="btn-cv"
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Download className="w-5 h-5 mr-2" />
                            CV İndir
                        </motion.a>

                        <motion.button
                            onClick={() => scrollToSection("contact")}
                            className="btn-secondary"
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Mail className="w-5 h-5 mr-2" />
                            İletişime Geç
                        </motion.button>
                    </motion.div>
                </motion.div>

                <motion.div
                    className="hero-visual"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, delay: 0.5 }}
                >
                    <div className="code-window">
                        <div className="code-header">
                            <div className="code-buttons">
                                <span className="code-btn red"></span>
                                <span className="code-btn yellow"></span>
                                <span className="code-btn green"></span>
                            </div>
                            <span className="code-title">portfolio.js</span>
                        </div>
                        <div className="code-content">
                            <motion.div
                                className="code-line"
                                initial={{ width: 0 }}
                                animate={{ width: "100%" }}
                                transition={{ duration: 1, delay: 1.5 }}
                            >
                                <span className="code-keyword">const</span>
                                <span className="code-variable"> developer</span>
                                <span className="code-operator"> = </span>
                                <span className="code-string">"Yunus Beytüt"</span>
                            </motion.div>
                            <motion.div
                                className="code-line"
                                initial={{ width: 0 }}
                                animate={{ width: "100%" }}
                                transition={{ duration: 1, delay: 1.8 }}
                            >
                                <span className="code-keyword">const</span>
                                <span className="code-variable"> skills</span>
                                <span className="code-operator"> = </span>
                                <span className="code-bracket">[</span>
                            </motion.div>
                            <motion.div
                                className="code-line code-indent"
                                initial={{ width: 0 }}
                                animate={{ width: "100%" }}
                                transition={{ duration: 1, delay: 2.1 }}
                            >
                                <span className="code-string">"React"</span>
                                <span className="code-operator">, </span>
                                <span className="code-string">"Node.js"</span>
                                <span className="code-operator">,</span>
                            </motion.div>
                            <motion.div
                                className="code-line code-indent"
                                initial={{ width: 0 }}
                                animate={{ width: "100%" }}
                                transition={{ duration: 1, delay: 2.4 }}
                            >
                                <span className="code-string">"JavaScript"</span>
                                <span className="code-operator">, </span>
                                <span className="code-string">"CSS"</span>
                            </motion.div>
                            <motion.div
                                className="code-line"
                                initial={{ width: 0 }}
                                animate={{ width: "100%" }}
                                transition={{ duration: 1, delay: 2.7 }}
                            >
                                <span className="code-bracket">]</span>
                            </motion.div>
                            <motion.div
                                className="code-line"
                                initial={{ width: 0 }}
                                animate={{ width: "100%" }}
                                transition={{ duration: 1, delay: 3.0 }}
                            >
                                <span className="code-keyword">const</span>
                                <span className="code-variable"> passion</span>
                                <span className="code-operator"> = </span>
                                <span className="code-string">"coding"</span>
                            </motion.div>
                            <motion.div
                                className="code-line"
                                initial={{ width: 0 }}
                                animate={{ width: "100%" }}
                                transition={{ duration: 1, delay: 3.3 }}
                            >
                                <span className="code-comment">// Ready to build amazing projects!</span>
                            </motion.div>
                        </div>
                    </div>
                </motion.div>
            </div>

            <motion.div
                className="scroll-indicator"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 2 }}
            >
                <div className="scroll-mouse">
                    <div className="scroll-wheel"></div>
                </div>
                <span>Aşağı kaydır</span>
            </motion.div>
        </section>
    )
}