'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'glass-card mx-4 mt-4 rounded-2xl' : ''
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="text-white font-bold text-xl cursor-pointer"
          onClick={() => scrollToSection('hero')}
        >
          Portfolio
        </motion.div>

        <div className="flex gap-6">
          {['About', 'Photography', 'Career', 'Contact'].map((item) => (
            <motion.button
              key={item}
              whileHover={{ scale: 1.05 }}
              onClick={() => scrollToSection(item.toLowerCase())}
              className="text-gray-300 hover:text-amber-500 transition-colors font-medium"
            >
              {item}
            </motion.button>
          ))}
        </div>
      </div>
    </motion.nav>
  )
}