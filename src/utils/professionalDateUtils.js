// Professional Date Handling System for ATS-Optimized CV Builder

// Error types for structured error handling
export const DATE_ERROR_TYPES = {
  INVALID_FORMAT: 'INVALID_FORMAT',
  INVALID_DATE: 'INVALID_DATE',
  FUTURE_DATE: 'FUTURE_DATE',
  PAST_DATE: 'PAST_DATE',
  END_BEFORE_START: 'END_BEFORE_START',
  YEAR_TOO_OLD: 'YEAR_TOO_OLD',
  YEAR_TOO_FUTURE: 'YEAR_TOO_FUTURE',
  EMPTY_INPUT: 'EMPTY_INPUT'
};

// Error messages (can be localized later)
export const ERROR_MESSAGES = {
  [DATE_ERROR_TYPES.INVALID_FORMAT]: 'Please enter a valid date format',
  [DATE_ERROR_TYPES.INVALID_DATE]: 'This date does not exist on the calendar',
  [DATE_ERROR_TYPES.FUTURE_DATE]: 'Date cannot be in the future',
  [DATE_ERROR_TYPES.PAST_DATE]: 'Start date cannot be too far in the past',
  [DATE_ERROR_TYPES.END_BEFORE_START]: 'End date cannot be before start date',
  [DATE_ERROR_TYPES.YEAR_TOO_OLD]: 'Year cannot be before 1900',
  [DATE_ERROR_TYPES.YEAR_TOO_FUTURE]: 'Year is too far in the future',
  [DATE_ERROR_TYPES.EMPTY_INPUT]: 'Date is required'
};

// Present/Current term variations
export const PRESENT_TERMS = [
  'present', 'current', 'ongoing', 'now', 'today', 'until now', 'to present',
  'to date', 'till date', 'continuing', 'still', 'active', 'in progress'
];

// Cache for parsed dates to improve performance
const dateParseCache = new Map();
const CACHE_MAX_SIZE = 1000;

/**
 * Normalizes and cleans user date input
 */
export const normalizeDateInput = (input) => {
  if (!input || typeof input !== 'string') return '';
  
  return input
    .trim()
    .replace(/\s+/g, ' ')                    // Multiple spaces to single space
    .replace(/[–—]/g, '-')                    // All dash types to hyphen
    .replace(/[\/]/g, '-')                    // Slashes to hyphens
    .replace(/\.\./g, '-')                    // Double periods to hyphen
    .replace(/\s*-\s*/g, '-')                // Spaces around hyphens
    .replace(/\s*\/\s*/g, '-')                // Spaces around slashes
    .toLowerCase();
};

/**
 * Checks if input represents a present/current date
 */
export const isPresentTerm = (input) => {
  if (!input) return false;
  const normalized = normalizeDateInput(input);
  return PRESENT_TERMS.some(term => normalized.includes(term));
};

/**
 * Validates real calendar date (no impossible dates like 40-20-2022)
 */
export const validateRealDate = (year, month, day) => {
  // JavaScript months are 0-indexed, so adjust
  const jsMonth = month - 1;
  
  try {
    const date = new Date(year, jsMonth, day);
    
    // Check if JavaScript auto-corrected the date
    if (date.getFullYear() !== year || 
        date.getMonth() !== jsMonth || 
        date.getDate() !== day) {
      return false;
    }
    
    // Additional sanity checks
    if (year < 1900 || year > 2100) return false;
    if (month < 1 || month > 12) return false;
    if (day < 1 || day > 31) return false;
    
    return true;
  } catch {
    return false;
  }
};

/**
 * Enhanced date parser with international format support
 */
