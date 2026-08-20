'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '@/lib/supabase'
import { IoClose } from 'react-icons/io5'

interface TimelineFormProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  item?: {
    id: string
    title: string
    company: string
    start_date: string
    end_date?: string
    description: string[]
    current_position: boolean
  }
}

export default function TimelineForm({ isOpen, onClose, onSuccess, item }: TimelineFormProps) {
  const [formData, setFormData] = useState({
    title: item?.title || '',
    company: item?.company || '',
    start_date: item?.start_date || '',
    end_date: item?.end_date || '',
    description: item?.description?.join('\n') || '',
    current_position: item?.current_position || false
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const descriptionArray = formData.description
        .split('\n')
        .filter(line => line.trim() !== '')

      if (item) {
        // Update existing timeline item
        const { error } = await supabase
          .from('career_timeline')
          .update({
            title: formData.title,
            company: formData.company,
            start_date: formData.start_date,
            end_date: formData.end_date || null,
            description: descriptionArray,
            current_position: formData.current_position
          })
          .eq('id', item.id)

        if (error) throw error
      } else {
        // Create new timeline item
        const { error } = await supabase
          .from('career_timeline')
          .insert([{
            title: formData.title,
            company: formData.company,
            start_date: formData.start_date,
            end_date: formData.end_date || null,
            description: descriptionArray,
            current_position: formData.current_position
          }])

        if (error) throw error
      }

      onSuccess()
      onClose()
      setFormData({
        title: '',
        company: '',
        start_date: '',
        end_date: '',
        description: '',
        current_position: false
      })
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const target = e.target as HTMLInputElement
    const { name, value, type, checked } = target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
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
                {item ? 'Edit Timeline Entry' : 'Add Timeline Entry'}
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
                  Job Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="glass-input w-full px-4 py-3 text-white placeholder-gray-500"
                  placeholder="Senior Photographer"
                />
              </div>

              <div>
                <label htmlFor="company" className="block text-white font-medium mb-2">
                  Company
                </label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  required
                  className="glass-input w-full px-4 py-3 text-white placeholder-gray-500"
                  placeholder="Company Name"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="start_date" className="block text-white font-medium mb-2">
                    Start Date
                  </label>
                  <input
                    type="text"
                    id="start_date"
                    name="start_date"
                    value={formData.start_date}
                    onChange={handleChange}
                    required
                    className="glass-input w-full px-4 py-3 text-white placeholder-gray-500"
                    placeholder="2020"
                  />
                </div>
                <div>
                  <label htmlFor="end_date" className="block text-white font-medium mb-2">
                    End Date
                  </label>
                  <input
                    type="text"
                    id="end_date"
                    name="end_date"
                    value={formData.end_date}
                    onChange={handleChange}
                    disabled={formData.current_position}
                    className="glass-input w-full px-4 py-3 text-white placeholder-gray-500 disabled:opacity-50"
                    placeholder="2022"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="current_position"
                  name="current_position"
                  checked={formData.current_position}
                  onChange={handleChange}
                  className="w-4 h-4 accent-amber-500"
                />
                <label htmlFor="current_position" className="text-white">
                  Current Position
                </label>
              </div>

              <div>
                <label htmlFor="description" className="block text-white font-medium mb-2">
                  Description (one bullet point per line)
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="glass-input w-full px-4 py-3 text-white placeholder-gray-500 resize-none"
                  placeholder="• Led photography projects&#10;• Designed brand identities&#10;• Mentored team members"
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
                  {loading ? 'Saving...' : item ? 'Update' : 'Add Entry'}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}