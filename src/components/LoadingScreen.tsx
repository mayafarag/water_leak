import React from 'react';
import { motion } from 'framer-motion';
import { Droplets, Waves } from 'lucide-react';

const LoadingScreen: React.FC = () => {
  return (
    <div className="app-surface relative flex min-h-screen items-center justify-center overflow-hidden">
      <div className="water-orbit pointer-events-none" />
      <div className="water-waves pointer-events-none" />
      <div className="app-grid absolute inset-0" />
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="panel relative mx-4 w-full max-w-sm rounded-3xl p-8 text-center"
      >
        <div className="relative mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-cyan-300/20 text-cyan-50 ring-1 ring-cyan-100/30 animate-float">
          <Waves className="h-12 w-12" />
          <span className="absolute -right-1 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-cyan-300 text-cyan-950 animate-soft-pulse">
            <Droplets className="h-4 w-4" />
          </span>
        </div>
        <div className="mb-5 h-1.5 overflow-hidden rounded-full bg-cyan-100/20">
          <div className="h-full w-1/2 rounded-full bg-cyan-200 animate-scanline" />
        </div>
        <h2 className="mb-2 text-2xl font-black text-white">Starting water monitor</h2>
        <p className="text-sm text-cyan-50/70">Connecting leak sensors, pressure readings, and valves.</p>
      </motion.div>
    </div>
  );
};

export default LoadingScreen;
