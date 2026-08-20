'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import PhotoForm from '@/components/PhotoForm'
import TimelineForm from '@/components/TimelineForm'
import { FaTrash, FaEdit } from 'react-icons/fa6'

interface ContactSubmission {
  id: string
  name: string
  email: string
  message: string
  created_at: string
}

interface Photo {
  id: string
  title: string
  description: string
  image_url: string
  category: string
  client?: string
}

interface TimelineItem {
  id: string
  title: string
  company: string
  start_date: string
  end_date?: string
  description: string[]
  current_position: boolean
}

export default function AdminDashboard() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'contacts' | 'photos' | 'timeline'>('contacts')
  const [contactSubmissions, setContactSubmissions] = useState<ContactSubmission[]>([])
  const [photos, setPhotos] = useState<Photo[]>([])
  const [timelineItems, setTimelineItems] = useState<TimelineItem[]>([])
  const [loading, setLoading] = useState(true)
  const [photoFormOpen, setPhotoFormOpen] = useState(false)
  const [timelineFormOpen, setTimelineFormOpen] = useState(false)
  const [editingPhoto, setEditingPhoto] = useState<Photo | undefined>()
  const [editingTimeline, setEditingTimeline] = useState<TimelineItem | undefined>()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [contactsRes, photosRes, timelineRes] = await Promise.all([
        supabase.from('contact_submissions').select('*').order('created_at', { ascending: false }),
        supabase.from('photos').select('*').order('created_at', { ascending: false }),
        supabase.from('career_timeline').select('*').order('start_date', { ascending: false })
      ])

      if (contactsRes.data) setContactSubmissions(contactsRes.data)
      if (photosRes.data) setPhotos(photosRes.data)
      if (timelineRes.data) setTimelineItems(timelineRes.data)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  const handleDeletePhoto = async (id: string) => {
    if (!confirm('Are you sure you want to delete this photo?')) return
    
    try {
      const { error } = await supabase.from('photos').delete().eq('id', id)
      if (error) throw error
      setPhotos(photos.filter(photo => photo.id !== id))
    } catch (error) {
      console.error('Error deleting photo:', error)
    }
  }

  const handleDeleteTimeline = async (id: string) => {
    if (!confirm('Are you sure you want to delete this timeline entry?')) return
    
    try {
      const { error } = await supabase.from('career_timeline').delete().eq('id', id)
      if (error) throw error
      setTimelineItems(timelineItems.filter(item => item.id !== id))
    } catch (error) {
      console.error('Error deleting timeline entry:', error)
    }
  }

  const openPhotoForm = (photo?: Photo) => {
    setEditingPhoto(photo)
    setPhotoFormOpen(true)
  }

  const openTimelineForm = (item?: TimelineItem) => {
    setEditingTimeline(item)
    setTimelineFormOpen(true)
  }

  return (
    <div className="min-h-screen bg-[#0D0D0D]">
      {/* Admin Header */}
      <div className="glass-card m-4 p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
        <button
          onClick={handleLogout}
          className="glass-button px-4 py-2 text-white hover:bg-red-500/20"
        >
          Logout
        </button>
      </div>

      {/* Tabs */}
      <div className="px-4 mb-6">
        <div className="flex gap-2">
          {(['contacts', 'photos', 'timeline'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`glass-button px-6 py-2 text-white capitalize ${
                activeTab === tab ? 'border-amber-500 text-amber-500' : ''
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="px-4 pb-8">
        {loading ? (
          <div className="text-center text-gray-400 py-20">Loading...</div>
        ) : (
          <>
            {activeTab === 'contacts' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-4"
              >
                <h2 className="text-xl font-bold text-white mb-4">Contact Submissions</h2>
                {contactSubmissions.length === 0 ? (
                  <div className="text-gray-400 text-center py-8">No submissions yet</div>
                ) : (
                  contactSubmissions.map((submission) => (
                    <div key={submission.id} className="glass-card p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-white font-semibold">{submission.name}</h3>
                          <p className="text-gray-400 text-sm">{submission.email}</p>
                        </div>
                        <span className="text-gray-500 text-sm">
                          {new Date(submission.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-gray-300">{submission.message}</p>
                    </div>
                  ))
                )}
              </motion.div>
            )}

            {activeTab === 'photos' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-white">Photos</h2>
                  <button 
                    onClick={() => openPhotoForm()}
                    className="glass-button px-4 py-2 text-white hover:bg-amber-500/20"
                  >
                    Add Photo
                  </button>
                </div>
                {photos.length === 0 ? (
                  <div className="text-gray-400 text-center py-8">No photos yet</div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {photos.map((photo) => (
                      <div key={photo.id} className="glass-card overflow-hidden relative group">
                        <img
                          src={photo.image_url}
                          alt={photo.title}
                          className="w-full h-48 object-cover"
                        />
                        <div className="p-4">
                          <h3 className="text-white font-semibold">{photo.title}</h3>
                          <p className="text-gray-400 text-sm">{photo.category}</p>
                          {photo.client && (
                            <p className="text-amber-500 text-sm">{photo.client}</p>
                          )}
                        </div>
                        <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => openPhotoForm(photo)}
                            className="glass-button p-2 text-white hover:bg-amber-500/20"
                          >
                            <FaEdit size={16} />
                          </button>
                          <button
                            onClick={() => handleDeletePhoto(photo.id)}
                            className="glass-button p-2 text-white hover:bg-red-500/20"
                          >
                            <FaTrash size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'timeline' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-white">Career Timeline</h2>
                  <button 
                    onClick={() => openTimelineForm()}
                    className="glass-button px-4 py-2 text-white hover:bg-amber-500/20"
                  >
                    Add Entry
                  </button>
                </div>
                {timelineItems.length === 0 ? (
                  <div className="text-gray-400 text-center py-8">No timeline entries yet</div>
                ) : (
                  <div className="space-y-4">
                    {timelineItems.map((item) => (
                      <div key={item.id} className="glass-card p-6 relative group">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-white font-semibold">{item.title}</h3>
                          <div className="flex items-center gap-2">
                            {item.current_position && (
                              <span className="px-2 py-1 bg-amber-500/20 text-amber-500 text-xs rounded-full">
                                Current
                              </span>
                            )}
                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => openTimelineForm(item)}
                                className="glass-button p-2 text-white hover:bg-amber-500/20"
                              >
                                <FaEdit size={16} />
                              </button>
                              <button
                                onClick={() => handleDeleteTimeline(item.id)}
                                className="glass-button p-2 text-white hover:bg-red-500/20"
                              >
                                <FaTrash size={16} />
                              </button>
                            </div>
                          </div>
                        </div>
                        <p className="text-gray-400 mb-2">{item.company}</p>
                        <p className="text-amber-500 text-sm mb-4">
                          {item.start_date} - {item.end_date || 'Present'}
                        </p>
                        <ul className="space-y-1">
                          {item.description.map((desc, i) => (
                            <li key={i} className="text-gray-300 text-sm">• {desc}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </>
        )}
      </div>

      {/* Forms */}
      <PhotoForm
        isOpen={photoFormOpen}
        onClose={() => {
          setPhotoFormOpen(false)
          setEditingPhoto(undefined)
        }}
        onSuccess={fetchData}
        photo={editingPhoto}
      />

      <TimelineForm
        isOpen={timelineFormOpen}
        onClose={() => {
          setTimelineFormOpen(false)
          setEditingTimeline(undefined)
        }}
        onSuccess={fetchData}
        item={editingTimeline}
      />
    </div>
  )
}