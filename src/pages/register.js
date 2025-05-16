import { useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { useEffect } from 'react'

const ParticlesBackground = dynamic(
  () => {
    return Promise.resolve(() => {
      useEffect(() => {
        const initializeParticles = (attempt = 1, maxAttempts = 5) => {
          if (typeof window !== 'undefined' && window.particlesJS) {
            window.particlesJS('particles-js', {
              particles: {
                number: { 
                  value: 400,
                  density: { enable: true, value_area: 1000 }
                },
                color: { value: ['#e6e6fa', '#b0c4de', '#f0e68c', '#ffffff'] },
                shape: {
                  type: 'circle',
                  stroke: { width: 0, color: '#000000' },
                },
                opacity: {
                  value: 0.9,
                  random: true,
                  anim: {
                    enable: true,
                    speed: 0.5,
                    opacity_min: 0.2,
                    sync: false
                  },
                },
                size: {
                  value: 1.8,
                  random: true,
                  anim: {
                    enable: true,
                    speed: 1.5,
                    size_min: 0.3,
                    sync: false
                  },
                },
                line_linked: { 
                  enable: false
                },
                move: {
                  enable: true,
                  speed: 0.5,
                  direction: 'none',
                  random: true,
                  straight: false,
                  out_mode: 'out',
                  bounce: false,
                },
              },
              interactivity: {
                detect_on: 'canvas',
                events: {
                  onhover: { enable: false },
                  onclick: { enable: false },
                  resize: true,
                },
              },
              retina_detect: true,
            });
          } else if (attempt <= maxAttempts) {
            setTimeout(() => initializeParticles(attempt + 1, maxAttempts), 500);
          }
        };

        initializeParticles();
      }, []);

      return (
        <div 
          id="particles-js" 
          className="absolute inset-0 z-0 opacity-60"
          style={{
            background: 'radial-gradient(circle at center, #0a0a23 0%, #000000 100%)'
          }}
        />
      );
    });
  },
  { ssr: false }
);

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [message, setMessage] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    const data = await res.json()
    setMessage(data.message || data.error)
  }

  return (
    <>
      <Head>
        <title>Register | Task Manager</title>
        <meta name="theme-color" content="#0a0a23" />
        <script src="https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js" async />
      </Head>
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a23] px-4 overflow-hidden relative">
        <ParticlesBackground />
        
        {/* Glowing orb decoration */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-[#e6e6fa] opacity-10 blur-[80px] animate-float"></div>
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full bg-[#b0c4de] opacity-10 blur-[80px] animate-float-delay"></div>
        
        <div className="w-full max-w-md p-8 bg-[rgba(15,15,35,0.7)] backdrop-blur-xl rounded-2xl border border-[rgba(255,255,255,0.15)] shadow-2xl z-10 transition-all duration-500 hover:border-[rgba(255,255,255,0.25)] hover:shadow-[0_0_30px_rgba(230,230,250,0.15)]">
          <h2 className="text-2xl font-bold mb-6 text-center text-[#e6e6fa] bg-clip-text text-transparent bg-gradient-to-r from-[#e6e6fa] to-[#b0c4de]">Create an account</h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-[#e6e6fa]">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                placeholder="Full Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="mt-1 w-full px-4 py-2 bg-[rgba(230,230,250,0.1)] border border-[rgba(255,255,255,0.2)] rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-[#e6e6fa] placeholder-[#d3d3d3]/60"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#e6e6fa]">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                placeholder="Email Address"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="mt-1 w-full px-4 py-2 bg-[rgba(230,230,250,0.1)] border border-[rgba(255,255,255,0.2)] rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-[#e6e6fa] placeholder-[#d3d3d3]/60"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[#e6e6fa]">
                Password
              </label>
              <input
                type="password"
                id="password"
                placeholder="Password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="mt-1 w-full px-4 py-2 bg-[rgba(230,230,250,0.1)] border border-[rgba(255,255,255,0.2)] rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-[#e6e6fa] placeholder-[#d3d3d3]/60"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-indigo-600 text-[#e6e6fa] py-2 px-4 rounded-lg hover:bg-indigo-700 transition-all duration-300 backdrop-blur-md border border-[rgba(255,255,255,0.2)] hover:shadow-[0_0_15px_rgba(230,230,250,0.3)]"
            >
              Register
            </button>
          </form>
          {message && (
            <p className="mt-4 text-center text-sm text-green-400">
              {message}
            </p>
          )}
          <p className="mt-4 text-center text-sm text-[#d3d3d3]/80">
            Already have an account?{' '}
            <Link href="/login" className="text-indigo-400 hover:text-indigo-300 transition-all">
              Sign in
            </Link>
          </p>
        </div>
      </div>

      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0); }
          50% { transform: translateY(-20px) translateX(10px); }
        }
        .animate-float {
          animation: float 8s ease-in-out infinite;
        }
        .animate-float-delay {
          animation: float 10s ease-in-out infinite 2s;
        }
      `}</style>
    </>
  )
}