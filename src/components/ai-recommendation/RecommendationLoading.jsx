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
      <style>{loadingStyles}</style>
    </div>
  );
}

const loadingStyles = `
  .ai-page { background: #f7f7fb; min-height: 100vh; padding-bottom: 90px; }
  .ai-loading-card {
    background: #fff; border-radius: 20px; padding: 48px 40px;
    box-shadow: 0 20px 60px rgba(20,20,60,.1); text-align: center;
    max-width: 440px; width: 90%; margin: 120px auto;
  }
  .ai-loading-spinner {
    width: 64px; height: 64px; margin: 0 auto 24px;
    border-radius: 50%; border: 4px solid #e6e6f0; border-top-color: var(--indigo);
  }
  .ai-loading-title { font-size: 20px; font-weight: 700; color: var(--text); margin-bottom: 8px; }
  .ai-loading-sub { font-size: 13.5px; color: #6b6f8a; margin-bottom: 28px; line-height: 1.6; }
  .ai-loading-steps { display: flex; flex-direction: column; gap: 10px; text-align: left; }
  .ai-loading-step {
    display: flex; align-items: center; gap: 12px;
    padding: 10px 14px; border-radius: 10px; font-size: 13px; font-weight: 600;
    background: #f7f7fb; color: #b7bade; transition: all .3s;
  }
  .ai-loading-step.active { background: #f1eefe; color: var(--indigo); }
  .ai-loading-step-icon.done { color: #2ecc71; font-size: 14px; }
  .ai-loading-step-spinner {
    width: 14px; height: 14px; border-radius: 50%;
    border: 2px solid var(--indigo); border-top-color: transparent;
  }
  .ai-loading-step-dot { width: 14px; height: 14px; border-radius: 50%; border: 2px solid #e6e6f0; }

  @media (max-width: 768px) {
    .ai-loading-card { margin: 80px auto; padding: 36px 24px; }
  }
`;
