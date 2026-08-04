import React, { useState, useMemo } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { LuRotateCcw, LuChartPie } from 'react-icons/lu';

// Subcomponents
import EMIInputs from './emi/EMIInputs';
import EMIResultsCard from './emi/EMIResultsCard';
import AmortizationScheduleTable from './emi/AmortizationScheduleTable';

// Register Chart.js elements
ChartJS.register(ArcElement, Tooltip, Legend);

// Input constraints
const LOAN_MIN = 100000;        // ₹1 Lakh
const LOAN_MAX = 100000000;     // ₹10 Crore
const LOAN_DEFAULT = 5000000;   // ₹50 Lakhs
const LOAN_STEP = 50000;

const RATE_MIN = 1.0;
const RATE_MAX = 20.0;
const RATE_DEFAULT = 8.5;
const RATE_STEP = 0.1;

const TENURE_MIN = 1;
const TENURE_MAX = 30;
const TENURE_DEFAULT = 20;

// Helper: Format raw number to Indian currency format
const formatIndianCurrency = (val) => {
  if (val === null || val === undefined || isNaN(val) || val === '') return '';
  const num = Math.round(Number(val));
  return '₹ ' + num.toLocaleString('en-IN');
};

// Helper: Parse integer from Indian currency string or raw input
const parseNumericValue = (str) => {
  if (typeof str === 'number') return str;
  if (!str) return 0;
  const cleaned = str.replace(/[^0-9.]/g, '');
  return cleaned ? parseFloat(cleaned) : 0;
};

