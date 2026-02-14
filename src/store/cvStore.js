import { create } from 'zustand'

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
  selectedTemplate: 'modern',
  isPreviewMode: false,
  activeBlock: null,

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

  updateEducation: (id, education) => set((state) => ({
    cvData: {
      ...state.cvData,
      education: state.cvData.education.map(edu =>
        edu.id === id ? { ...edu, ...education } : edu
      )
    }
  })),

  removeEducation: (id) => set((state) => ({
    cvData: {
      ...state.cvData,
      education: state.cvData.education.filter(edu => edu.id !== id)
    }
  })),

  addExperience: (experience) => set((state) => ({
    cvData: {
      ...state.cvData,
      experience: [...state.cvData.experience, { ...experience, id: Date.now() }]
    }
  })),

  updateExperience: (id, experience) => set((state) => ({
    cvData: {
      ...state.cvData,
      experience: state.cvData.experience.map(exp =>
        exp.id === id ? { ...exp, ...experience } : exp
      )
    }
  })),

  removeExperience: (id) => set((state) => ({
    cvData: {
      ...state.cvData,
      experience: state.cvData.experience.filter(exp => exp.id !== id)
    }
  })),

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
    selectedTemplate: 'modern',
    isPreviewMode: false,
    activeBlock: null
  })
}))
