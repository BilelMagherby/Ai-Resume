import { create } from 'zustand'
import { sortByDateRange, validateDateRange, formatForATS, formatForDisplay } from '../utils/professionalDateUtils'

export const useCVStore = create((set, get) => ({
  // CV Data
  cvData: {
    personalInfo: {
      fullName: '',
      email: '',
      phone: '',
      professionalTitle: '',
      website: '',
      linkedin: '',
      github: '',
      summary: ''
    },
    education: [],
    experience: [],
    skills: [],
    projects: [],
    languages: [],
    certifications: []
  },

  // UI State
  selectedTemplate: 'CLASSIC',
  isPreviewMode: false,
  activeBlock: null,
  dateErrors: {}, // Store date validation errors

  // Actions
  updatePersonalInfo: (info) => set((state) => ({
    cvData: {
      ...state.cvData,
      personalInfo: { ...state.cvData.personalInfo, ...info }
    }
  })),

  addEducation: (education) => set((state) => ({
    cvData: {
      ...state.cvData,
      education: [...state.cvData.education, { ...education, id: Date.now() }]
    }
  })),

  updateEducation: (id, education) => {
    // Validate dates if provided
    const dateErrors = { ...get().dateErrors };
    const currentEducation = get().cvData.education.find(edu => edu.id === id);
    
    if (education.startDate !== undefined) {
      const validation = validateDateRange(education.startDate, education.endDate || currentEducation?.endDate);
      if (!validation.isValid) {
        dateErrors[`edu-${id}-start`] = validation.message;
      } else {
        delete dateErrors[`edu-${id}-start`];
        delete dateErrors[`edu-${id}-end`]; // Clear end date errors too since range is valid
      }
    }
    
    if (education.endDate !== undefined) {
      const validation = validateDateRange(education.startDate || currentEducation?.startDate, education.endDate);
      if (!validation.isValid) {
        dateErrors[`edu-${id}-end`] = validation.message;
      } else {
        delete dateErrors[`edu-${id}-end`];
        delete dateErrors[`edu-${id}-start`]; // Clear start date errors too since range is valid
      }
    }
    
    set((state) => ({
      cvData: {
        ...state.cvData,
        education: state.cvData.education.map(edu =>
          edu.id === id ? { ...edu, ...education } : edu
        )
      },
      dateErrors
    }));
  },

  removeEducation: (id) => set((state) => {
    // Clean up date errors for removed education
    const dateErrors = { ...state.dateErrors };
    delete dateErrors[`edu-${id}-start`];
    delete dateErrors[`edu-${id}-end`];
    
    return {
      cvData: {
        ...state.cvData,
        education: state.cvData.education.filter(edu => edu.id !== id)
      },
      dateErrors
    };
  }),

  addExperience: (experience) => set((state) => ({
    cvData: {
      ...state.cvData,
      experience: [...state.cvData.experience, { ...experience, id: Date.now() }]
    }
  })),

  updateExperience: (id, experience) => {
    // Validate dates if provided
    const dateErrors = { ...get().dateErrors };
    const currentExperience = get().cvData.experience.find(exp => exp.id === id);
    
    if (experience.startDate !== undefined) {
      const validation = validateDateRange(experience.startDate, experience.endDate || currentExperience?.endDate);
      if (!validation.isValid) {
        dateErrors[`exp-${id}-start`] = validation.message;
      } else {
        delete dateErrors[`exp-${id}-start`];
        delete dateErrors[`exp-${id}-end`]; // Clear end date errors too since range is valid
      }
    }
    
    if (experience.endDate !== undefined) {
      const validation = validateDateRange(experience.startDate || currentExperience?.startDate, experience.endDate);
      if (!validation.isValid) {
        dateErrors[`exp-${id}-end`] = validation.message;
      } else {
        delete dateErrors[`exp-${id}-end`];
        delete dateErrors[`exp-${id}-start`]; // Clear start date errors too since range is valid
      }
    }
    
    set((state) => ({
      cvData: {
        ...state.cvData,
        experience: state.cvData.experience.map(exp =>
          exp.id === id ? { ...exp, ...experience } : exp
        )
      },
      dateErrors
    }));
  },

  removeExperience: (id) => set((state) => {
    // Clean up date errors for removed experience
    const dateErrors = { ...state.dateErrors };
    delete dateErrors[`exp-${id}-start`];
    delete dateErrors[`exp-${id}-end`];
    
    return {
      cvData: {
        ...state.cvData,
        experience: state.cvData.experience.filter(exp => exp.id !== id)
      },
      dateErrors
    };
  }),

  addSkill: (skill) => set((state) => ({
    cvData: {
      ...state.cvData,
      skills: [...state.cvData.skills, { ...skill, id: Date.now() }]
    }
  })),

  updateSkill: (id, skill) => set((state) => ({
    cvData: {
      ...state.cvData,
      skills: state.cvData.skills.map(s =>
        s.id === id ? { ...s, ...skill } : s
      )
    }
  })),

  removeSkill: (id) => set((state) => ({
    cvData: {
      ...state.cvData,
      skills: state.cvData.skills.filter(skill => skill.id !== id)
    }
  })),

  addProject: (project) => set((state) => ({
    cvData: {
      ...state.cvData,
      projects: [...state.cvData.projects, { ...project, id: Date.now() }]
    }
  })),

  updateProject: (id, project) => set((state) => ({
    cvData: {
      ...state.cvData,
      projects: state.cvData.projects.map(proj =>
        proj.id === id ? { ...proj, ...project } : proj
      )
    }
  })),

  removeProject: (id) => set((state) => ({
    cvData: {
      ...state.cvData,
      projects: state.cvData.projects.filter(proj => proj.id !== id)
    }
  })),

  setSelectedTemplate: (template) => set({ selectedTemplate: template }),
  togglePreviewMode: () => set((state) => ({ isPreviewMode: !state.isPreviewMode })),
  setActiveBlock: (blockId) => set({ activeBlock: blockId }),

  // Getters for sorted data
  getSortedEducation: () => sortByDateRange(get().cvData.education),
  getSortedExperience: () => sortByDateRange(get().cvData.experience),

  // Formatters for ATS and display
  formatDateForATS: (dateString) => formatForATS(dateString),
  formatDateForDisplay: (dateString) => formatForDisplay(dateString),

  // Clear date errors
  clearDateErrors: () => set({ dateErrors: {} }),

  // Reset CV
  resetCV: () => set({
    cvData: {
      personalInfo: {
        fullName: '',
        email: '',
        phone: '',
        professionalTitle: '',
        website: '',
        linkedin: '',
        github: '',
        summary: ''
      },
      education: [],
      experience: [],
      skills: [],
      projects: [],
      languages: [],
      certifications: []
    },
    selectedTemplate: 'CLASSIC',
    isPreviewMode: false,
    activeBlock: null,
    dateErrors: {}
  })
}))