export default function EMICalculator() {
  // State for raw numeric values used in calculations
  const [loanAmount, setLoanAmount] = useState(LOAN_DEFAULT);
  const [interestRate, setInterestRate] = useState(RATE_DEFAULT);
  const [tenureYears, setTenureYears] = useState(TENURE_DEFAULT);

  // State for synchronized text input fields
  const [loanInputStr, setLoanInputStr] = useState(formatIndianCurrency(LOAN_DEFAULT));
  const [rateInputStr, setRateInputStr] = useState(RATE_DEFAULT.toString());
  const [tenureInputStr, setTenureInputStr] = useState(TENURE_DEFAULT.toString());

  // Input focus states for smooth Indian currency editing
  const [isLoanFocused, setIsLoanFocused] = useState(false);

  // Validation error states
  const [errors, setErrors] = useState({});

  // Amortization schedule states
  const [showSchedule, setShowSchedule] = useState(false);
  const [viewMode, setViewMode] = useState('monthly'); // 'monthly' | 'yearly'
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 12; // 1 year of months per page

  // Reset handler
  const handleReset = () => {
    setLoanAmount(LOAN_DEFAULT);
    setInterestRate(RATE_DEFAULT);
    setTenureYears(TENURE_DEFAULT);
    setLoanInputStr(formatIndianCurrency(LOAN_DEFAULT));
    setRateInputStr(RATE_DEFAULT.toString());
    setTenureInputStr(TENURE_DEFAULT.toString());
    setErrors({});
    setCurrentPage(1);
    setViewMode('monthly');
  };

  // Synchronized Loan Amount Handlers
  const handleLoanSliderChange = (e) => {
    const val = Number(e.target.value);
    setLoanAmount(val);
    setLoanInputStr(formatIndianCurrency(val));
    validateLoan(val);
  };

  const handleLoanInputChange = (e) => {
    const rawVal = e.target.value;
    setLoanInputStr(rawVal);
    const parsed = parseNumericValue(rawVal);
    if (!isNaN(parsed) && parsed > 0) {
      setLoanAmount(parsed);
    }
    validateLoan(parsed, rawVal);
  };

  const handleLoanFocus = () => {
    setIsLoanFocused(true);
    setLoanInputStr(loanAmount > 0 ? loanAmount.toString() : '');
  };

  const handleLoanBlur = () => {
    setIsLoanFocused(false);
    const parsed = parseNumericValue(loanInputStr);
    const clamped = Math.max(LOAN_MIN, Math.min(LOAN_MAX, parsed || LOAN_DEFAULT));
    setLoanAmount(clamped);
    setLoanInputStr(formatIndianCurrency(clamped));
    validateLoan(clamped);
  };

  const validateLoan = (val, rawStr) => {
    let err = null;
    if (rawStr === '' || isNaN(val) || val <= 0) {
      err = 'Please enter a valid loan amount.';
    } else if (val < LOAN_MIN) {
      err = `Minimum loan amount is ${formatIndianCurrency(LOAN_MIN)}.`;
    } else if (val > LOAN_MAX) {
      err = `Maximum loan amount is ${formatIndianCurrency(LOAN_MAX)}.`;
    }
    setErrors((prev) => ({ ...prev, loan: err }));
  };

  // Synchronized Interest Rate Handlers
  const handleRateSliderChange = (e) => {
    const val = parseFloat(e.target.value);
    setInterestRate(val);
    setRateInputStr(val.toString());
    validateRate(val);
  };

  const handleRateInputChange = (e) => {
    const rawVal = e.target.value;
    setRateInputStr(rawVal);
    const parsed = parseFloat(rawVal);
    if (!isNaN(parsed) && parsed > 0) {
      setInterestRate(parsed);
    }
    validateRate(parsed, rawVal);
  };

  const handleRateBlur = () => {
    const parsed = parseFloat(rateInputStr);
    const clamped = Math.max(RATE_MIN, Math.min(RATE_MAX, parsed || RATE_DEFAULT));
    setInterestRate(clamped);
    setRateInputStr(clamped.toString());
    validateRate(clamped);
  };

  const validateRate = (val, rawStr) => {
    let err = null;
    if (rawStr === '' || isNaN(val) || val <= 0) {
      err = 'Please enter a valid interest rate.';
    } else if (val < RATE_MIN) {
      err = `Minimum interest rate is ${RATE_MIN}%.`;
    } else if (val > RATE_MAX) {
      err = `Maximum interest rate is ${RATE_MAX}%.`;
    }
    setErrors((prev) => ({ ...prev, rate: err }));
  };

  // Synchronized Loan Tenure Handlers
  const handleTenureSliderChange = (e) => {
    const val = Number(e.target.value);
    setTenureYears(val);
    setTenureInputStr(val.toString());
    setCurrentPage(1);
    validateTenure(val);
  };

  const handleTenureInputChange = (e) => {
    const rawVal = e.target.value;
    setTenureInputStr(rawVal);
    const parsed = parseInt(rawVal, 10);
    if (!isNaN(parsed) && parsed > 0) {
      setTenureYears(parsed);
      setCurrentPage(1);
    }
    validateTenure(parsed, rawVal);
  };

  const handleTenureBlur = () => {
    const parsed = parseInt(tenureInputStr, 10);
    const clamped = Math.max(TENURE_MIN, Math.min(TENURE_MAX, parsed || TENURE_DEFAULT));
    setTenureYears(clamped);
    setTenureInputStr(clamped.toString());
    setCurrentPage(1);
    validateTenure(clamped);
  };

  const validateTenure = (val, rawStr) => {
    let err = null;
    if (rawStr === '' || isNaN(val) || val <= 0) {
      err = 'Please enter a valid tenure in years.';
    } else if (val < TENURE_MIN) {
      err = `Minimum tenure is ${TENURE_MIN} year.`;
    } else if (val > TENURE_MAX) {
      err = `Maximum tenure is ${TENURE_MAX} years.`;
    }
    setErrors((prev) => ({ ...prev, tenure: err }));
  };

  // Calculations memoized for performance
  const calculationResults = useMemo(() => {
    const P = Math.max(LOAN_MIN, Math.min(LOAN_MAX, loanAmount || LOAN_DEFAULT));
    const annualRate = Math.max(RATE_MIN, Math.min(RATE_MAX, interestRate || RATE_DEFAULT));
    const years = Math.max(TENURE_MIN, Math.min(TENURE_MAX, tenureYears || TENURE_DEFAULT));

    const r = annualRate / 12 / 100; // monthly rate
    const n = years * 12; // total months

    let emi = 0;
    if (r > 0) {
      const pow = Math.pow(1 + r, n);
      emi = (P * r * pow) / (pow - 1);
    } else {
      emi = P / n;
    }

    const totalPayment = emi * n;
    const totalInterest = totalPayment - P;

    return {
      monthlyEMI: emi,
      principal: P,
      totalInterest,
      totalPayment,
      totalMonths: n,
      monthlyRate: r,
    };
  }, [loanAmount, interestRate, tenureYears]);

  // Amortization schedule memoized
  const amortizationSchedule = useMemo(() => {
    const { principal, monthlyEMI, monthlyRate, totalMonths } = calculationResults;
    let balance = principal;
    const schedule = [];
    const now = new Date();
    const startMonth = now.getMonth();
    const startYear = now.getFullYear();
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    for (let i = 1; i <= totalMonths; i++) {
      const interestComp = balance * monthlyRate;
      let principalComp = monthlyEMI - interestComp;
      
      if (i === totalMonths || balance <= principalComp) {
        principalComp = balance;
        balance = 0;
      } else {
        balance -= principalComp;
      }

      const mIdx = (startMonth + i - 1) % 12;
      const yOffset = Math.floor((startMonth + i - 1) / 12);
      const dateStr = `${monthNames[mIdx]} ${startYear + yOffset}`;

      schedule.push({
        monthNum: i,
        yearNum: Math.ceil(i / 12),
        dateStr,
        emi: monthlyEMI,
        principal: principalComp,
        interest: interestComp,
        balance: Math.max(0, balance),
      });
    }

    return schedule;
  }, [calculationResults]);

  // Yearly aggregated schedule memoized
  const yearlySchedule = useMemo(() => {
    const yearsMap = {};
    amortizationSchedule.forEach((row) => {
      if (!yearsMap[row.yearNum]) {
        yearsMap[row.yearNum] = {
          yearNum: row.yearNum,
          principal: 0,
          interest: 0,
          emi: 0,
          balance: row.balance,
        };
      }
      yearsMap[row.yearNum].principal += row.principal;
      yearsMap[row.yearNum].interest += row.interest;
      yearsMap[row.yearNum].emi += row.emi;
      yearsMap[row.yearNum].balance = row.balance;
    });
    return Object.values(yearsMap);
  }, [amortizationSchedule]);

  // Pagination calculations for monthly view
  const totalPages = Math.ceil(amortizationSchedule.length / rowsPerPage);
  const paginatedMonthlySchedule = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return amortizationSchedule.slice(start, start + rowsPerPage);
  }, [amortizationSchedule, currentPage]);

  // Doughnut Chart Data
  const chartData = useMemo(() => {
    return {
      labels: ['Principal Amount', 'Total Interest'],
      datasets: [
        {
          data: [
            Math.round(calculationResults.principal),
            Math.round(calculationResults.totalInterest),
          ],
          backgroundColor: ['#3a2fb8', '#e8b355'],
          hoverBackgroundColor: ['#4f42d9', '#f3be62'],
          borderWidth: 2,
          borderColor: '#ffffff',
        },
      ],
    };
  }, [calculationResults]);

  const chartOptions = useMemo(() => {
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (context) => {
              const label = context.label || '';
              const val = context.parsed || 0;
              const total = calculationResults.totalPayment;
              const pct = total > 0 ? ((val / total) * 100).toFixed(1) : 0;
              return `${label}: ${formatIndianCurrency(val)} (${pct}%)`;
            },
          },
        },
      },
      cutout: '72%',
    };
  }, [calculationResults]);

  const principalPct = ((calculationResults.principal / calculationResults.totalPayment) * 100).toFixed(1);
  const interestPct = ((calculationResults.totalInterest / calculationResults.totalPayment) * 100).toFixed(1);

  return (
    <div className="bg-white rounded-2xl border border-[var(--line,#e6e6f0)] shadow-sm p-6 sm:p-9 transition-all">
      
      {/* Header with Title & Reset Button */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-7">
        <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2 font-['Poppins',sans-serif]">
          <LuChartPie size={22} className="text-indigo-600 shrink-0" /> Home Loan EMI Calculator
        </h2>
        <button
          type="button"
          onClick={handleReset}
          aria-label="Reset Calculator inputs to default"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-200 bg-[#f7f7fb] hover:bg-[#eeeef7] hover:border-indigo-500 text-xs font-semibold text-slate-700 transition-all cursor-pointer"
        >
          <LuRotateCcw size={14} className="text-indigo-600" /> Reset Calculator
        </button>
      </div>

      {/* Main Grid: Inputs vs Summary & Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-9">
        {/* Left Column: Interactive Inputs Subcomponent */}
        <EMIInputs
          loanAmount={loanAmount}
          loanInputStr={loanInputStr}
          isLoanFocused={isLoanFocused}
          handleLoanSliderChange={handleLoanSliderChange}
          handleLoanInputChange={handleLoanInputChange}
          handleLoanFocus={handleLoanFocus}
          handleLoanBlur={handleLoanBlur}
          interestRate={interestRate}
          rateInputStr={rateInputStr}
          handleRateSliderChange={handleRateSliderChange}
          handleRateInputChange={handleRateInputChange}
          handleRateBlur={handleRateBlur}
          tenureYears={tenureYears}
          tenureInputStr={tenureInputStr}
          handleTenureSliderChange={handleTenureSliderChange}
          handleTenureInputChange={handleTenureInputChange}
          handleTenureBlur={handleTenureBlur}
          errors={errors}
          formatIndianCurrency={formatIndianCurrency}
          calculationResults={calculationResults}
          LOAN_MIN={LOAN_MIN}
          LOAN_MAX={LOAN_MAX}
          LOAN_STEP={LOAN_STEP}
          RATE_MIN={RATE_MIN}
          RATE_MAX={RATE_MAX}
          RATE_STEP={RATE_STEP}
          TENURE_MIN={TENURE_MIN}
          TENURE_MAX={TENURE_MAX}
        />

        {/* Right Column: Results & Chart Subcomponent */}
        <EMIResultsCard
          tenureYears={tenureYears}
          calculationResults={calculationResults}
          formatIndianCurrency={formatIndianCurrency}
          chartData={chartData}
          chartOptions={chartOptions}
          principalPct={principalPct}
          interestPct={interestPct}
        />
      </div>

      {/* Amortization Schedule Table Subcomponent */}
      <AmortizationScheduleTable
        tenureYears={tenureYears}
        calculationResults={calculationResults}
        showSchedule={showSchedule}
        setShowSchedule={setShowSchedule}
        viewMode={viewMode}
        setViewMode={setViewMode}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalPages={totalPages}
        paginatedMonthlySchedule={paginatedMonthlySchedule}
        yearlySchedule={yearlySchedule}
        formatIndianCurrency={formatIndianCurrency}
      />

    </div>
  );
}
