import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaClock, FaExclamationTriangle, FaArrowRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const TimerUnit = ({ value, label }) => (
  <div className="flex flex-col items-center">
    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-2xl shadow-inner flex items-center justify-center border border-slate-200">
      <span className="text-2xl sm:text-3xl font-bold text-slate-800 tabular-nums">{String(value).padStart(2, '0')}</span>
    </div>
    <span className="text-[10px] sm:text-xs text-slate-500 mt-1 uppercase tracking-wider font-medium">{label}</span>
  </div>
);

export default function PriceTimer() {
  const targetDate = new Date('2026-07-15T00:00:00');
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculate = () => {
      const now = new Date();
      const diff = targetDate - now;
      if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      return {
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      };
    };
    setTimeLeft(calculate());
    const interval = setInterval(() => setTimeLeft(calculate()), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-gradient-to-r from-amber-600 to-orange-700 py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
              <FaClock className="text-white text-3xl" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">Dynamic Price Timer</h1>
            <p className="text-amber-100">Current prices locked until timer runs out</p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 -mt-6 pb-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl shadow-sm p-8 sm:p-12 text-center border border-amber-100">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-red-50 border border-red-200 rounded-full text-sm text-red-600 font-medium mb-6">
            <FaExclamationTriangle /> Price Increase Coming Soon
          </div>

          <h2 className="text-2xl font-bold text-slate-800 mb-2">Current Price: ₹2,450/sq.ft</h2>
          <p className="text-slate-500 mb-8">Price will increase to <span className="font-semibold text-red-600">₹2,650/sq.ft</span></p>

          <div className="flex justify-center gap-4 sm:gap-6 mb-8">
            <TimerUnit value={timeLeft.days} label="Days" />
            <TimerUnit value={timeLeft.hours} label="Hours" />
            <TimerUnit value={timeLeft.minutes} label="Minutes" />
            <TimerUnit value={timeLeft.seconds} label="Seconds" />
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 text-sm text-left mb-8">
            <p className="font-semibold text-amber-800 mb-2">What this means for you:</p>
            <ul className="space-y-1 text-amber-700 text-xs">
              <li>• Plots booked before the timer expires get the current rate of ₹2,450/sq.ft</li>
              <li>• After the timer, all available plots will be priced at ₹2,650/sq.ft (8.2% increase)</li>
              <li>• Token bookings with ₹25,000 lock the current price for 7 days</li>
            </ul>
          </div>

          <Link
            to="/projects"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-full transition-colors shadow-lg shadow-orange-600/30"
          >
            Book Now at Current Price <FaArrowRight />
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
