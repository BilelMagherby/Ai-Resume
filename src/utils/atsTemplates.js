// ATS-Optimized Resume Templates and Utilities

export const ATS_FONTS = [
  { value: 'Arial', label: 'Arial', atsScore: 100 },
  { value: 'Calibri', label: 'Calibri', atsScore: 100 },
  { value: 'Times New Roman', label: 'Times New Roman', atsScore: 100 },
  { value: 'Helvetica', label: 'Helvetica', atsScore: 95 },
  { value: 'Georgia', label: 'Georgia', atsScore: 90 }
];

export const ATS_FONT_SIZES = [
  { value: '10.5', label: '10.5pt', atsScore: 100 },
  { value: '11', label: '11pt', atsScore: 100 },
  { value: '12', label: '12pt', atsScore: 100 },
  { value: '10', label: '10pt', atsScore: 90 }
];

export const ATS_SECTION_HEADINGS = {
  PROFESSIONAL_SUMMARY: 'PROFESSIONAL SUMMARY',
  WORK_EXPERIENCE: 'WORK EXPERIENCE',
  SKILLS: 'SKILLS',
  EDUCATION: 'EDUCATION',
  CERTIFICATIONS: 'CERTIFICATIONS',
  PROJECTS: 'PROJECTS'
};

export const ACTION_VERBS = [
  'Developed', 'Built', 'Designed', 'Implemented', 'Optimized',
  'Managed', 'Created', 'Led', 'Coordinated', 'Achieved',
  'Improved', 'Increased', 'Reduced', 'Streamlined', 'Enhanced',
  'Launched', 'Maintained', 'Supported', 'Analyzed', 'Researched',
  'Documented', 'Tested', 'Deployed', 'Integrated', 'Automated'
];

export const ATS_TEMPLATES = {
  CLASSIC: {
    name: 'ATS Classic',
    description: 'Clean, single-column layout optimized for ATS',
    atsScore: 100,
    styles: {
      fontFamily: 'Calibri',
      fontSize: '11pt',
      lineHeight: '1.15',
      margins: '1in',
      columns: 1,
      noGraphics: true,
      noTables: true,
      noColors: true
    }
  },
  MODERN: {
    name: 'ATS Modern',
    description: 'Modern clean layout with ATS compatibility',
    atsScore: 95,
    styles: {
      fontFamily: 'Arial',
      fontSize: '11pt',
      lineHeight: '1.2',
      margins: '0.75in',
      columns: 1,
      noGraphics: true,
      noTables: true,
      minimalColors: true
    }
  },
  PROFESSIONAL: {
    name: 'ATS Professional',
    description: 'Professional format for experienced candidates',
    atsScore: 98,
    styles: {
      fontFamily: 'Times New Roman',
      fontSize: '12pt',
      lineHeight: '1.15',
      margins: '1in',
      columns: 1,
      noGraphics: true,
      noTables: true,
      noColors: true
    }
  }
};

export const ATS_VALIDATION_RULES = {
  // Content rules
  hasProfessionalSummary: true,
  hasWorkExperience: true,
  hasSkills: true,
  hasEducation: true,
  
  // Format rules
  usesStandardHeadings: true,
  usesActionVerbs: true,
  hasQuantifiableResults: false, // Recommended but not required
  
  // Layout rules
  singleColumn: true,
  noGraphics: true,
  noTables: true,
  noColors: true,
  standardFonts: true,
  appropriateFontSize: true,
  
  // Contact rules
  hasProfessionalContact: true,
  hasEmail: true,
  hasPhone: true,
  linkedInRecommended: false
};

export const ATS_TIPS = [
  {
    category: 'Format',
    tip: 'Use .docx or .pdf format for best ATS compatibility',
    priority: 'high'
  },
  {
    category: 'Layout',
    tip: 'Stick to single-column layout with no tables or graphics',
    priority: 'high'
  },
  {
    category: 'Fonts',
    tip: 'Use standard fonts like Arial, Calibri, or Times New Roman (10.5-12pt)',
    priority: 'high'
  },
  {
    category: 'Headings',
    tip: 'Use standard section headings like WORK EXPERIENCE, SKILLS, EDUCATION',
    priority: 'high'
  },
  {
    category: 'Content',
    tip: 'Start bullet points with action verbs (Developed, Built, Implemented)',
    priority: 'medium'
  },
  {
    category: 'Keywords',
    tip: 'Include keywords from the job description naturally',
    priority: 'high'
  },
  {
    category: 'Length',
    tip: 'Keep to 1 page if you have less than 5 years of experience',
    priority: 'medium'
  },
  {
    category: 'Contact',
    tip: 'Include professional contact info at the top (Name, City, Phone, Email)',
    priority: 'medium'
  }
];

export const validateATSCompliance = (cvData, template) => {
  const issues = [];
  let score = 100;
  
  // Check required sections
  if (!cvData.personalInfo.summary) {
    issues.push('Add a Professional Summary (3-4 lines at the top)');
    score -= 15;
  }
  
  if (cvData.experience.length === 0) {
    issues.push('Add Work Experience section');
    score -= 20;
  }
  
  if (cvData.skills.length === 0) {
    issues.push('Add Skills section');
    score -= 15;
  }
  
  if (cvData.education.length === 0) {
    issues.push('Add Education section');
    score -= 10;
  }
  
  // Check contact info
  if (!cvData.personalInfo.email) {
    issues.push('Add email address');
    score -= 10;
  }
  
  if (!cvData.personalInfo.phone) {
    issues.push('Add phone number');
    score -= 5;
  }
  
  // Check work experience formatting
  cvData.experience.forEach((exp, index) => {
    if (!exp.position || !exp.company) {
      issues.push(`Complete job title and company for experience #${index + 1}`);
      score -= 5;
    }
    
    if (!exp.startDate || !exp.endDate) {
      issues.push(`Add dates for experience #${index + 1}`);
      score -= 3;
    }
    
    if (!exp.description || exp.description.length < 20) {
      issues.push(`Add detailed description with action verbs for experience #${index + 1}`);
      score -= 5;
    }
  });
  
  // Check for action verbs
  const hasActionVerbs = cvData.experience.some(exp => {
    return ACTION_VERBS.some(verb => 
      exp.description.toLowerCase().includes(verb.toLowerCase())
    );
  });
  
  if (!hasActionVerbs && cvData.experience.length > 0) {
    issues.push('Use action verbs (Developed, Built, Implemented) in work experience');
    score -= 10;
  }
  
  return {
    score: Math.max(0, score),
    issues,
    isCompliant: score >= 80
  };
};

export const generateATSFileName = (fullName) => {
  const cleanName = fullName
    .replace(/[^a-zA-Z\s]/g, '')
    .replace(/\s+/g, '_')
    .toLowerCase();
  
  return `${cleanName}_resume.pdf`;
};
