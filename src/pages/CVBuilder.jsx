import { motion } from 'framer-motion'
import { useState } from 'react'
import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'
import {
  Save,
  Eye,
  Download,
  Plus,
  Settings,
  Sparkles,
  FileText,
  User,
  Briefcase,
  GraduationCap,
  Code,
  FolderOpen,
  Trash2,
  AlertCircle,
  CheckCircle,
  Info
} from 'lucide-react'
import { useCVStore } from '../store/cvStore'
import { BLOCK_REGISTRY, BLOCK_TYPES } from '../blocks/BlockRegistry'
import BlockContainer from '../components/BlockBuilder/BlockContainer'
import DroppableArea from '../components/BlockBuilder/DroppableArea'
import { ATS_TEMPLATES, ATS_SECTION_HEADINGS, validateATSCompliance, ATS_TIPS } from '../utils/atsTemplates'

import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable'

const CVBuilder = () => {
  const {
    cvData,
    updatePersonalInfo,
    isPreviewMode,
    togglePreviewMode,
    addExperience,
    addEducation,
    addSkill,
    addProject,
    updateExperience,
    removeExperience,
    updateEducation,
    removeEducation,
    updateSkill,
    removeSkill,
    updateProject,
    removeProject,
    getSortedEducation,
    getSortedExperience,
    dateErrors,
    selectedTemplate,
    setSelectedTemplate,
    formatDateForDisplay
  } = useCVStore()
  const [activeBlock, setActiveBlock] = useState(null)
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false)
  const [showATSTips, setShowATSTips] = useState(false)
  const [atsScore, setAtsScore] = useState(null)

  const generateAISummary = () => {
    setIsGeneratingSummary(true)

    // Simulate AI thinking
    setTimeout(() => {
      const { experience, skills, personalInfo } = cvData

      const jobTitle = personalInfo.professionalTitle || experience[0]?.position || "Professional"
      const years = experience.length > 0 ? Math.max(1, experience.length * 2) : 0
      const topSkills = skills.slice(0, 3).map(s => s.name).join(", ")
      
      // Job-specific keywords and descriptions
      const jobDescriptions = {
        'software engineer': 'developing scalable software solutions and implementing robust code architectures',
        'developer': 'building innovative applications and solving complex technical challenges',
        'designer': 'creating compelling visual experiences and user-centered design solutions',
        'manager': 'leading teams and driving strategic initiatives to achieve business objectives',
        'analyst': 'analyzing data and providing actionable insights to inform decision-making',
        'consultant': 'delivering expert guidance and implementing effective business solutions',
        'marketing': 'developing strategic campaigns and driving brand growth through innovative marketing',
        'sales': 'building client relationships and exceeding revenue targets through strategic selling',
        'teacher': 'educating and mentoring students to achieve their full potential',
        'writer': 'creating engaging content and communicating complex ideas clearly and effectively',
        'accountant': 'managing financial records and ensuring compliance with accounting standards',
        'nurse': 'providing compassionate patient care and ensuring optimal health outcomes',
        'engineer': 'designing and implementing innovative engineering solutions',
        'project manager': 'overseeing project execution and ensuring timely delivery of objectives',
        'data scientist': 'leveraging data analytics and machine learning to drive business insights',
        'product manager': 'defining product vision and leading cross-functional teams to deliver value',
        'frontend developer': 'building responsive user interfaces and delivering engaging web experiences',
        'backend developer': 'developing secure server-side systems and optimizing database performance',
        'full stack developer': 'designing and maintaining end-to-end web applications and scalable platforms',
        'mobile developer': 'creating high-performance mobile applications for iOS and Android platforms',
        'devops engineer': 'automating deployment pipelines and ensuring system reliability and scalability',
        'cloud engineer': 'designing and managing cloud infrastructure for high availability and performance',
        'system administrator': 'maintaining IT infrastructure and ensuring network security and stability',
        'qa engineer': 'testing software systems and ensuring high quality and reliability standards',
        'cybersecurity analyst': 'protecting systems and data through risk assessment and security strategies',
        'it support': 'providing technical assistance and resolving hardware and software issues',
        'data analyst': 'interpreting complex datasets and transforming insights into business strategies',
        'business intelligence analyst': 'developing dashboards and reports to support strategic decisions',
        'machine learning engineer': 'building intelligent systems and deploying predictive models',
        'ai engineer': 'developing artificial intelligence solutions to automate and optimize processes',
        'statistician': 'analyzing quantitative data and supporting evidence-based decision making',
        'research analyst': 'conducting market and industry research to identify growth opportunities',
        'ui designer': 'designing intuitive interfaces and enhancing user engagement',
        'ux designer': 'researching user behavior and optimizing product usability',
        'graphic designer': 'creating visual assets that strengthen brand identity',
        'motion designer': 'producing dynamic animations and engaging multimedia content',
        'video editor': 'editing high-quality video content to support storytelling and branding',
        'creative director': 'leading creative strategy and managing visual campaigns',
        'operations manager': 'optimizing internal processes and improving organizational efficiency',
        'business manager': 'managing daily operations and driving sustainable growth',
        'general manager': 'overseeing business performance and strategic planning',
        'team leader': 'coordinating team efforts and fostering high-performance culture',
        'program manager': 'managing multiple projects and aligning them with business goals',
        'strategy manager': 'developing long-term plans to enhance competitive advantage',
        'digital marketer': 'executing online campaigns and increasing digital brand visibility',
        'social media manager': 'managing social platforms and building engaged online communities',
        'content marketer': 'producing valuable content to attract and retain customers',
        'seo specialist': 'optimizing websites to improve search engine rankings and traffic',
        'brand manager': 'strengthening brand identity and positioning in competitive markets',
        'public relations specialist': 'managing corporate communication and media relations',
        'financial analyst': 'evaluating financial performance and supporting investment decisions',
        'auditor': 'reviewing financial records and ensuring regulatory compliance',
        'controller': 'overseeing accounting operations and financial reporting',
        'payroll specialist': 'managing employee compensation and benefits administration',
        'procurement officer': 'negotiating supplier contracts and managing purchasing activities',
        'administrative assistant': 'supporting office operations and improving workflow efficiency'
      }

      let generatedText = ""
      
      if (experience.length > 0) {
        // Look for job-specific description
        let jobSpecificDesc = ''
        const jobTitleLower = jobTitle.toLowerCase()
        
        for (const [key, desc] of Object.entries(jobDescriptions)) {
          if (jobTitleLower.includes(key)) {
            jobSpecificDesc = desc
            break
          }
        }
        
        // If no specific match, use a generic but relevant description
        if (!jobSpecificDesc) {
          jobSpecificDesc = 'delivering exceptional results and driving organizational success'
        }
        
        generatedText = `Results-driven ${jobTitle} with ${years}+ years of experience ${jobSpecificDesc}. `
        
        if (skills.length > 0) {
          generatedText += `Proficient in ${topSkills}, with a focus on innovation and continuous improvement. `
        }
        generatedText += `Proven ability to collaborate effectively with cross-functional teams and deliver high-impact solutions.`
        
      } else if (skills.length > 0) {
        // Entry-level with skills but no experience
        let jobSpecificDesc = ''
        const jobTitleLower = jobTitle.toLowerCase()
        
        for (const [key, desc] of Object.entries(jobDescriptions)) {
          if (jobTitleLower.includes(key)) {
            jobSpecificDesc = desc
            break
          }
        }
        
        if (!jobSpecificDesc) {
          jobSpecificDesc = 'contributing to team success and organizational goals'
        }
        
        generatedText = `Aspiring ${jobTitle} with strong foundation in ${topSkills}. `
        generatedText += `Passionate about ${jobSpecificDesc}. `
        generatedText += `Eager to apply technical skills and creative problem-solving abilities in a dynamic professional environment.`
        
      } else {
        // No experience or skills - still make it job-specific
        let jobSpecificDesc = ''
        const jobTitleLower = jobTitle.toLowerCase()
        
        for (const [key, desc] of Object.entries(jobDescriptions)) {
          if (jobTitleLower.includes(key)) {
            jobSpecificDesc = desc
            break
          }
        }
        
        if (!jobSpecificDesc) {
          jobSpecificDesc = 'excelling in professional roles and contributing to team success'
        }
        
        generatedText = `Motivated ${jobTitle} with a strong commitment to professional excellence and ${jobSpecificDesc}. `
        generatedText += `Bringing dedication, adaptability, and a collaborative mindset to contribute effectively to organizational goals.`
      }

      updatePersonalInfo({ summary: generatedText })
      setIsGeneratingSummary(false)
    }, 1500)
  }

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = (event) => {
    const { active, over } = event
    console.log('Drag end', active.id, over?.id)
    // TODO: Implement reordering logic here
  }

  const handleExportPDF = () => {
    // 1. Ensure we are in preview mode
    if (!isPreviewMode) {
      togglePreviewMode()
    }

    // 2. Small delay to allow UI to update and layout to settle
    setTimeout(() => {
      window.print()
    }, 500)
  }

  const checkATSScore = () => {
    const validation = validateATSCompliance(cvData, selectedTemplate)
    setAtsScore(validation)
    setShowATSTips(true)
  }

  const getATSTemplate = () => {
    return ATS_TEMPLATES[selectedTemplate] || ATS_TEMPLATES.CLASSIC
  }

  const blockTypes = [
    { type: BLOCK_TYPES.PERSONAL_INFO, icon: User, label: 'Personal Info' },
    { type: BLOCK_TYPES.EXPERIENCE, icon: Briefcase, label: 'Experience' },
    { type: BLOCK_TYPES.EDUCATION, icon: GraduationCap, label: 'Education' },
    { type: BLOCK_TYPES.SKILLS, icon: Code, label: 'Skills' },
    { type: BLOCK_TYPES.PROJECTS, icon: FolderOpen, label: 'Projects' }
  ]

  const handleBlockAction = (action, blockId) => {
    console.log(`Block action: ${action} for block: ${blockId}`)
  }

  const renderBlockContent = (blockType) => {
    switch (blockType) {
      case BLOCK_TYPES.PERSONAL_INFO:
        if (isPreviewMode) {
          const template = getATSTemplate()
          return (
            <div className="text-center space-y-3 mb-6" style={{ fontFamily: template.styles.fontFamily, fontSize: template.styles.fontSize }}>
              <h1 className="text-xl font-bold text-black uppercase tracking-tight">{cvData.personalInfo.fullName}</h1>
              <div className="space-y-1">
                {cvData.personalInfo.professionalTitle && (
                  <div className="font-bold text-black">{cvData.personalInfo.professionalTitle}</div>
                )}
                <div className="text-gray-700 text-sm">
                  {cvData.personalInfo.email && <span>{cvData.personalInfo.email}</span>}
                  {cvData.personalInfo.email && cvData.personalInfo.phone && <span className="mx-2">|</span>}
                  {cvData.personalInfo.phone && <span>{cvData.personalInfo.phone}</span>}
                </div>
              </div>
              {cvData.personalInfo.summary && (
                <div className="mt-4 text-left">
                  <h3 className="text-lg font-bold uppercase tracking-wider text-black border-b-2 border-black pb-1 mb-2">
                    {ATS_SECTION_HEADINGS.PROFESSIONAL_SUMMARY}
                  </h3>
                  <p className="text-gray-700 text-sm leading-relaxed">{cvData.personalInfo.summary}</p>
                </div>
              )}
            </div>
          )
        }
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Personal Information</h3>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <p className="text-sm text-blue-800">
                  This information will appear centered at the top of your resume
                </p>
              </div>
            </div>

            {/* Full Name - Most Important */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Full Name *</label>
              <input
                type="text"
                placeholder="John Doe"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg font-semibold"
                value={cvData.personalInfo.fullName}
                onChange={(e) => updatePersonalInfo({ fullName: e.target.value })}
              />
            </div>

            {/* Professional Title */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Professional Title (e.g. Senior Software Engineer)</label>
              <input
                type="text"
                placeholder="Senior Software Engineer"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={cvData.personalInfo.professionalTitle}
                onChange={(e) => updatePersonalInfo({ professionalTitle: e.target.value })}
              />
            </div>

            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Email *</label>
                <input
                  type="email"
                  placeholder="john@example.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={cvData.personalInfo.email}
                  onChange={(e) => updatePersonalInfo({ email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Phone *</label>
                <input
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={cvData.personalInfo.phone}
                  onChange={(e) => updatePersonalInfo({ phone: e.target.value })}
                />
              </div>
            </div>

            {/* Professional Summary */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="block text-sm font-medium text-gray-700">Professional Summary</label>
                <button
                  onClick={generateAISummary}
                  disabled={isGeneratingSummary}
                  className={`flex items-center space-x-1.5 text-xs font-bold px-3 py-1.5 rounded-full transition-all ${
                    isGeneratingSummary
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                    }`}
                >
                  <Sparkles className={`w-3.5 h-3.5 ${isGeneratingSummary ? 'animate-pulse' : ''}`} />
                  <span>{isGeneratingSummary ? 'Generating...' : 'Generate with AI'}</span>
                </button>
              </div>
              <textarea
                placeholder="A brief 3-4 line summary of your professional background and key achievements..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={4}
                value={cvData.personalInfo.summary}
                onChange={(e) => updatePersonalInfo({ summary: e.target.value })}
              />
              <p className="text-xs text-gray-500">
                Tip: Use action verbs and include your most relevant skills and achievements
              </p>
            </div>
          </div>
        )

      case BLOCK_TYPES.EXPERIENCE:
        if (isPreviewMode) {
          const sortedExperience = getSortedExperience()
          const template = getATSTemplate()
          return (
            <div className="space-y-4 mb-6" style={{ fontFamily: template.styles.fontFamily, fontSize: template.styles.fontSize }}>
              <h3 className="text-lg font-bold uppercase tracking-wider text-black border-b-2 border-black pb-1">
                {ATS_SECTION_HEADINGS.WORK_EXPERIENCE}
              </h3>
              {sortedExperience.map((exp, index) => (
                <div key={exp.id || index} className="space-y-1">
                  <div className="flex justify-between items-baseline">
                    <h4 className="font-bold text-black">{exp.position} – {exp.company}</h4>
                    <span className="text-gray-700 text-sm font-medium">
                      {formatDateForDisplay(exp.startDate)} – {formatDateForDisplay(exp.endDate)}
                    </span>
                  </div>
                  <div className="text-gray-700 text-sm leading-relaxed">
                    <p className="whitespace-pre-wrap">{exp.description}</p>
                  </div>
                </div>
              ))}
            </div>
          )
        }
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-900">Work Experience</h3>

            <div className="space-y-4">
              {cvData.experience.map((exp, index) => (
                <div key={exp.id || index} className="p-4 bg-white rounded-lg border border-gray-200 space-y-3">
                  <div className="flex justify-between items-start">
                    <h4 className="font-medium text-gray-700">Experience #{index + 1}</h4>
                    <button
                      onClick={() => removeExperience(exp.id)}
                      className="text-red-500 hover:text-red-700 p-1 hover:bg-red-50 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Job Title"
                      className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={exp.position}
                      onChange={(e) => updateExperience(exp.id, { position: e.target.value })}
                    />
                    <input
                      type="text"
                      placeholder="Company"
                      className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={exp.company}
                      onChange={(e) => updateExperience(exp.id, { company: e.target.value })}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                      <input
                        type="date"
                        className={`px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          dateErrors[`exp-${exp.id}-start`] 
                            ? 'border-red-500 bg-red-50' 
                            : 'border-gray-300'
                        }`}
                        value={exp.startDate || ''}
                        onChange={(e) => updateExperience(exp.id, { startDate: e.target.value })}
                      />
                      {dateErrors[`exp-${exp.id}-start`] && (
                        <p className="text-red-500 text-xs mt-1">{dateErrors[`exp-${exp.id}-start`]}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                      <select
                        className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-2 ${
                          dateErrors[`exp-${exp.id}-end`] 
                            ? 'border-red-500 bg-red-50' 
                            : 'border-gray-300'
                        }`}
                        value={exp.endDate === 'Present' ? 'Present' : 'date'}
                        onChange={(e) => {
                          if (e.target.value === 'Present') {
                            updateExperience(exp.id, { endDate: 'Present' });
                          } else {
                            updateExperience(exp.id, { endDate: '' });
                          }
                        }}
                      >
                        <option value="date">Specific Date</option>
                        <option value="Present">Present</option>
                      </select>
                      {exp.endDate !== 'Present' && (
                        <input
                          type="date"
                          className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                            dateErrors[`exp-${exp.id}-end`] 
                              ? 'border-red-500 bg-red-50' 
                              : 'border-gray-300'
                          }`}
                          value={exp.endDate || ''}
                          onChange={(e) => updateExperience(exp.id, { endDate: e.target.value })}
                        />
                      )}
                      {dateErrors[`exp-${exp.id}-end`] && (
                        <p className="text-red-500 text-xs mt-1">{dateErrors[`exp-${exp.id}-end`]}</p>
                      )}
                    </div>
                  </div>

                  <textarea
                    placeholder="Description"
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={exp.description}
                    onChange={(e) => updateExperience(exp.id, { description: e.target.value })}
                  />
                </div>
              ))}
            </div>

            <button
              onClick={() => addExperience(BLOCK_REGISTRY[BLOCK_TYPES.EXPERIENCE].defaultData)}
              className="flex items-center space-x-2 text-blue-600 hover:text-blue-500 font-medium"
            >
              <Plus className="w-4 h-4" />
              <span>Add Experience</span>
            </button>
            {cvData.experience.length === 0 && (
              <p className="text-gray-500 text-center py-4 text-sm">No experience added yet</p>
            )}
          </div>
        )

      case BLOCK_TYPES.EDUCATION:
        if (isPreviewMode) {
          const sortedEducation = getSortedEducation()
          const template = getATSTemplate()
          return (
            <div className="space-y-4 mb-6" style={{ fontFamily: template.styles.fontFamily, fontSize: template.styles.fontSize }}>
              <h3 className="text-lg font-bold uppercase tracking-wider text-black border-b-2 border-black pb-1">
                {ATS_SECTION_HEADINGS.EDUCATION}
              </h3>
              {sortedEducation.map((edu, index) => (
                <div key={edu.id || index} className="space-y-1">
                  <div className="font-bold text-black">{edu.degree} in {edu.field}</div>
                  <div className="text-gray-700">
                    {edu.institution} | {formatDateForDisplay(edu.startDate)} – {formatDateForDisplay(edu.endDate)}
                  </div>
                </div>
              ))}
            </div>
          )
        }
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-900">Education</h3>

            <div className="space-y-4">
              {cvData.education.map((edu, index) => (
                <div key={edu.id || index} className="p-4 bg-white rounded-lg border border-gray-200 space-y-3">
                  <div className="flex justify-between items-start">
                    <h4 className="font-medium text-gray-700">Education #{index + 1}</h4>
                    <button
                      onClick={() => removeEducation(edu.id)}
                      className="text-red-500 hover:text-red-700 p-1 hover:bg-red-50 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Institution/University"
                      className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={edu.institution}
                      onChange={(e) => updateEducation(edu.id, { institution: e.target.value })}
                    />
                    <input
                      type="text"
                      placeholder="Degree"
                      className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={edu.degree}
                      onChange={(e) => updateEducation(edu.id, { degree: e.target.value })}
                    />
                  </div>

                  <input
                    type="text"
                    placeholder="Field of Study"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={edu.field}
                    onChange={(e) => updateEducation(edu.id, { field: e.target.value })}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                      <input
                        type="date"
                        className={`px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          dateErrors[`edu-${edu.id}-start`] 
                            ? 'border-red-500 bg-red-50' 
                            : 'border-gray-300'
                        }`}
                        value={edu.startDate || ''}
                        onChange={(e) => updateEducation(edu.id, { startDate: e.target.value })}
                      />
                      {dateErrors[`edu-${edu.id}-start`] && (
                        <p className="text-red-500 text-xs mt-1">{dateErrors[`edu-${edu.id}-start`]}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                      <select
                        className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-2 ${
                          dateErrors[`edu-${edu.id}-end`] 
                            ? 'border-red-500 bg-red-50' 
                            : 'border-gray-300'
                        }`}
                        value={edu.endDate === 'Present' ? 'Present' : 'date'}
                        onChange={(e) => {
                          if (e.target.value === 'Present') {
                            updateEducation(edu.id, { endDate: 'Present' });
                          } else {
                            updateEducation(edu.id, { endDate: '' });
                          }
                        }}
                      >
                        <option value="date">Specific Date</option>
                        <option value="Present">Present</option>
                      </select>
                      {edu.endDate !== 'Present' && (
                        <input
                          type="date"
                          className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                            dateErrors[`edu-${edu.id}-end`] 
                              ? 'border-red-500 bg-red-50' 
                              : 'border-gray-300'
                          }`}
                          value={edu.endDate || ''}
                          onChange={(e) => updateEducation(edu.id, { endDate: e.target.value })}
                        />
                      )}
                      {dateErrors[`edu-${edu.id}-end`] && (
                        <p className="text-red-500 text-xs mt-1">{dateErrors[`edu-${edu.id}-end`]}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => addEducation(BLOCK_REGISTRY[BLOCK_TYPES.EDUCATION].defaultData)}
              className="flex items-center space-x-2 text-blue-600 hover:text-blue-500 font-medium"
            >
              <Plus className="w-4 h-4" />
              <span>Add Education</span>
            </button>
            {cvData.education.length === 0 && (
              <p className="text-gray-500 text-center py-4 text-sm">No education added yet</p>
            )}
          </div>
        )

      case BLOCK_TYPES.SKILLS:
        if (isPreviewMode) {
          const template = getATSTemplate()
          return (
            <div className="space-y-4 mb-6" style={{ fontFamily: template.styles.fontFamily, fontSize: template.styles.fontSize }}>
              <h3 className="text-lg font-bold uppercase tracking-wider text-black border-b-2 border-black pb-1">
                {ATS_SECTION_HEADINGS.SKILLS}
              </h3>
              <div className="text-gray-700 text-sm leading-relaxed">
                {cvData.skills.length > 0 ? (
                  <div className="space-y-1">
                    {cvData.skills.map((skill, index) => (
                      <span key={skill.id || index}>
                        <span className="font-medium">{skill.name}</span>
                        {index < cvData.skills.length - 1 ? <span className="mx-2">•</span> : ''}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 italic text-xs">No skills listed</p>
                )}
              </div>
            </div>
          )
        }
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-900">Skills</h3>

            <div className="space-y-4">
              {cvData.skills.map((skill, index) => (
                <div key={skill.id || index} className="p-3 bg-white rounded-lg border border-gray-200 flex items-center justify-between gap-4">
                  <div className="flex-1 grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Skill Name"
                      className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={skill.name}
                      onChange={(e) => updateSkill(skill.id, { name: e.target.value })}
                    />
                    <select
                      className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={skill.level}
                      onChange={(e) => updateSkill(skill.id, { level: e.target.value })}
                    >
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                      <option value="expert">Expert</option>
                    </select>
                  </div>
                  <button
                    onClick={() => removeSkill(skill.id)}
                    className="text-red-500 hover:text-red-700 p-1 hover:bg-red-50 rounded"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            <button
              onClick={() => addSkill(BLOCK_REGISTRY[BLOCK_TYPES.SKILLS].defaultData)}
              className="flex items-center space-x-2 text-blue-600 hover:text-blue-500 font-medium"
            >
              <Plus className="w-4 h-4" />
              <span>Add Skill</span>
            </button>
            {cvData.skills.length === 0 && (
              <p className="text-gray-500 text-center py-4 text-sm">No skills added yet</p>
            )}
          </div>
        )

      case BLOCK_TYPES.PROJECTS:
        if (isPreviewMode) {
          return (
            <div className="space-y-6 mb-8">
              <h3 className="text-sm font-bold uppercase tracking-widest text-gray-900 border-b-2 border-gray-900 pb-1 mb-4">Projects</h3>
              {cvData.projects.map((project, index) => (
                <div key={project.id || index} className="space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-black text-sm uppercase">{project.name}</h4>
                      {project.link && (
                        <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-gray-600 underline text-xs">
                          {project.link}
                        </a>
                      )}
                    </div>
                  </div>
                  <div className="text-gray-700 text-sm leading-relaxed pl-4 border-l border-gray-200">
                    <p className="whitespace-pre-wrap">{project.description}</p>
                    {project.technologies && (
                      <p className="mt-2 text-xs font-bold text-gray-600 italic">
                        Technologies: {Array.isArray(project.technologies) ? project.technologies.join(', ') : project.technologies}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )
        }
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-900">Projects</h3>

            <div className="space-y-4">
              {cvData.projects.map((project, index) => (
                <div key={project.id || index} className="p-4 bg-white rounded-lg border border-gray-200 space-y-3">
                  <div className="flex justify-between items-start">
                    <h4 className="font-medium text-gray-700">Project #{index + 1}</h4>
                    <button
                      onClick={() => removeProject(project.id)}
                      className="text-red-500 hover:text-red-700 p-1 hover:bg-red-50 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <input
                    type="text"
                    placeholder="Project Name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={project.name}
                    onChange={(e) => updateProject(project.id, { name: e.target.value })}
                  />

                  <textarea
                    placeholder="Project Description"
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={project.description}
                    onChange={(e) => updateProject(project.id, { description: e.target.value })}
                  />

                  <input
                    type="text"
                    placeholder="Technologies (comma separated)"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={Array.isArray(project.technologies) ? project.technologies.join(', ') : project.technologies}
                    onChange={(e) => updateProject(project.id, { technologies: e.target.value.split(',').map(t => t.trim()) })}
                  />

                  <input
                    type="text"
                    placeholder="Project Link"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={project.link}
                    onChange={(e) => updateProject(project.id, { link: e.target.value })}
                  />
                </div>
              ))}
            </div>

            <button
              onClick={() => addProject(BLOCK_REGISTRY[BLOCK_TYPES.PROJECTS].defaultData)}
              className="flex items-center space-x-2 text-blue-600 hover:text-blue-500 font-medium"
            >
              <Plus className="w-4 h-4" />
              <span>Add Project</span>
            </button>
            {cvData.projects.length === 0 && (
              <p className="text-gray-500 text-center py-4 text-sm">No projects added yet</p>
            )}
          </div>
        )

      default:
        return <div>Unknown block type</div>
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white shadow-sm border-b border-gray-200"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg" />
              <span className="text-xl font-bold gradient-text">CV Builder</span>
            </div>

            <div className="flex items-center space-x-4">
              <button className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors">
                <Sparkles className="w-4 h-4" />
                <span>AI Optimize</span>
              </button>

              <button
                onClick={checkATSScore}
                className="flex items-center space-x-2 px-4 py-2 text-blue-600 hover:text-blue-500 transition-colors"
              >
                <CheckCircle className="w-4 h-4" />
                <span>ATS Check</span>
              </button>

              <select
                value={selectedTemplate}
                onChange={(e) => setSelectedTemplate(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              >
                {Object.entries(ATS_TEMPLATES).map(([key, template]) => (
                  <option key={key} value={key}>
                    {template.name} ({template.atsScore}% ATS)
                  </option>
                ))}
              </select>

              <button
                onClick={togglePreviewMode}
                className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <Eye className="w-4 h-4" />
                <span>{isPreviewMode ? 'Edit' : 'Preview'}</span>
              </button>

              <button className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all">
                <Save className="w-4 h-4" />
                <span>Save</span>
              </button>

              <button
                onClick={handleExportPDF}
                className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Export PDF</span>
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* ATS Tips Sidebar */}
          {showATSTips && atsScore && (
            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-1"
            >
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">ATS Score</h3>
                  <button
                    onClick={() => setShowATSTips(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ×
                  </button>
                </div>
                
                <div className={`text-center mb-4 p-3 rounded-lg ${
                  atsScore.isCompliant ? 'bg-green-50' : 'bg-yellow-50'
                }`}>
                  <div className={`text-2xl font-bold ${
                    atsScore.isCompliant ? 'text-green-600' : 'text-yellow-600'
                  }`}>
                    {atsScore.score}%
                  </div>
                  <div className={`text-sm ${
                    atsScore.isCompliant ? 'text-green-700' : 'text-yellow-700'
                  }`}>
                    {atsScore.isCompliant ? 'ATS Ready' : 'Needs Improvement'}
                  </div>
                </div>

                {atsScore.issues.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-700 text-sm">Recommendations:</h4>
                    {atsScore.issues.map((issue, index) => (
                      <div key={index} className="flex items-start space-x-2 text-sm">
                        <AlertCircle className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-600">{issue}</span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <h4 className="font-medium text-gray-700 text-sm mb-2">Quick Tips:</h4>
                  <div className="space-y-2">
                    {ATS_TIPS.slice(0, 3).map((tip, index) => (
                      <div key={index} className="flex items-start space-x-2 text-sm">
                        <Info className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <span className="font-medium text-gray-700">{tip.category}:</span>
                          <span className="text-gray-600 ml-1">{tip.tip}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Block Sidebar */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className={`${isPreviewMode || showATSTips ? 'hidden' : 'block'} ${showATSTips ? '' : 'lg:col-span-1'}`}
          >
            <div className="block-container">
              <h3 className="font-semibold text-gray-900 mb-4">Add Blocks</h3>
              <div className="space-y-2">
                {blockTypes.map((block) => (
                  <button
                    key={block.type}
                    onClick={() => {
                      switch (block.type) {
                        case BLOCK_TYPES.EXPERIENCE: addExperience(BLOCK_REGISTRY[BLOCK_TYPES.EXPERIENCE].defaultData); break;
                        case BLOCK_TYPES.EDUCATION: addEducation(BLOCK_REGISTRY[BLOCK_TYPES.EDUCATION].defaultData); break;
                        case BLOCK_TYPES.SKILLS: addSkill(BLOCK_REGISTRY[BLOCK_TYPES.SKILLS].defaultData); break;
                        case BLOCK_TYPES.PROJECTS: addProject(BLOCK_REGISTRY[BLOCK_TYPES.PROJECTS].defaultData); break;
                        default: break;
                      }
                    }}
                    className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <block.icon className="w-5 h-5 text-gray-600" />
                    <span className="text-gray-700">{block.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Main Editor */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className={`transition-all duration-500 ${isPreviewMode ? 'lg:col-span-4 flex justify-center' : 'lg:col-span-3'}`}
          >
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <DroppableArea
                id="cv-editor"
                className={`transition-all duration-500 ${isPreviewMode ? 'w-[210mm] min-h-[297mm] shadow-2xl mb-20 bg-white p-[20mm]' : 'min-h-[800px]'}`}
                isPreview={isPreviewMode}
              >
                <div className="space-y-6">
                  {/* Personal Info Block */}
                  <BlockContainer
                    blockId="personal-info"
                    isActive={activeBlock === 'personal-info'}
                    onClick={() => setActiveBlock('personal-info')}
                    onAction={handleBlockAction}
                    isDraggable={!isPreviewMode}
                    isPreview={isPreviewMode}
                  >
                    {renderBlockContent(BLOCK_TYPES.PERSONAL_INFO)}
                  </BlockContainer>

                  {/* Experience Block */}
                  <BlockContainer
                    blockId="experience"
                    isActive={activeBlock === 'experience'}
                    onClick={() => setActiveBlock('experience')}
                    onAction={handleBlockAction}
                    isDraggable={!isPreviewMode}
                    isPreview={isPreviewMode}
                  >
                    {renderBlockContent(BLOCK_TYPES.EXPERIENCE)}
                  </BlockContainer>

                  {/* Education Block */}
                  <BlockContainer
                    blockId="education"
                    isActive={activeBlock === 'education'}
                    onClick={() => setActiveBlock('education')}
                    onAction={handleBlockAction}
                    isDraggable={!isPreviewMode}
                    isPreview={isPreviewMode}
                  >
                    {renderBlockContent(BLOCK_TYPES.EDUCATION)}
                  </BlockContainer>

                  {/* Skills Block */}
                  <BlockContainer
                    blockId="skills"
                    isActive={activeBlock === 'skills'}
                    onClick={() => setActiveBlock('skills')}
                    onAction={handleBlockAction}
                    isDraggable={!isPreviewMode}
                    isPreview={isPreviewMode}
                  >
                    {renderBlockContent(BLOCK_TYPES.SKILLS)}
                  </BlockContainer>

                  {/* Projects Block */}
                  <BlockContainer
                    blockId="projects"
                    isActive={activeBlock === 'projects'}
                    onClick={() => setActiveBlock('projects')}
                    onAction={handleBlockAction}
                    isDraggable={!isPreviewMode}
                    isPreview={isPreviewMode}
                  >
                    {renderBlockContent(BLOCK_TYPES.PROJECTS)}
                  </BlockContainer>
                </div>
              </DroppableArea>
            </DndContext>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default CVBuilder
