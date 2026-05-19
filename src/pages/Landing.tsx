import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Droplets, Flame, Shield, BarChart3, Settings, Zap } from 'lucide-react';

const Landing: React.FC = () => {
  return (
    <div className="app-surface relative min-h-screen overflow-hidden">
      <div className="water-orbit pointer-events-none" />
      <div className="water-waves pointer-events-none" />
      <div className="app-grid pointer-events-none absolute inset-0" />
      {/* Header */}
      <header className="container relative mx-auto px-6 py-8">
        <nav className="flex justify-between items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center space-x-3"
          >
            <div className="w-10 h-10 bg-slate-950 rounded-lg flex items-center justify-center text-white">
              <Shield className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-black text-white">HomeGuard</h1>
            <p className="text-xs text-cyan-50/60 mt-0.5">Smart Water And Fire System</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Link
              to="/login"
              className="accent-button px-8 py-3 text-lg"
            >
              Access Dashboard
            </Link>
          </motion.div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container relative mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <h2 className="text-5xl md:text-7xl font-black text-white mb-6 text-balance drop-shadow-lg">
            HomeGuard
            <br />
            <span className="text-cyan-200">Smart Water And Fire System</span>
          </h2>
          <p className="text-xl text-cyan-50/75 mb-8 max-w-2xl mx-auto">
            Advanced IoT solution for real-time water leak and fire detection.
            Protect your property with intelligent sensors and automated controls.
          </p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Link
              to="/login"
              className="accent-button px-8 py-4 text-lg"
            >
              Access System
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Features */}
      <section className="container relative mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h3 className="text-4xl font-black text-white mb-4">Key Features</h3>
          <p className="text-cyan-50/75 text-lg">Comprehensive monitoring and control capabilities</p>
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
              className="control-panel rounded-2xl p-6 transition-all duration-200 hover:-translate-y-1"
            >
              <div className="w-12 h-12 bg-slate-950 rounded-lg flex items-center justify-center mb-4 text-white">
                <feature.icon className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-black text-white mb-2">{feature.title}</h4>
              <p className="text-cyan-50/70">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="container relative mx-auto px-6 py-8 border-t border-slate-200">
        <div className="text-center text-slate-500">
          <p>&copy; 2024 HomeGuard – Smart Water And Fire System. Graduation Project.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
