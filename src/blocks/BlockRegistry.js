import { 
  User, 
  Briefcase, 
  GraduationCap, 
  Code, 
  FolderOpen, 
  Award,
  Languages,
  Plus,
  Edit,
  Trash2,
  GripVertical
} from 'lucide-react'

export const BLOCK_TYPES = {
  PERSONAL_INFO: 'personal_info',
  EXPERIENCE: 'experience',
  EDUCATION: 'education',
  SKILLS: 'skills',
  PROJECTS: 'projects',
  CERTIFICATIONS: 'certifications',
  LANGUAGES: 'languages'
}

export const BLOCK_REGISTRY = {
  [BLOCK_TYPES.PERSONAL_INFO]: {
    id: BLOCK_TYPES.PERSONAL_INFO,
    name: 'Personal Information',
    icon: User,
    description: 'Your basic contact information and summary',
    component: 'PersonalInfoBlock',
    category: 'essential',
    required: true,
    defaultData: {
      fullName: '',
      email: '',
      phone: '',
      location: '',
      website: '',
      linkedin: '',
      github: '',
      summary: ''
    }
  },
  
  [BLOCK_TYPES.EXPERIENCE]: {
    id: BLOCK_TYPES.EXPERIENCE,
    name: 'Work Experience',
    icon: Briefcase,
    description: 'Your professional work history',
    component: 'ExperienceBlock',
    category: 'essential',
    required: false,
    isList: true,
    defaultData: {
      company: '',
      position: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      description: ''
    }
  },
  
  [BLOCK_TYPES.EDUCATION]: {
    id: BLOCK_TYPES.EDUCATION,
    name: 'Education',
    icon: GraduationCap,
    description: 'Your educational background',
    component: 'EducationBlock',
    category: 'essential',
    required: false,
    isList: true,
    defaultData: {
      institution: '',
      degree: '',
      field: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      gpa: '',
      achievements: []
    }
  },
  
  [BLOCK_TYPES.SKILLS]: {
    id: BLOCK_TYPES.SKILLS,
    name: 'Skills',
    icon: Code,
    description: 'Your technical and soft skills',
    component: 'SkillsBlock',
    category: 'essential',
    required: false,
    isList: true,
    defaultData: {
      name: '',
      category: 'technical',
      level: 'intermediate'
    }
  },
  
  [BLOCK_TYPES.PROJECTS]: {
    id: BLOCK_TYPES.PROJECTS,
    name: 'Projects',
    icon: FolderOpen,
    description: 'Your personal and professional projects',
    component: 'ProjectsBlock',
    category: 'showcase',
    required: false,
    isList: true,
    defaultData: {
      name: '',
      description: '',
      technologies: [],
      link: '',
      github: '',
      startDate: '',
      endDate: '',
      current: false
    }
  },
  
  [BLOCK_TYPES.CERTIFICATIONS]: {
    id: BLOCK_TYPES.CERTIFICATIONS,
    name: 'Certifications',
    icon: Award,
    description: 'Professional certifications and awards',
    component: 'CertificationsBlock',
    category: 'showcase',
    required: false,
    isList: true,
    defaultData: {
      name: '',
      issuer: '',
      date: '',
      expiryDate: '',
      credentialId: '',
      credentialUrl: ''
    }
  },
  
  [BLOCK_TYPES.LANGUAGES]: {
    id: BLOCK_TYPES.LANGUAGES,
    name: 'Languages',
    icon: Languages,
    description: 'Languages you speak',
    component: 'LanguagesBlock',
    category: 'additional',
    required: false,
    isList: true,
    defaultData: {
      language: '',
      proficiency: 'intermediate'
    }
  }
}

export const BLOCK_ACTIONS = {
  ADD: 'add',
  EDIT: 'edit',
  DELETE: 'delete',
  DUPLICATE: 'duplicate',
  MOVE_UP: 'move_up',
  MOVE_DOWN: 'move_down'
}

export const ACTION_ICONS = {
  [BLOCK_ACTIONS.ADD]: Plus,
  [BLOCK_ACTIONS.EDIT]: Edit,
  [BLOCK_ACTIONS.DELETE]: Trash2,
  [BLOCK_ACTIONS.MOVE_UP]: GripVertical,
  [BLOCK_ACTIONS.MOVE_DOWN]: GripVertical
}

export const SKILL_LEVELS = {
  BEGINNER: 'beginner',
  INTERMEDIATE: 'intermediate',
  ADVANCED: 'advanced',
  EXPERT: 'expert'
}

export const LANGUAGE_PROFICIENCY = {
  BASIC: 'basic',
  INTERMEDIATE: 'intermediate',
  ADVANCED: 'advanced',
  NATIVE: 'native'
}

export const SKILL_CATEGORIES = {
  TECHNICAL: 'technical',
  SOFT: 'soft',
  LANGUAGE: 'language',
  TOOL: 'tool'
}
