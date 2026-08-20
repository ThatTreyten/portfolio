import Navigation from '@/components/Navigation'
import Hero from '@/components/Hero'
import PhotographyVault from '@/components/PhotographyVault'
import CareerTimeline from '@/components/CareerTimeline'
import ContactPanel from '@/components/ContactPanel'

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <div id="hero">
        <Hero />
      </div>
      <div id="about" className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">About Me</h2>
          <p className="text-gray-300 text-lg leading-relaxed">
            I'm a creative professional with expertise in photography, design, and 3D modeling. 
            With years of experience across multiple disciplines, I bring a unique perspective to every project, 
            combining technical skill with artistic vision to create compelling visual experiences.
          </p>
        </div>
      </div>
      <div id="photography">
        <PhotographyVault />
      </div>
      <div id="career">
        <CareerTimeline />
      </div>
      <div id="contact">
        <ContactPanel />
      </div>
      <footer className="py-8 px-4 border-t border-white/10">
        <div className="max-w-7xl mx-auto text-center text-gray-400">
          <p>&copy; 2024 Portfolio. All rights reserved.</p>
        </div>
      </footer>
    </main>
  )
}