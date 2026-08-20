'use client'

import { motion } from 'framer-motion'

interface TimelineItem {
  id: string
  title: string
  company: string
  startDate: string
  endDate?: string
  description: string[]
  currentPosition: boolean
}

// Sample data - replace with Supabase data
const timelineData: TimelineItem[] = [
  {
    id: '1',
    title: 'Senior Photographer & Designer',
    company: 'Creative Studio XYZ',
    startDate: '2022',
    endDate: 'Present',
    description: [
      'Lead photography projects for Fortune 500 clients',
      'Designed brand identities for 15+ startups',
      'Mentored junior designers and photographers',
      'Increased client satisfaction by 40%'
    ],
    currentPosition: true
  },
  {
    id: '2',
    title: '3D Modeler & Visual Artist',
    company: 'Digital Arts Agency',
    startDate: '2020',
    endDate: '2022',
    description: [
      'Created 3D assets for advertising campaigns',
      'Developed photorealistic product visualizations',
      'Collaborated with animation team on projects',
      'Optimized 3D workflows reducing render time by 30%'
    ],
    currentPosition: false
  },
  {
    id: '3',
    title: 'Freelance Photographer',
    company: 'Self-Employed',
    startDate: '2018',
    endDate: '2020',
    description: [
      'Built client base of 50+ regular customers',
      'Specialized in portrait and event photography',
      'Managed all aspects of business operations',
      'Delivered 200+ successful projects'
    ],
    currentPosition: false
  },
  {
    id: '4',
    title: 'Junior Designer',
    company: 'Design Agency ABC',
    startDate: '2016',
    endDate: '2018',
    description: [
      'Assisted in creating marketing materials',
      'Learned industry-standard design tools',
      'Contributed to award-winning campaigns',
      'Developed strong foundation in visual design'
    ],
    currentPosition: false
  }
]

export default function CareerTimeline() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-bold text-white mb-12 text-center"
        >
          Career Timeline
        </motion.h2>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-4 md:left-1/2 transform md:-translate-x-1/2 h-full w-0.5 bg-gradient-to-b from-amber-500 to-gray-600" />

          {timelineData.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className={`relative mb-12 md:mb-16 ${
                index % 2 === 0 ? 'md:pr-1/2 md:text-right' : 'md:pl-1/2 md:ml-auto'
              }`}
            >
              {/* Timeline dot */}
              <div className="absolute left-4 md:left-1/2 transform md:-translate-x-1/2 w-4 h-4 rounded-full bg-amber-500 border-4 border-gray-900 z-10" />

              <div className={`glass-card p-6 ml-12 md:ml-0 ${
                index % 2 === 0 ? 'md:mr-8' : 'md:ml-8'
              }`}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-amber-500 font-semibold">
                    {item.startDate} - {item.endDate}
                  </span>
                  {item.currentPosition && (
                    <span className="px-2 py-1 bg-amber-500/20 text-amber-500 text-xs rounded-full">
                      Current
                    </span>
                  )}
                </div>
                
                <h3 className="text-xl font-bold text-white mb-1">{item.title}</h3>
                <p className="text-gray-400 mb-4">{item.company}</p>
                
                <ul className="space-y-2">
                  {item.description.map((desc, i) => (
                    <li key={i} className="text-gray-300 flex items-start gap-2">
                      <span className="text-amber-500 mt-1">•</span>
                      <span>{desc}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}