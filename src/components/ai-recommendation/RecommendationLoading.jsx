import React from 'react';
import { motion } from 'framer-motion';
import { FaCheckCircle } from 'react-icons/fa';

export default function RecommendationLoading({ analyzingStep }) {
  const steps = [
    'Scanning available plots...',
    'Analyzing location data...',
    'Calculating price matches...',
    'Ranking best options...',
  ];

  return (
    <div className="ai-page">
      <div className="ai-loading-card">
        <motion.div
          className="ai-loading-spinner"
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        />
        <h3 className="ai-loading-title">Finding Your Perfect Plot</h3>
        <p className="ai-loading-sub">
          Our intelligent engine is analyzing hundreds of plots to match your preferences.
        </p>
        <div className="ai-loading-steps">
          {steps.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: analyzingStep >= i ? 1 : 0.35, x: 0 }}
              transition={{ delay: i * 0.15 }}
              className={`ai-loading-step ${analyzingStep >= i ? 'active' : ''}`}
            >
              {analyzingStep > i ? (
                <FaCheckCircle className="ai-loading-step-icon done" />
              ) : analyzingStep === i ? (
                <motion.div
                  className="ai-loading-step-spinner"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                />
              ) : (
                <div className="ai-loading-step-dot" />
              )}
              {msg}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
