"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Menu } from "lucide-react"
import "../styles/Navbar.css";

export function Navbar() {
    const [activeSection, setActiveSection] = useState("home")
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    const navItems = [
        { href: "#home", label: "Ana Sayfa", id: "home" },
        { href: "#about", label: "Hakkımda", id: "about" },
        { href: "#projects", label: "Projelerim", id: "projects" },
        { href: "#contact", label: "İletişim", id: "contact" },
    ]

    useEffect(() => {
        const handleScroll = () => {
            const sections = ["home", "about", "projects", "contact"]
            const scrollY = window.scrollY

            for (const section of sections) {
                const element = document.getElementById(section)
                if (element) {
                    const { offsetTop, offsetHeight } = element
                    if (scrollY >= offsetTop - 100 && scrollY < offsetTop + offsetHeight - 100) {
                        setActiveSection(section)
                        break
                    }
                }
            }
        }

        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    const scrollToSection = (sectionId) => {
        const element = document.getElementById(sectionId)
        if (element) {
            const offsetTop = element.offsetTop - 80
            window.scrollTo({
                top: offsetTop,
                behavior: "smooth",
            })
        }
        setIsMobileMenuOpen(false)
    }

    return (
        <motion.nav initial={{ y: -100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="navbar">
            <div className="navbar-container">
                <motion.div whileHover={{ scale: 1.05 }} className="navbar-logo" onClick={() => scrollToSection("home")}>
                    YB
                </motion.div>

                {/* Desktop Navigation */}
                <ul className="navbar-menu">
                    {navItems.map((item) => (
                        <motion.li
                            key={item.id}
                            onClick={() => scrollToSection(item.id)}
                            className={activeSection === item.id ? "active" : ""}
                            whileHover={{ y: -2 }}
                            whileTap={{ y: 0 }}
                        >
                            {item.label}
                        </motion.li>
                    ))}
                </ul>

                <motion.button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="mobile-menu-toggle"
                    whileTap={{ scale: 0.95 }}
                >
                    <Menu className="w-6 h-6" />
                </motion.button>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mobile-menu"
                    >
                        <ul>
                            {navItems.map((item) => (
                                <motion.li
                                    key={item.id}
                                    onClick={() => scrollToSection(item.id)}
                                    className={activeSection === item.id ? "active" : ""}
                                    whileHover={{ x: 5 }}
                                >
                                    {item.label}
                                </motion.li>
                            ))}
                        </ul>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    )
}
