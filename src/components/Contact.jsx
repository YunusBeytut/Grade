"use client"

import { motion } from "framer-motion"
import { Mail, MapPin, Linkedin, Github, Send } from "lucide-react"
import { useForm } from '@formspree/react';
import "../styles/Contact.css";

export function Contact() {
    const [state, handleSubmit] = useForm("xovllpjd"); // Formspree form ID'nizi buraya yazın

    return (
        <section id="contact" className="contact-section">
            <div className="contact-container">
                <motion.div
                    className="contact-header"
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                >
                    <h2 className="section-title">İletişim</h2>
                    <p className="section-description">
                        Projeleriniz için benimle çalışmak istiyorsanız veya herhangi bir sorunuz varsa, aşağıdaki form aracılığıyla
                        benimle iletişime geçebilirsiniz.
                    </p>
                </motion.div>
                <div className="contact-content">
                    <motion.div
                        className="contact-info"
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        <h3 className="contact-info-title">İletişim Bilgileri</h3>

                        <div className="contact-items">
                            <motion.div className="contact-item" whileHover={{ x: 5 }}>
                                <div className="contact-icon">
                                    <Mail className="w-6 h-6" />
                                </div>
                                <div className="contact-details">
                                    <div className="contact-label">E-posta</div>
                                    <p className="contact-value">yunusbeytut0@gmail.com</p>
                                </div>
                            </motion.div>
                            <motion.div className="contact-item" whileHover={{ x: 5 }}>
                                <div className="contact-icon">
                                    <MapPin className="w-6 h-6" />
                                </div>
                                <div className="contact-details">
                                    <div className="contact-label">Konum</div>
                                    <p className="contact-value">İstanbul, Türkiye</p>
                                </div>
                            </motion.div>
                        </div>

                        <div className="social-links">
                            <h4>Sosyal Medya</h4>
                            <div className="social-icons">
                                <motion.a 
                                    href="https://www.linkedin.com/in/yunusbeytut/" 
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    whileHover={{ y: -3 }} 
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <Linkedin className="w-6 h-6" />
                                </motion.a>
                                <motion.a 
                                    href="https://github.com/YunusBeytut" 
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    whileHover={{ y: -3 }} 
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <Github className="w-6 h-6" />
                                </motion.a>
                            </div>
                        </div>
                        <br />
                        <br />
                        <p className="section-description">
                            Ya da Projeleriniz için benimle çalışmak istiyorsanız veya herhangi bir sorunuz varsa, yandaki form aracılığıyla
                            benimle iletişime geçebilirsiniz.
                        </p>
                    </motion.div>
                    <motion.div
                        className="contact-form-container"
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        <h3 className="contact-form-title">Mesaj Gönder</h3>

                        {state.succeeded ? (
                            <div className="form-success">
                                <h4>Mesajınız başarıyla gönderildi!</h4>
                                <p>En kısa sürede size dönüş yapacağım.</p>
                            </div>
                        ) : (
                            <form className="contact-form" onSubmit={handleSubmit}>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label htmlFor="name">Adınız</label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            placeholder="Adınızı giriniz"
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="email">E-posta</label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            placeholder="E-posta adresinizi giriniz"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="subject">Konu</label>
                                    <input
                                        type="text"
                                        id="subject"
                                        name="subject"
                                        placeholder="Mesaj konusunu giriniz"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="message">Mesajınız</label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        placeholder="Mesajınızı buraya yazınız..."
                                        required
                                    />
                                </div>

                                <motion.button
                                    type="submit"
                                    className="btn-submit"
                                    disabled={state.submitting}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    {state.submitting ? (
                                        <>
                                            <span className="loading-spinner"></span>
                                            Gönderiliyor...
                                        </>
                                    ) : (
                                        <>
                                            <Send className="w-5 h-5" />
                                            Mesajı Gönder
                                        </>
                                    )}
                                </motion.button>
                            </form>
                        )}
                    </motion.div>
                </div>
            </div>
        </section>
    )
}