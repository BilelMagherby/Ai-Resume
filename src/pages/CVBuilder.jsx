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
  Trash2
} from 'lucide-react'
import { useCVStore } from '../store/cvStore'
import { BLOCK_REGISTRY, BLOCK_TYPES } from '../blocks/BlockRegistry'
import BlockContainer from '../components/BlockBuilder/BlockContainer'
import DroppableArea from '../components/BlockBuilder/DroppableArea'

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
    removeProject
  } = useCVStore()
  const [activeBlock, setActiveBlock] = useState(null)
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false)

  const generateAISummary = () => {
    setIsGeneratingSummary(true)

    // Simulate AI thinking
    setTimeout(() => {
      const { experience, skills, personalInfo } = cvData

      const latestJob = personalInfo.professionalTitle || experience[0]?.position || "Professional"
      const years = experience.length * 2 // Purely heuristic
      const topSkills = skills.slice(0, 3).map(s => s.name).join(", ")

      let generatedText = ""
      if (experience.length > 0) {
        generatedText = `Results-driven ${latestJob} with ${years}+ years of experience in high-impact environments. `
        if (skills.length > 0) {
          generatedText += `Expertise in ${topSkills}, focused on driving efficiency and professional excellence. `
        }
        generatedText += `Proven track record of delivering high-quality solutions and leading successful initiatives.`
      } else if (skills.length > 0) {
        generatedText = `Highly motivated professional specializing in ${topSkills}. Committed to continuous learning and applying technical expertise to solve complex challenges in a fast-paced environment.`
      } else {
        generatedText = `Dedicated professional with a strong commitment to excellence and a passion for continuous improvement. Seeking to leverage unique skills and background to contribute to a forward-thinking team.`
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
          return (
            <div className="text-center space-y-3 mb-8">
              <h1 className="text-4xl font-bold text-black uppercase tracking-tight">{cvData.personalInfo.fullName}</h1>
              <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-gray-700 text-sm">
                {cvData.personalInfo.professionalTitle && <span className="font-bold text-gray-900">{cvData.personalInfo.professionalTitle}</span>}
                {cvData.personalInfo.professionalTitle && (cvData.personalInfo.email || cvData.personalInfo.phone) && <span className="text-gray-400">|</span>}
                {cvData.personalInfo.email && <span>{cvData.personalInfo.email}</span>}
                {cvData.personalInfo.email && cvData.personalInfo.phone && <span className="text-gray-400">|</span>}
                {cvData.personalInfo.phone && <span>{cvData.personalInfo.phone}</span>}
              </div>
              {cvData.personalInfo.summary && (
                <div className="mt-6 text-left border-t border-gray-100 pt-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Professional Summary</h3>
                  <p className="text-gray-800 text-sm leading-relaxed">{cvData.personalInfo.summary}</p>
                </div>
              )}
            </div>
          )
        }
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-900">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Full Name"
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={cvData.personalInfo.fullName}
                onChange={(e) => updatePersonalInfo({ fullName: e.target.value })}
              />
              <input
                type="email"
                placeholder="Email"
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={cvData.personalInfo.email}
                onChange={(e) => updatePersonalInfo({ email: e.target.value })}
              />
              <input
                type="tel"
                placeholder="Phone"
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={cvData.personalInfo.phone}
                onChange={(e) => updatePersonalInfo({ phone: e.target.value })}
              />
              <input
                type="text"
                placeholder="Professional Title (e.g. Senior Software Engineer)"
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={cvData.personalInfo.professionalTitle}
                onChange={(e) => updatePersonalInfo({ professionalTitle: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-gray-700">Professional Summary</label>
                <button
                  onClick={generateAISummary}
                  disabled={isGeneratingSummary}
                  className={`flex items-center space-x-1.5 text-xs font-bold px-3 py-1.5 rounded-full transition-all ${isGeneratingSummary
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                    }`}
                >
                  <Sparkles className={`w-3.5 h-3.5 ${isGeneratingSummary ? 'animate-pulse' : ''}`} />
                  <span>{isGeneratingSummary ? 'Generating...' : 'Generate with AI'}</span>
                </button>
              </div>
              <textarea
                placeholder="Professional Summary"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={4}
                value={cvData.personalInfo.summary}
                onChange={(e) => updatePersonalInfo({ summary: e.target.value })}
              />
            </div>
          </div>
        )

      case BLOCK_TYPES.EXPERIENCE:
        if (isPreviewMode) {
          return (
            <div className="space-y-6 mb-8">
              <h3 className="text-sm font-bold uppercase tracking-widest text-gray-900 border-b-2 border-gray-900 pb-1 mb-4">Work Experience</h3>
              {cvData.experience.map((exp, index) => (
                <div key={exp.id || index} className="space-y-2">
                  <div className="flex justify-between items-baseline">
                    <h4 className="font-bold text-base text-black">{exp.position}</h4>
                    <span className="text-gray-700 text-sm font-medium italic">{exp.startDate} — {exp.endDate}</span>
                  </div>
                  <div className="text-gray-800 font-bold text-sm tracking-wide">{exp.company}</div>
                  <div className="text-gray-700 text-sm leading-relaxed pl-4 border-l border-gray-200">
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
                    <input
                      type="text"
                      placeholder="Start Date"
                      className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={exp.startDate}
                      onChange={(e) => updateExperience(exp.id, { startDate: e.target.value })}
                    />
                    <input
                      type="text"
                      placeholder="End Date"
                      className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={exp.endDate}
                      onChange={(e) => updateExperience(exp.id, { endDate: e.target.value })}
                    />
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
          return (
            <div className="space-y-6 mb-8">
              <h3 className="text-sm font-bold uppercase tracking-widest text-gray-900 border-b-2 border-gray-900 pb-1 mb-4">Education</h3>
              {cvData.education.map((edu, index) => (
                <div key={edu.id || index} className="space-y-1">
                  <div className="flex justify-between items-baseline">
                    <h4 className="font-bold text-black text-sm">{edu.institution}</h4>
                    <span className="text-gray-700 text-sm font-medium italic">{edu.startDate} — {edu.endDate}</span>
                  </div>
                  <div className="text-gray-800 text-sm italic">{edu.degree} in {edu.field}</div>
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
                    <input
                      type="text"
                      placeholder="Start Date"
                      className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={edu.startDate}
                      onChange={(e) => updateEducation(edu.id, { startDate: e.target.value })}
                    />
                    <input
                      type="text"
                      placeholder="End Date"
                      className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={edu.endDate}
                      onChange={(e) => updateEducation(edu.id, { endDate: e.target.value })}
                    />
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
          return (
            <div className="space-y-4 mb-8">
              <h3 className="text-sm font-bold uppercase tracking-widest text-gray-900 border-b-2 border-gray-900 pb-1 mb-4">Skills</h3>
              <div className="text-gray-800 text-sm leading-relaxed">
                {cvData.skills.length > 0 ? (
                  <p>
                    {cvData.skills.map((skill, index) => (
                      <span key={skill.id || index}>
                        <span className="font-bold">{skill.name}</span>
                        <span className="text-gray-600"> ({skill.level})</span>
                        {index < cvData.skills.length - 1 ? <span className="mx-2">•</span> : ''}
                      </span>
                    ))}
                  </p>
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
          {/* Block Sidebar */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className={`lg:col-span-1 ${isPreviewMode ? 'hidden' : 'block'}`}
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
