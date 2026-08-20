'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '@/lib/supabase'
import { IoClose } from 'react-icons/io5'

interface PhotoFormProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  photo?: {
    id: string
    title: string
    description: string
    image_url: string
    category: string
    client?: string
  }
}

const categories = ['Portrait', 'Landscape', 'Product', 'Event']

export default function PhotoForm({ isOpen, onClose, onSuccess, photo }: PhotoFormProps) {
  const [formData, setFormData] = useState({
    title: photo?.title || '',
    description: photo?.description || '',
    image_url: photo?.image_url || '',
    category: photo?.category || 'Portrait',
    client: photo?.client || ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      if (photo) {
        // Update existing photo
        const { error } = await supabase
          .from('photos')
          .update({
            title: formData.title,
            description: formData.description,
            image_url: formData.image_url,
            category: formData.category,
            client: formData.client || null
          })
          .eq('id', photo.id)

        if (error) throw error
      } else {
        // Create new photo
        const { error } = await supabase
          .from('photos')
          .insert([{
            title: formData.title,
            description: formData.description,
            image_url: formData.image_url,
            category: formData.category,
            client: formData.client || null
          }])

        if (error) throw error
      }

      onSuccess()
      onClose()
      setFormData({
        title: '',
        description: '',
        image_url: '',
        category: 'Portrait',
        client: ''
      })
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="glass-card p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">
                {photo ? 'Edit Photo' : 'Add New Photo'}
              </h2>
              <button
                onClick={onClose}
                className="text-white hover:text-amber-500 transition-colors"
              >
                <IoClose size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-white font-medium mb-2">
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="glass-input w-full px-4 py-3 text-white placeholder-gray-500"
                  placeholder="Photo title"
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-white font-medium mb-2">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows={3}
                  className="glass-input w-full px-4 py-3 text-white placeholder-gray-500 resize-none"
                  placeholder="Photo description"
                />
              </div>

              <div>
                <label htmlFor="image_url" className="block text-white font-medium mb-2">
                  Image URL
                </label>
                <input
                  type="url"
                  id="image_url"
                  name="image_url"
                  value={formData.image_url}
                  onChange={handleChange}
                  required
                  className="glass-input w-full px-4 py-3 text-white placeholder-gray-500"
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div>
                <label htmlFor="category" className="block text-white font-medium mb-2">
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="glass-input w-full px-4 py-3 text-white"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat} className="bg-gray-900">
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="client" className="block text-white font-medium mb-2">
                  Client (optional)
                </label>
                <input
                  type="text"
                  id="client"
                  name="client"
                  value={formData.client}
                  onChange={handleChange}
                  className="glass-input w-full px-4 py-3 text-white placeholder-gray-500"
                  placeholder="Client name"
                />
              </div>

              {error && (
                <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-sm">
                  {error}
                </div>
              )}

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="glass-button flex-1 py-3 text-white hover:bg-white/10"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="glass-button flex-1 py-3 text-white font-semibold hover:bg-amber-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Saving...' : photo ? 'Update' : 'Add Photo'}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}