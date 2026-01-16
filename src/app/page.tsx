'use client'

import Link from 'next/link'
import { useState } from 'react'

const SERVICES = [
  { name: 'HVAC', icon: '❄️', color: 'from-blue-500 to-cyan-500' },
  { name: 'Plumbing', icon: '🔧', color: 'from-indigo-500 to-blue-500' },
  { name: 'Electrical', icon: '⚡', color: 'from-yellow-500 to-orange-500' },
  { name: 'Roofing', icon: '🏠', color: 'from-purple-500 to-pink-500' },
  { name: 'General', icon: '🛠️', color: 'from-green-500 to-teal-500' },
  { name: 'Gutters', icon: '💧', color: 'from-cyan-500 to-blue-500' },
]

export default function LandingPage() {
  const [selectedService, setSelectedService] = useState<string | null>(null)

  return (
    <div className="min-h-screen bg-gradient-orbzy relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Navbar */}
      <nav className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="glass rounded-2xl px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center text-3xl">
                🏠
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Orbzy</h1>
                <p className="text-xs text-purple-200">Smart Home Maintenance</p>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-6">
              <Link href="#how-it-works" className="text-white/90 hover:text-white transition-colors">
                How It Works
              </Link>
              <Link href="#services" className="text-white/90 hover:text-white transition-colors">
                Services
              </Link>
              <Link href="/auth/login" className="glass-light px-6 py-2 rounded-xl text-white hover:glass-strong transition-all">
                Sign In
              </Link>
              <Link
                href="/auth/signup"
                className="bg-white/20 px-6 py-2 rounded-xl text-white font-semibold hover:bg-white/30 transition-all glow"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 pt-20 pb-32 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-8 inline-block">
            <div className="glass-light px-6 py-2 rounded-full text-purple-200 text-sm font-medium">
              🚀 FREE Private Beta
            </div>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            What needs fixing?
          </h1>

          <p className="text-xl md:text-2xl text-purple-200 mb-12 max-w-3xl mx-auto">
            Select a service and we&apos;ll instantly match you with local providers
          </p>

          {/* Service Selection */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {SERVICES.map((service) => (
              <button
                key={service.name}
                onClick={() => setSelectedService(service.name)}
                className={`glass-light px-8 py-4 rounded-2xl transition-all transform hover:scale-105 hover:glass-strong
                  ${selectedService === service.name ? 'glass-strong glow scale-105' : ''}`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{service.icon}</span>
                  <span className="text-white font-semibold text-lg">{service.name}</span>
                </div>
              </button>
            ))}
          </div>

          {selectedService && (
            <div className="animate-fadeIn">
              <Link
                href="/auth/signup"
                className="inline-flex items-center gap-2 glass-strong px-10 py-5 rounded-2xl text-white text-lg font-bold hover:glow-strong transition-all transform hover:scale-105"
              >
                Find {selectedService} Providers
                <span className="text-2xl">→</span>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section id="how-it-works" className="relative z-10 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-white text-center mb-16">
            How Orbzy Works
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '1',
                title: 'Select Your Service',
                description: 'Choose from HVAC, plumbing, electrical, and more',
                icon: '🎯',
              },
              {
                step: '2',
                title: 'Smart Matching',
                description: 'We help you find providers based on your task category and location',
                icon: '⏰',
              },
              {
                step: '3',
                title: 'Connect & Hire',
                description: "Review provider profiles and contact them directly to schedule service",
                icon: '✅',
              },
            ].map((feature) => (
              <div key={feature.step} className="glass rounded-3xl p-8 hover:glass-light transition-all float">
                <div className="text-6xl mb-4">{feature.icon}</div>
                <div className="inline-block glass-dark px-4 py-1 rounded-full text-purple-300 text-sm font-bold mb-4">
                  Step {feature.step}
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-purple-200 text-lg">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="relative z-10 py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="glass rounded-3xl p-12 text-center">
            <div className="grid md:grid-cols-3 gap-12">
              <div>
                <div className="text-5xl font-bold text-white mb-2">18+</div>
                <div className="text-purple-200">Listed Providers</div>
              </div>
              <div>
                <div className="text-5xl font-bold text-white mb-2">4.8⭐</div>
                <div className="text-purple-200">Avg. Google Rating</div>
              </div>
              <div>
                <div className="text-5xl font-bold text-white mb-2">6</div>
                <div className="text-purple-200">Service Categories</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-32 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="glass-strong rounded-3xl p-12">
            <div className="inline-block glass-light px-4 py-2 rounded-full mb-6">
              <p className="text-purple-200 font-bold text-sm">🎉 FREE PRIVATE BETA</p>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Join Our Private Beta
            </h2>
            <p className="text-xl text-purple-200 mb-10">
              Be among the first to experience fast, reliable home maintenance matching — completely free during beta
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/auth/signup"
                className="glass-light px-10 py-4 rounded-2xl text-white text-lg font-bold hover:glow transition-all transform hover:scale-105"
              >
                Get Started Free
              </Link>
              <Link
                href="/auth/login"
                className="glass px-10 py-4 rounded-2xl text-white text-lg font-semibold hover:glass-light transition-all"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 pb-10 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="glass rounded-2xl p-8 text-center">
            <div className="glass-dark rounded-xl p-4 mb-6 max-w-3xl mx-auto">
              <p className="text-xs text-purple-300 leading-relaxed">
                <strong className="text-purple-200">Disclaimer:</strong> Provider listings sourced from publicly available Google Business Profiles.
                Orbzy is not affiliated with, endorsed by, or partnered with any listed service providers. We do not guarantee
                the quality, availability, or credentials of any provider. Users are responsible for verifying licenses,
                insurance, and references before hiring.
              </p>
            </div>
            <p className="text-purple-200">&copy; 2026 Orbzy. All rights reserved.</p>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </div>
  )
}
