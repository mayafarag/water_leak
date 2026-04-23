import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Droplets, Flame, Shield, BarChart3, Settings, Zap } from 'lucide-react';

const Landing: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-cyan-800 to-teal-900">
      {/* Header */}
      <header className="container mx-auto px-6 py-8">
        <nav className="flex justify-between items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center space-x-3"
          >
            <div className="w-10 h-10 bg-cyan-400 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-blue-900" />
            </div>
            <h1 className="text-2xl font-bold text-white">Smart Water & Fire Detection</h1>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-x-4"
          >
            <Link
              to="/login"
              className="px-6 py-2 bg-cyan-500 hover:bg-cyan-400 text-white rounded-lg transition-colors duration-200"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="px-6 py-2 border border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-blue-900 rounded-lg transition-colors duration-200"
            >
              Sign Up
            </Link>
          </motion.div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <h2 className="text-5xl md:text-7xl font-bold text-white mb-6">
            Smart Safety
            <br />
            <span className="text-cyan-400">Monitoring System</span>
          </h2>
          <p className="text-xl text-cyan-100 mb-8 max-w-2xl mx-auto">
            Advanced IoT solution for real-time water leak and fire detection.
            Protect your property with intelligent sensors and automated controls.
          </p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Link
              to="/signup"
              className="inline-block px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
            >
              Get Started
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h3 className="text-4xl font-bold text-white mb-4">Key Features</h3>
          <p className="text-cyan-100 text-lg">Comprehensive monitoring and control capabilities</p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              icon: Droplets,
              title: 'Leak Detection',
              description: 'Advanced sensors detect water leaks instantly with high accuracy.'
            },
            {
              icon: Flame,
              title: 'Fire Detection',
              description: 'Thermal sensors and flame detectors for early fire warning.'
            },
            {
              icon: BarChart3,
              title: 'Real-time Analytics',
              description: 'Live charts and graphs showing pressure trends and system status.'
            },
            {
              icon: Settings,
              title: 'Manual Control',
              description: 'Remote valve control and system management from anywhere.'
            },
            {
              icon: Shield,
              title: 'Automated Safety',
              description: 'Intelligent automation prevents damage and ensures safety.'
            },
            {
              icon: Zap,
              title: 'IoT Integration',
              description: 'Seamless connection with ESP32 microcontroller for reliable data.'
            }
          ].map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-200"
            >
              <div className="w-12 h-12 bg-cyan-400 rounded-lg flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6 text-blue-900" />
              </div>
              <h4 className="text-xl font-semibold text-white mb-2">{feature.title}</h4>
              <p className="text-cyan-100">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-6 py-8 border-t border-white/20">
        <div className="text-center text-cyan-200">
          <p>&copy; 2024 Smart Water and Fire Detection System. Graduation Project.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;