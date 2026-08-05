// Input constraints
export const LOAN_MIN = 100000;        // ₹1 Lakh
export const LOAN_MAX = 100000000;     // ₹10 Crore
export const LOAN_DEFAULT = 5000000;   // ₹50 Lakhs
export const LOAN_STEP = 50000;

export const RATE_MIN = 1.0;
export const RATE_MAX = 20.0;
export const RATE_DEFAULT = 8.5;
export const RATE_STEP = 0.1;

export const TENURE_MIN = 1;
export const TENURE_MAX = 30;
export const TENURE_DEFAULT = 20;

// Helper: Format raw number to Indian currency format
export const formatIndianCurrency = (val) => {
  if (val === null || val === undefined || isNaN(val) || val === '') return '';
  const num = Math.round(Number(val));
  return '₹ ' + num.toLocaleString('en-IN');
};

// Helper: Parse integer from Indian currency string or raw input
export const parseNumericValue = (str) => {
  if (typeof str === 'number') return str;
  if (!str) return 0;
  const cleaned = String(str).replace(/[^0-9.]/g, '');
  return cleaned ? parseFloat(cleaned) : 0;
};

// Validation Helpers
export const validateLoanAmount = (val, rawStr) => {
  if (rawStr === '' || isNaN(val) || val <= 0) {
    return 'Please enter a valid loan amount.';
  }
  if (val < LOAN_MIN) {
    return `Minimum loan amount is ${formatIndianCurrency(LOAN_MIN)}.`;
  }
  if (val > LOAN_MAX) {
    return `Maximum loan amount is ${formatIndianCurrency(LOAN_MAX)}.`;
  }
  return null;
};

export const validateInterestRate = (val, rawStr) => {
  if (rawStr === '' || isNaN(val) || val <= 0) {
    return 'Please enter a valid interest rate.';
  }
  if (val < RATE_MIN) {
    return `Minimum interest rate is ${RATE_MIN}%.`;
  }
  if (val > RATE_MAX) {
    return `Maximum interest rate is ${RATE_MAX}%.`;
  }
  return null;
};

export const validateTenureYears = (val, rawStr) => {
  if (rawStr === '' || isNaN(val) || val <= 0) {
    return 'Please enter a valid tenure in years.';
  }
  if (val < TENURE_MIN) {
    return `Minimum tenure is ${TENURE_MIN} year.`;
  }
  if (val > TENURE_MAX) {
    return `Maximum tenure is ${TENURE_MAX} years.`;
  }
  return null;
};

// Calculation Helpers
export const calculateEMIDetails = (loanAmount, interestRate, tenureYears) => {
  const P = Math.max(LOAN_MIN, Math.min(LOAN_MAX, loanAmount || LOAN_DEFAULT));
  const annualRate = Math.max(RATE_MIN, Math.min(RATE_MAX, interestRate || RATE_DEFAULT));
  const years = Math.max(TENURE_MIN, Math.min(TENURE_MAX, tenureYears || TENURE_DEFAULT));

  const r = annualRate / 12 / 100;
  const n = years * 12;

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
};

export const calculateAmortizationSchedule = (calculationResults) => {
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
};

export const calculateYearlySchedule = (amortizationSchedule) => {
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
};