export const parseDateAdvanced = (dateString) => {
  if (!dateString) return null;
  
  const normalized = normalizeDateInput(dateString);
  
  // Check cache first
  if (dateParseCache.has(normalized)) {
    return dateParseCache.get(normalized);
  }
  
  // Handle present terms
  if (isPresentTerm(normalized)) {
    const result = new Date();
    cacheResult(normalized, result);
    return result;
  }
  
  let parsedDate = null;
  
  // Format patterns (in order of specificity)
  const patterns = [
    // DD-MM-YYYY or D-M-YYYY
    { regex: /^(\d{1,2})-(\d{1,2})-(\d{4})$/, parser: (m) => ({ d: parseInt(m[1]), m: parseInt(m[2]), y: parseInt(m[3]) }) },
    
    // YYYY-MM-DD or YYYY-M-D
    { regex: /^(\d{4})-(\d{1,2})-(\d{1,2})$/, parser: (m) => ({ d: parseInt(m[3]), m: parseInt(m[2]), y: parseInt(m[1]) }) },
    
    // MM-YYYY or M-YYYY
    { regex: /^(\d{1,2})-(\d{4})$/, parser: (m) => ({ d: 1, m: parseInt(m[1]), y: parseInt(m[2]) }) },
    
    // YYYY-MM or YYYY-M
    { regex: /^(\d{4})-(\d{1,2})$/, parser: (m) => ({ d: 1, m: parseInt(m[2]), y: parseInt(m[1]) }) },
    
    // YYYY only
    { regex: /^(\d{4})$/, parser: (m) => ({ d: 1, m: 1, y: parseInt(m[1]) }) },
    
    // Month YYYY (e.g., "sep 2023", "september 2023")
    { regex: /^(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\s+(\d{4})$/, 
      parser: (m) => {
        const months = { jan: 1, feb: 2, mar: 3, apr: 4, may: 5, jun: 6, jul: 7, aug: 8, sep: 9, oct: 10, nov: 11, dec: 12 };
        return { d: 1, m: months[m[1]], y: parseInt(m[2]) };
      }
    },
    
    // Full month names
    { regex: /^(january|february|march|april|may|june|july|august|september|october|november|december)\s+(\d{4})$/, 
      parser: (m) => {
        const months = { 
          january: 1, february: 2, march: 3, april: 4, may: 5, june: 6, 
          july: 7, august: 8, september: 9, october: 10, november: 11, december: 12 
        };
        return { d: 1, m: months[m[1]], y: parseInt(m[2]) };
      }
    }
  ];
  
  for (const pattern of patterns) {
    const match = normalized.match(pattern.regex);
    if (match) {
      const { d, m, y } = pattern.parser(match);
      
      if (validateRealDate(y, m, d)) {
        // Use UTC to avoid timezone issues
        parsedDate = new Date(Date.UTC(y, m - 1, d));
        break;
      }
    }
  }
  
  cacheResult(normalized, parsedDate);
  return parsedDate;
};

/**
 * Cache management
 */
const cacheResult = (key, value) => {
  if (dateParseCache.size >= CACHE_MAX_SIZE) {
    // Remove oldest entry (simple FIFO)
    const firstKey = dateParseCache.keys().next().value;
    dateParseCache.delete(firstKey);
  }
  dateParseCache.set(key, value);
};

/**
 * Professional date validation with structured errors
 */
export const validateDateAdvanced = (dateString, options = {}) => {
  const {
    allowFuture = false,
    allowPast = true,
    minYear = 1900,
    maxYear = new Date().getFullYear() + 1,
    required = false
  } = options;
  
  // Handle empty input
  if (!dateString || dateString.trim() === '') {
    if (required) {
      return {
        isValid: false,
        error: DATE_ERROR_TYPES.EMPTY_INPUT,
        message: ERROR_MESSAGES[DATE_ERROR_TYPES.EMPTY_INPUT],
        parsedDate: null
      };
    }
    return { isValid: true, error: null, message: '', parsedDate: null };
  }
  
  // Handle present terms
  if (isPresentTerm(dateString)) {
    return { isValid: true, error: null, message: '', parsedDate: new Date() };
  }
  
  // Parse the date
  const parsedDate = parseDateAdvanced(dateString);
  
  if (!parsedDate) {
    return {
      isValid: false,
      error: DATE_ERROR_TYPES.INVALID_FORMAT,
      message: ERROR_MESSAGES[DATE_ERROR_TYPES.INVALID_FORMAT],
      parsedDate: null
    };
  }
  
  const now = new Date();
  const year = parsedDate.getFullYear();
  
  // Year validation
  if (year < minYear) {
    return {
      isValid: false,
      error: DATE_ERROR_TYPES.YEAR_TOO_OLD,
      message: ERROR_MESSAGES[DATE_ERROR_TYPES.YEAR_TOO_OLD],
      parsedDate: null
    };
  }
  
  if (year > maxYear) {
    return {
      isValid: false,
      error: DATE_ERROR_TYPES.YEAR_TOO_FUTURE,
      message: ERROR_MESSAGES[DATE_ERROR_TYPES.YEAR_TOO_FUTURE],
      parsedDate: null
    };
  }
  
  // Future date validation
  if (!allowFuture && parsedDate > now) {
    return {
      isValid: false,
      error: DATE_ERROR_TYPES.FUTURE_DATE,
      message: ERROR_MESSAGES[DATE_ERROR_TYPES.FUTURE_DATE],
      parsedDate: null
    };
  }
  
  // Past date validation (if needed)
  if (!allowPast) {
    const tooOld = new Date();
    tooOld.setFullYear(tooOld.getFullYear() - 50); // 50 years ago
    if (parsedDate < tooOld) {
      return {
        isValid: false,
        error: DATE_ERROR_TYPES.PAST_DATE,
        message: ERROR_MESSAGES[DATE_ERROR_TYPES.PAST_DATE],
        parsedDate: null
      };
    }
  }
  
  return { isValid: true, error: null, message: '', parsedDate };
};

/**
 * Validates date range (start and end dates)
 */
export const validateDateRange = (startDate, endDate, options = {}) => {
  const startValidation = validateDateAdvanced(startDate, { ...options, required: true });
  const endValidation = validateDateAdvanced(endDate, { ...options, required: false });
  
  // If either date is invalid, return those errors
  if (!startValidation.isValid) return startValidation;
  if (!endValidation.isValid) return endValidation;
  
  // If end date is present, check range logic
  if (endValidation.parsedDate && startValidation.parsedDate) {
    if (endValidation.parsedDate < startValidation.parsedDate) {
      return {
        isValid: false,
        error: DATE_ERROR_TYPES.END_BEFORE_START,
        message: ERROR_MESSAGES[DATE_ERROR_TYPES.END_BEFORE_START],
        parsedDate: null
      };
    }
  }
  
  return { isValid: true, error: null, message: '', parsedDate: startValidation.parsedDate };
};

/**
 * Formats date for ATS output (standardized YYYY-MM format)
 */
export const formatForATS = (dateString) => {
  if (!dateString) return '';
  
  if (isPresentTerm(dateString)) {
    return 'Present';
  }
  
  const parsed = parseDateAdvanced(dateString);
  if (!parsed) return dateString; // Return original if parsing fails
  
  const year = parsed.getFullYear();
  const month = String(parsed.getMonth() + 1).padStart(2, '0');
  
  return `${year}-${month}`;
};

/**
 * Formats date for display (user-friendly)
 */
export const formatForDisplay = (dateString) => {
  if (!dateString) return '';
  
  if (isPresentTerm(dateString)) {
    return 'Present';
  }
  
  const parsed = parseDateAdvanced(dateString);
  if (!parsed) return dateString; // Return original if parsing fails
  
  const options = { year: 'numeric', month: 'short' };
  return parsed.toLocaleDateString('en-US', options);
};

/**
 * Calculates duration between two dates
 */
export const calculateDuration = (startDate, endDate) => {
  const start = parseDateAdvanced(startDate);
  const end = endDate === 'Present' || isPresentTerm(endDate) ? new Date() : parseDateAdvanced(endDate);
  
  if (!start || !end) return null;
  
  const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
  
  if (months < 0) return null;
  
  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;
  
  return { years, months: remainingMonths, totalMonths: months };
};

/**
 * Enhanced sorting with proper date range consideration
 */
export const sortByDateRange = (items, startDateField = 'startDate', endDateField = 'endDate') => {
  return [...items].sort((a, b) => {
    const aStart = parseDateAdvanced(a[startDateField]);
    const bStart = parseDateAdvanced(b[startDateField]);
    
    if (!aStart && !bStart) return 0;
    if (!aStart) return 1;
    if (!bStart) return -1;
    
    // Prioritize current positions (those with present end dates)
    const aIsCurrent = isPresentTerm(a[endDateField]);
    const bIsCurrent = isPresentTerm(b[endDateField]);
    
    if (aIsCurrent && !bIsCurrent) return -1;
    if (!aIsCurrent && bIsCurrent) return 1;
    
    // For non-current positions, sort by start date (newest first)
    return bStart.getTime() - aStart.getTime();
  });
};

/**
 * Clears the date parse cache (useful for testing or memory management)
 */
export const clearDateCache = () => {
  dateParseCache.clear();
};

/**
 * Gets cache statistics (for performance monitoring)
 */
export const getCacheStats = () => {
  return {
    size: dateParseCache.size,
    maxSize: CACHE_MAX_SIZE,
    usage: (dateParseCache.size / CACHE_MAX_SIZE * 100).toFixed(1) + '%'
  };
};
