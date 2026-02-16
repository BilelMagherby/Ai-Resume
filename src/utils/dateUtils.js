// Utility functions for date parsing and sorting

/**
 * Validates if a date is not in the future
 */
export const validateDate = (dateString) => {
  if (!dateString) return { isValid: true, error: '' };
  
  // Handle "Present" or current dates
  if (dateString.toLowerCase().includes('present') || dateString.toLowerCase().includes('current')) {
    return { isValid: true, error: '' };
  }
  
  const parsedDate = parseDate(dateString);
  const now = new Date();
  
  // Check if date is valid (not default 1970 date)
  if (parsedDate.getTime() === 0) {
    return { 
      isValid: false, 
      error: 'Invalid date format' 
    };
  }
  
  // Extract year from input for additional validation
  const yearMatch = dateString.match(/(\d{4})/);
  if (yearMatch) {
    const inputYear = parseInt(yearMatch[1]);
    const currentYear = now.getFullYear();
    
    // If input year is clearly in the future, reject it
    if (inputYear > currentYear + 1) { // Allow 1 year buffer for current year transitions
      return { 
        isValid: false, 
        error: `Year ${inputYear} is too far in the future` 
      };
    }
    
    // If input year is clearly too old, warn about it
    if (inputYear < 1900) {
      return { 
        isValid: false, 
        error: 'Year cannot be before 1900' 
      };
    }
  }
  
  // Check if date is in the future (with a small buffer for timezone differences)
  const oneDayFromNow = new Date(now.getTime() + (24 * 60 * 60 * 1000));
  if (parsedDate > oneDayFromNow) {
    return { 
      isValid: false, 
      error: 'Date cannot be in the future' 
    };
  }
  
  return { isValid: true, error: '' };
};

/**
 * Parses a date string and returns a Date object
 * Handles various date formats like "2020", "2020-2021", "Sep 2020", "September 2020", "2020-09", "12-12-2025", etc.
 */
export const parseDate = (dateString) => {
  if (!dateString) return new Date(0); // Return earliest date if empty
  
  // Handle "Present" or current dates
  if (dateString.toLowerCase().includes('present') || dateString.toLowerCase().includes('current')) {
    return new Date();
  }
  
  // Handle year ranges like "2020-2021" - take the start year
  if (dateString.includes('-') && dateString.match(/^\d{4}-\d{4}$/)) {
    const parts = dateString.split('-');
    return new Date(parseInt(parts[0]), 0, 1);
  }
  
  // Handle DD-MM-YYYY format (common in many regions)
  const dayMonthYearMatch = dateString.match(/^(\d{1,2})-(\d{1,2})-(\d{4})$/);
  if (dayMonthYearMatch) {
    const day = parseInt(dayMonthYearMatch[1]);
    const month = parseInt(dayMonthYearMatch[2]) - 1; // JS months are 0-indexed
    const year = parseInt(dayMonthYearMatch[3]);
    // Use UTC to avoid timezone issues
    return new Date(Date.UTC(year, month, day));
  }
  
  // Handle YYYY-MM-DD format
  const yearMonthDayMatch = dateString.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  if (yearMonthDayMatch) {
    const year = parseInt(yearMonthDayMatch[1]);
    const month = parseInt(yearMonthDayMatch[2]) - 1; // JS months are 0-indexed
    const day = parseInt(yearMonthDayMatch[3]);
    return new Date(year, month, day);
  }
  
  // Handle year only
  if (/^\d{4}$/.test(dateString)) {
    return new Date(parseInt(dateString), 0, 1);
  }
  
  // Handle month year formats like "Sep 2020", "September 2020"
  const monthYearMatch = dateString.match(/^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{4})$/i);
  if (monthYearMatch) {
    const monthNames = {
      jan: 0, january: 0,
      feb: 1, february: 1,
      mar: 2, march: 2,
      apr: 3, april: 3,
      may: 4,
      jun: 5, june: 5,
      jul: 6, july: 6,
      aug: 7, august: 7,
      sep: 8, september: 8,
      oct: 9, october: 9,
      nov: 10, november: 10,
      dec: 11, december: 11
    };
    const month = monthNames[monthYearMatch[1].toLowerCase()];
    const year = parseInt(monthYearMatch[2]);
    return new Date(year, month, 1);
  }
  
  // Handle ISO date format "2020-09"
  const isoMatch = dateString.match(/^(\d{4})-(\d{2})$/);
  if (isoMatch) {
    const year = parseInt(isoMatch[1]);
    const month = parseInt(isoMatch[2]) - 1; // JS months are 0-indexed
    return new Date(year, month, 1);
  }
  
  // Try generic date parsing as fallback
  const parsed = new Date(dateString);
  return isNaN(parsed.getTime()) ? new Date(0) : parsed;
};

/**
 * Sorts items by start date from newest to oldest
 */
export const sortByStartDate = (items) => {
  return [...items].sort((a, b) => {
    const dateA = parseDate(a.startDate);
    const dateB = parseDate(b.startDate);
    return dateB.getTime() - dateA.getTime(); // Reversed for newest to oldest
  });
};
