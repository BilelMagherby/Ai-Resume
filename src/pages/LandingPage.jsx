import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  Sparkles,
  Zap,
  Users,
  Shield,
  Star,
  ChevronDown,
  Play,
  CheckCircle,
  Target,
  FileText,
  Brain,
  TrendingUp
} from 'lucide-react'

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Navigation */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-gray-200"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">CV</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold gradient-text">SmartCV+</span>
                <span className="text-xs text-gray-500">AI-Powered</span>
              </div>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">Features</a>
              <a href="#testimonials" className="text-gray-600 hover:text-gray-900 transition-colors">Testimonials</a>
              <a href="#pricing" className="text-gray-600 hover:text-gray-900 transition-colors">Pricing</a>
              <Link
                to="/dashboard"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Dashboard
              </Link>
              <Link
                to="/cv-builder"
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all"
              >
                Create CV
              </Link>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section - One Big Block */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 text-white">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-4xl mx-auto"
            >
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                <span className="block">Transform Your Career</span>
                <span className="block text-yellow-300">with AI-Powered Resumes</span>
              </h1>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto leading-relaxed"
              >
                <p className="font-light">
                  Stop letting ATS systems reject your applications. Our intelligent resume builder 
                  <span className="font-semibold text-white"> optimizes every word </span>
                  for both human recruiters and automated systems, ensuring your skills get noticed.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
              >
                <Link
                  to="/cv-builder"
                  className="inline-flex items-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-all transform hover:scale-105 shadow-xl"
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  Build Your Resume Now
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
                
                <Link
                  to="/dashboard"
                  className="inline-flex items-center px-8 py-4 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-blue-600 transition-all"
                >
                  <Play className="w-5 h-5 mr-2" />
                  Watch Demo
                </Link>
              </motion.div>
            </motion.div>
          </div>

          {/* Floating Elements */}
          <div className="absolute top-20 left-10 w-20 h-20 bg-yellow-400 rounded-full opacity-20 animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-32 h-32 bg-blue-400 rounded-full opacity-10 animate-bounce"></div>
          <div className="absolute top-40 right-20 w-16 h-16 bg-purple-400 rounded-full opacity-15 animate-pulse"></div>
        </div>

        <div className="bg-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Why Most Resumes Fail (And How We Fix It)
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                The average job posting receives 250+ resumes. 75% are rejected by ATS systems before a human ever sees them.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8 mb-16">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.1 }}
                viewport={{ once: true }}
                className="text-center p-8 bg-red-50 rounded-xl border border-red-100"
              >
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-xl font-bold text-red-900 mb-3">The Problem</h3>
                <p className="text-gray-700 leading-relaxed">
                  ATS systems can't read fancy formats, graphics, or complex layouts. 
                  Most resumes look great to humans but are invisible to robots.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
                className="text-center p-8 bg-yellow-50 rounded-xl border border-yellow-100"
              >
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Brain className="w-8 h-8 text-yellow-600" />
                </div>
                <h3 className="text-xl font-bold text-yellow-900 mb-3">Our Solution</h3>
                <p className="text-gray-700 leading-relaxed">
                  AI-powered optimization that transforms your content into ATS-friendly format 
                  while maintaining professional appeal for human recruiters.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                viewport={{ once: true }}
                className="text-center p-8 bg-green-50 rounded-xl border border-green-100"
              >
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-green-900 mb-3">The Result</h3>
                <p className="text-gray-700 leading-relaxed">
                  10x higher interview rates. Your skills get seen by both robots 
                  and humans, dramatically increasing your chances.
                </p>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <Link
                to="/cv-builder"
                className="inline-flex items-center px-12 py-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-lg font-bold rounded-xl hover:shadow-2xl transition-all transform hover:scale-105"
              >
                <FileText className="w-6 h-6 mr-3" />
                Start Building Your ATS-Optimized Resume
                <ArrowRight className="w-6 h-6 ml-3" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-500">
            Join thousands who've transformed their job search with AI-powered resume optimization.
          </p>
        </div>
      </div>
    </div>
  )
}

export default LandingPage
