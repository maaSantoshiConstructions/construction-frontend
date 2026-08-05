import { useState, useMemo } from 'react';
import {
  LOAN_MIN,
  LOAN_MAX,
  LOAN_DEFAULT,
  RATE_MIN,
  RATE_MAX,
  RATE_DEFAULT,
  TENURE_MIN,
  TENURE_MAX,
  TENURE_DEFAULT,
  formatIndianCurrency,
  parseNumericValue,
  validateLoanAmount,
  validateInterestRate,
  validateTenureYears,
  calculateEMIDetails,
  calculateAmortizationSchedule,
  calculateYearlySchedule,
} from '../utils/emiHelpers';

export default function useEMICalculator() {
  const [loanAmount, setLoanAmount] = useState(LOAN_DEFAULT);
  const [interestRate, setInterestRate] = useState(RATE_DEFAULT);
  const [tenureYears, setTenureYears] = useState(TENURE_DEFAULT);

  const [loanInputStr, setLoanInputStr] = useState(formatIndianCurrency(LOAN_DEFAULT));
  const [rateInputStr, setRateInputStr] = useState(RATE_DEFAULT.toString());
  const [tenureInputStr, setTenureInputStr] = useState(TENURE_DEFAULT.toString());

  const [isLoanFocused, setIsLoanFocused] = useState(false);
  const [errors, setErrors] = useState({});

  const [showSchedule, setShowSchedule] = useState(false);
  const [viewMode, setViewMode] = useState('monthly');
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 12;

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
    setErrors((prev) => ({ ...prev, loan: validateLoanAmount(val) }));
  };

  const handleLoanInputChange = (e) => {
    const rawVal = e.target.value;
    setLoanInputStr(rawVal);
    const parsed = parseNumericValue(rawVal);
    if (!isNaN(parsed) && parsed > 0) {
      setLoanAmount(parsed);
    }
    setErrors((prev) => ({ ...prev, loan: validateLoanAmount(parsed, rawVal) }));
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
    setErrors((prev) => ({ ...prev, loan: validateLoanAmount(clamped) }));
  };

  // Synchronized Interest Rate Handlers
  const handleRateSliderChange = (e) => {
    const val = parseFloat(e.target.value);
    setInterestRate(val);
    setRateInputStr(val.toString());
    setErrors((prev) => ({ ...prev, rate: validateInterestRate(val) }));
  };

  const handleRateInputChange = (e) => {
    const rawVal = e.target.value;
    setRateInputStr(rawVal);
    const parsed = parseFloat(rawVal);
    if (!isNaN(parsed) && parsed > 0) {
      setInterestRate(parsed);
    }
    setErrors((prev) => ({ ...prev, rate: validateInterestRate(parsed, rawVal) }));
  };

  const handleRateBlur = () => {
    const parsed = parseFloat(rateInputStr);
    const clamped = Math.max(RATE_MIN, Math.min(RATE_MAX, parsed || RATE_DEFAULT));
    setInterestRate(clamped);
    setRateInputStr(clamped.toString());
    setErrors((prev) => ({ ...prev, rate: validateInterestRate(clamped) }));
  };

  // Synchronized Loan Tenure Handlers
  const handleTenureSliderChange = (e) => {
    const val = Number(e.target.value);
    setTenureYears(val);
    setTenureInputStr(val.toString());
    setCurrentPage(1);
    setErrors((prev) => ({ ...prev, tenure: validateTenureYears(val) }));
  };

  const handleTenureInputChange = (e) => {
    const rawVal = e.target.value;
    setTenureInputStr(rawVal);
    const parsed = parseInt(rawVal, 10);
    if (!isNaN(parsed) && parsed > 0) {
      setTenureYears(parsed);
      setCurrentPage(1);
    }
    setErrors((prev) => ({ ...prev, tenure: validateTenureYears(parsed, rawVal) }));
  };

  const handleTenureBlur = () => {
    const parsed = parseInt(tenureInputStr, 10);
    const clamped = Math.max(TENURE_MIN, Math.min(TENURE_MAX, parsed || TENURE_DEFAULT));
    setTenureYears(clamped);
    setTenureInputStr(clamped.toString());
    setCurrentPage(1);
    setErrors((prev) => ({ ...prev, tenure: validateTenureYears(clamped) }));
  };

  // Calculations memoized for performance
  const calculationResults = useMemo(() => {
    return calculateEMIDetails(loanAmount, interestRate, tenureYears);
  }, [loanAmount, interestRate, tenureYears]);

  // Amortization schedule memoized
  const amortizationSchedule = useMemo(() => {
    return calculateAmortizationSchedule(calculationResults);
  }, [calculationResults]);

  // Yearly aggregated schedule memoized
  const yearlySchedule = useMemo(() => {
    return calculateYearlySchedule(amortizationSchedule);
  }, [amortizationSchedule]);

  // Pagination calculations
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

  return {
    loanAmount,
    loanInputStr,
    isLoanFocused,
    handleLoanSliderChange,
    handleLoanInputChange,
    handleLoanFocus,
    handleLoanBlur,

    interestRate,
    rateInputStr,
    handleRateSliderChange,
    handleRateInputChange,
    handleRateBlur,

    tenureYears,
    tenureInputStr,
    handleTenureSliderChange,
    handleTenureInputChange,
    handleTenureBlur,

    errors,
    handleReset,

    calculationResults,
    chartData,
    chartOptions,
    principalPct,
    interestPct,

    showSchedule,
    setShowSchedule,
    viewMode,
    setViewMode,
    currentPage,
    setCurrentPage,
    totalPages,
    paginatedMonthlySchedule,
    yearlySchedule,

    formatIndianCurrency,
  };
}
