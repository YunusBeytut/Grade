"use client"
import { motion } from "framer-motion"
import { Eye } from "lucide-react"
import Link from "next/link"
import "../styles/Projects.css"
import { projects } from "@/data/Projects"  // Veri dosyasından import



export function Projects() {

    return (
        <section id="projects" className="projects-section">
            <div className="projects-container">
                <motion.div
                    className="projects-header"
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                >
                    <h2 className="section-title">Projelerim</h2>
                    <p className="section-description">
                        Geliştirdiğim projeler ve kullanılan teknolojiler
                    </p>
                </motion.div>

                <div className="projects-grid">
                    {projects.map((project, index) => (
                        <motion.div
                            key={project.id}
                            className="project-card"
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            whileHover={{ y: -5 }}
                        >
                            <div className="project-image">
                                <img
                                    src={project.image}
                                    alt={project.title}
                                    className="project-main-img"
                                />
                                <div className="project-overlay"></div>
                            </div>

                            <div className="project-content">
                                <h3 className="project-title">{project.title}</h3>
                                <p className="project-description">{project.description}</p>

                                <div className="project-technologies">
                                    {project.technologies.slice(0, 3).map((tech) => (
                                        <span key={tech} className="tech-tag">
                                            {tech}
                                        </span>
                                    ))}
                                    {project.technologies.length > 3 && (
                                        <span className="tech-tag">
                                            +{project.technologies.length - 3}
                                        </span>
                                    )}
                                </div>

                                <Link
                                    href={`/projects/${project.id}`}
                                    className="btn-project"
                                >
                                    <Eye className="w-5 h-5 mr-2" />
                                    Detayları Görüntüle
                                </Link>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}