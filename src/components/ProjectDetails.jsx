'use client'
import { useState } from 'react'
import { ArrowLeft, Github, ExternalLink, ChevronRight, Code, Image, Maximize2 } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import "../styles/ProjectDetails.css"

export default function ProjectDetails({ project }) {
    const [selectedImage, setSelectedImage] = useState(0)
    const [lightboxOpen, setLightboxOpen] = useState(false)

    const fadeIn = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
    }

    // Tüm resimleri birleştir (ana resim + galeri)
    const allImages = [project.image, ...(project.gallery || [])]

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            className="project-detail-page"
        >
            {/* Lightbox Modal */}
            {lightboxOpen && (
                <div className="lightbox" onClick={() => setLightboxOpen(false)}>
                    <button
                        className="close-btn"
                        onClick={(e) => {
                            e.stopPropagation()
                            setLightboxOpen(false)
                        }}
                    >
                        &times;
                    </button>
                    <div className="lightbox-content" onClick={e => e.stopPropagation()}>
                        <img
                            src={allImages[selectedImage]}
                            alt={`${project.title} - Görsel ${selectedImage + 1}`}
                        />
                        <div className="lightbox-nav">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation()
                                    setSelectedImage(prev => (prev > 0 ? prev - 1 : allImages.length - 1))
                                }}
                            >
                                &lt;
                            </button>
                            <span>{selectedImage + 1} / {allImages.length}</span>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation()
                                    setSelectedImage(prev => (prev < allImages.length - 1 ? prev + 1 : 0))
                                }}
                            >
                                &gt;
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="container">
                <Link href="/#projects" className="back-button">
                    <ArrowLeft size={20} />
                    <span>Projelerime Dön</span>
                </Link>

                {/* Proje Başlığı ve Kısa Bilgi */}
                <header className="project-header">
                    <div className="project-header-content">
                        <h1 className="project-title">{project.title}</h1>
                        <p className="project-subtitle">{project.description}</p>

                        {/* Teknolojiler - Başlıkta */}
                        <div className="project-technologies-header">
                            {project.technologies.map((tech, index) => (
                                <motion.span
                                    key={index}
                                    className="tech-tag-header"
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.3, delay: index * 0.1 }}
                                >
                                    {tech}
                                </motion.span>
                            ))}
                        </div>

                        {/* Action Buttons - Başlıkta */}
                        <div className="project-actions-header">
                            {project.demoLink && (
                                <motion.a
                                    href={project.demoLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="demo-btn"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <ExternalLink size={16} />
                                    Canlı Demo
                                </motion.a>
                            )}
                            {project.githubLink && (
                                <motion.a
                                    href={project.githubLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="github-btn"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <Github size={16} />
                                    Kaynak Kod
                                </motion.a>
                            )}
                        </div>
                    </div>
                </header>

                {/* Ana İçerik - 2 Kolonlu Düzen */}
                <div className="project-main-content">
                    {/* Sol Kolon - Resimler */}
                    <div className="project-media-section">
                        <section className="project-gallery">
                            <div className="gallery-header">
                                <h2 className="gallery-title">
                                    <Image size={20} />
                                    Proje Galerisi
                                </h2>
                                <div className="gallery-counter">
                                    {allImages.length} Görsel
                                </div>
                            </div>

                            <div className="main-image-container">
                                <div className="image-indicator">
                                    {selectedImage + 1} / {allImages.length}
                                </div>
                                <img
                                    src={allImages[selectedImage]}
                                    alt={project.title}
                                    className="main-image"
                                    onClick={() => setLightboxOpen(true)}
                                />
                                <button
                                    className="zoom-btn"
                                    onClick={() => setLightboxOpen(true)}
                                >
                                    <Maximize2 size={18} />
                                </button>
                            </div>

                            {allImages.length > 1 && (
                                <div className="thumbnail-grid">
                                    {allImages.map((img, index) => (
                                        <motion.div
                                            key={index}
                                            className={`thumbnail-container ${selectedImage === index ? 'active' : ''}`}
                                            onClick={() => setSelectedImage(index)}
                                            whileHover={{ scale: 1.05 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <img
                                                src={img}
                                                alt={`${project.title} - Thumbnail ${index + 1}`}
                                                className="thumbnail"
                                            />
                                            <div className="thumbnail-overlay">
                                                <span className="thumbnail-number">{index + 1}</span>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </section>
                    </div>

                    {/* Sağ Kolon - Açıklama ve Özellikler */}
                    <div className="project-content-section">
                        <section className="project-section">
                            <h2 className="content-section-title">
                                <ChevronRight className="icon" />
                                Proje Hakkında
                            </h2>
                            <p className="project-details-text">{project.details}</p>
                        </section>

                        <section className="project-section">
                            <h2 className="content-section-title">
                                <ChevronRight className="icon" />
                                Özellikler
                            </h2>
                            <ul className="features-list">
                                {project.features.map((feature, index) => (
                                    <motion.li
                                        key={index}
                                        initial={{ opacity: 0, x: -20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.5, delay: index * 0.1 }}
                                        viewport={{ once: true }}
                                    >
                                        <span className="feature-icon">✓</span>
                                        {feature}
                                    </motion.li>
                                ))}
                            </ul>
                        </section>

                        {/* Ek Bilgi Kartı */}
                        <div className="project-info-card">
                            <h3>
                                <Code size={18} className="icon" />
                                Geliştirme Süreci
                            </h3>
                            <p>Bu proje modern web teknolojileri kullanılarak geliştirilmiştir. Kullanıcı deneyimi ve performans odaklı yaklaşımla tasarlanmıştır.</p>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}