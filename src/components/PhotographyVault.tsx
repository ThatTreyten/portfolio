'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { IoClose } from 'react-icons/io5'

interface Photo {
  id: string
  title: string
  description: string
  image_url: string
  category: string
  client?: string
}

const categories = ['All', 'Portrait', 'Landscape', 'Product', 'Event']

// Sample data - replace with Supabase data
const samplePhotos: Photo[] = [
  {
    id: '1',
    title: 'Mountain Sunrise',
    description: 'Golden hour capture of mountain peaks',
    image_url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
    category: 'Landscape',
    client: 'Nature Magazine'
  },
  {
    id: '2',
    title: 'Corporate Headshot',
    description: 'Professional executive portrait',
    image_url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800',
    category: 'Portrait',
    client: 'Tech Corp'
  },
  {
    id: '3',
    title: 'Product Launch',
    description: 'New product photography for campaign',
    image_url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800',
    category: 'Product',
    client: 'Startup XYZ'
  },
  {
    id: '4',
    title: 'Wedding Ceremony',
    description: 'Candid moments from special day',
    image_url: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800',
    category: 'Event',
    client: 'Private Client'
  },
  {
    id: '5',
    title: 'Urban Architecture',
    description: 'Modern cityscape photography',
    image_url: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800',
    category: 'Landscape',
    client: 'Architecture Weekly'
  },
  {
    id: '6',
    title: 'Studio Portrait',
    description: 'Creative lighting setup',
    image_url: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800',
    category: 'Portrait',
    client: 'Fashion Brand'
  }
]

export default function PhotographyVault() {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null)

  const filteredPhotos = selectedCategory === 'All' 
    ? samplePhotos 
    : samplePhotos.filter(photo => photo.category === selectedCategory)

  return (
    <section className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-bold text-white mb-8 text-center"
        >
          Photography Vault
        </motion.h2>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`glass-button px-6 py-2 text-white font-medium ${
                selectedCategory === category 
                  ? 'border-amber-500 text-amber-500' 
                  : 'border-white/12'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Photo Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPhotos.map((photo, index) => (
            <motion.div
              key={photo.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="glass-card overflow-hidden cursor-pointer group"
              onClick={() => setSelectedPhoto(photo)}
            >
              <div className="relative aspect-square">
                <img
                  src={photo.image_url}
                  alt={photo.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <span className="text-white font-medium">View</span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-white font-semibold mb-1">{photo.title}</h3>
                <p className="text-gray-400 text-sm">{photo.category}</p>
                {photo.client && (
                  <p className="text-amber-500 text-sm mt-1">{photo.client}</p>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Lightbox */}
        <AnimatePresence>
          {selectedPhoto && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
              onClick={() => setSelectedPhoto(null)}
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                className="relative max-w-4xl w-full"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => setSelectedPhoto(null)}
                  className="absolute -top-12 right-0 text-white hover:text-amber-500 transition-colors"
                >
                  <IoClose size={32} />
                </button>
                <img
                  src={selectedPhoto.image_url}
                  alt={selectedPhoto.title}
                  className="w-full h-auto rounded-lg"
                />
                <div className="mt-4">
                  <h3 className="text-2xl font-bold text-white mb-2">{selectedPhoto.title}</h3>
                  <p className="text-gray-300 mb-2">{selectedPhoto.description}</p>
                  <div className="flex gap-4 text-sm">
                    <span className="text-amber-500">{selectedPhoto.category}</span>
                    {selectedPhoto.client && (
                      <span className="text-gray-400">Client: {selectedPhoto.client}</span>
                    )}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}