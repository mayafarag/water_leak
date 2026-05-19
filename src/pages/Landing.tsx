import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';

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
            <div>
              <h1 className="text-2xl font-black text-white leading-tight">HomeGuard</h1>
              <p className="text-xs text-cyan-50/60">Smart Water And Fire System</p>
            </div>
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
          <h2 className="text-5xl md:text-7xl font-black text-white mb-4 text-balance drop-shadow-lg">
            HomeGuard
          </h2>
          <p className="text-xl md:text-2xl text-cyan-200 font-semibold mb-6">
            Smart Water And Fire System
          </p>
          <p className="text-xl text-cyan-50/75 mb-10 max-w-2xl mx-auto">
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
