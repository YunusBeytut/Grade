"use client"
import { motion } from "framer-motion"
import {
    User,
    Calendar,
    GraduationCap,
    Briefcase,
    Code,
    Atom,
    Server,
    FileCode,
    Terminal,
    Database,
    GitFork,
} from "lucide-react"
import "../styles/About.css";

export function About() {
    const skills = [
        { name: "HTML & CSS", level: 90, icon: Atom, color: "blue" },
        { name: "React & JavaScript", level: 75, icon: Server, color: "yellow" },
        { name: "Git & GitHub", level: 75, icon: FileCode, color: "cyan" },
        { name: "FireBase", level: 80, icon: Terminal, color: "purple" },
        { name: "Power Automate Desktop", level: 65, icon: Database, color: "blue" },
        { name: "Database (SQL)", level: 78, icon: GitFork, color: "yellow" },
    ]

    return (
        <section id="about" className="about-section">
            <div className="about-container">
                <motion.div
                    className="about-header"
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                >
                    <h2 className="section-title">Hakkımda</h2>
                    <p className="section-description">
                        Bilgisayar programcılığı alanında eğitim almış, teknoloji tutkunu bir geliştiriciyim. Modern web
                        teknolojileri ile kullanıcı dostu uygulamalar geliştirmeyi seviyorum.
                    </p>
                </motion.div>
                <div className="about-content">
                    <motion.div
                        className="about-info"
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        <div className="about-card">
                            <div className="about-details">
                                <h3>Kişisel Bilgiler</h3>

                                <div className="detail-item">
                                    <User className="w-6 h-6 text-primary" />
                                    <div>
                                        <strong>Ad Soyad:</strong>
                                        <span>Yunus Beytüt </span>
                                    </div>
                                </div>

                                <div className="detail-item">
                                    <Calendar className="w-6 h-6 text-primary" />
                                    <div>
                                        <strong>Yaş:</strong>
                                        <span>21</span>
                                    </div>
                                </div>

                                <div className="detail-item">
                                    <GraduationCap className="w-6 h-6 text-primary" />
                                    <div>
                                        <strong>Eğitim:</strong>
                                        <span> Ataşehir Adıgüzel Meslek Yüksek Okulu Bilgisayar Programcılığı Mezunu</span>
                                    </div>
                                </div>

                                <div className="detail-item">
                                    <Briefcase className="w-6 h-6 text-primary" />
                                    <div>
                                        <strong>Deneyim:</strong>
                                        <span>Kora Analitik - Staj</span>
                                    </div>
                                </div>

                                <div className="detail-item">
                                    <Code className="w-6 h-6 text-primary" />
                                    <div>
                                        <strong>Uzmanlık:</strong>
                                        <span>Frontend Web Development</span>
                                    </div>
                                </div>
                                <div className="detail-item">
                                    <Code className="w-6 h-6 text-primary" />
                                    <div>
                                        <strong>Beceriler:</strong>
                                        <span>HTML, CSS, Javascript, React, Power Automate Desktop </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                    <motion.div
                        className="skills-container"
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        <h3 className="skills-title">Teknik Yetenekler</h3>
                        <div className="skills-grid">
                            {skills.map((skill, index) => (
                                <motion.div
                                    key={skill.name}
                                    className="skill-item"
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    viewport={{ once: true }}
                                >
                                    <div className="skill-header">
                                        <div className="skill-info">
                                            <skill.icon className="w-5 h-5 mr-2" />
                                            <span className="skill-name">{skill.name}</span>
                                        </div>
                                        <span className={`skill-percentage ${skill.color}`}>{skill.level}%</span>
                                    </div>
                                    <div className="skill-bar-container">
                                        <motion.div
                                            className={`skill-bar ${skill.color}`}
                                            initial={{ width: 0 }}
                                            whileInView={{ width: `${skill.level}%` }}
                                            transition={{ duration: 1.5, delay: index * 0.1 + 0.5 }}
                                            viewport={{ once: true }}
                                        />
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}
