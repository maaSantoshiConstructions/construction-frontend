import React from 'react';
import { motion } from 'framer-motion';
import { FaWhatsapp, FaEnvelope, FaSms, FaSpinner } from 'react-icons/fa';

export default function SequenceCard({
  sequences = [],
  active,
  setActive,
  selectedLeadId,
  triggeringIndex,
  handleTriggerStep
}) {
  if (!active) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl border border-slate-200 shadow-xl p-8 mb-8"
    >
      {/* Workflow selection tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {sequences.map((seq) => {
          const isActive = active.id === seq.id;
          return (
            <button
              key={seq.id}
              onClick={() => setActive(seq)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition duration-200 outline-none ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : 'bg-white border border-slate-200 text-slate-700 hover:border-indigo-600 hover:text-indigo-600'
              }`}
            >
              {seq.name}
            </button>
          );
        })}
      </div>

      {/* Trigger Detail */}
      <div className="mb-6 border-b border-slate-100 pb-4 flex items-center justify-between">
        <div>
          <span className="text-xs text-slate-400 font-bold uppercase tracking-wider font-poppins">
            Sequence Trigger:
          </span>
          <span className="text-sm font-bold text-slate-800 ml-2">
            ⚡ {active.trigger}
          </span>
        </div>
      </div>

      {/* Steps Timeline Grid */}
      <div className="flex flex-col gap-4">
        {active.steps.map((step, i) => {
          const isWhatsApp = step.channel === 'WhatsApp';
          const isEmail = step.channel === 'Email';
          const isTriggering = triggeringIndex === i;

          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex gap-4 p-5 bg-slate-50 border border-slate-200 rounded-xl items-center"
            >
              {/* Left Icon Panel */}
              <div className="flex-shrink-0">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-sm ${
                  isWhatsApp ? 'bg-emerald-50 text-emerald-500' : isEmail ? 'bg-indigo-50 text-indigo-600' : 'bg-amber-50 text-amber-500'
                }`}>
                  {isWhatsApp ? <FaWhatsapp className="text-lg" /> :
                   isEmail ? <FaEnvelope className="text-base" /> :
                   <FaSms className="text-lg" />}
                </div>
              </div>

              {/* Center Content Panel */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2.5 py-0.5 bg-indigo-50 text-indigo-600 text-[10px] font-extrabold rounded-full font-poppins">
                    {step.time}
                  </span>
                  <span className="text-slate-400 text-xs font-semibold">
                    via {step.channel}
                  </span>
                </div>
                <p className="text-slate-800 text-xs md:text-sm font-medium leading-relaxed truncate">
                  &ldquo;{step.message}&rdquo;
                </p>
              </div>

              {/* Right Action Panel */}
              <div className="flex-shrink-0">
                <button
                  onClick={() => handleTriggerStep(step, i)}
                  disabled={!selectedLeadId || triggeringIndex !== null}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold text-white transition duration-200 ${
                    !selectedLeadId
                      ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                      : isTriggering
                      ? 'bg-indigo-400 cursor-wait'
                      : 'bg-indigo-600 hover:bg-indigo-700 active:scale-95'
                  }`}
                >
                  {isTriggering ? (
                    <span className="flex items-center gap-1">
                      <FaSpinner className="animate-spin" /> Sending
                    </span>
                  ) : (
                    'Trigger Step'
                  )}
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
