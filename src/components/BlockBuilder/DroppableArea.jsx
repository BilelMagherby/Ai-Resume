import { useDroppable } from '@dnd-kit/core'
import { motion } from 'framer-motion'

const DroppableArea = ({
  children,
  id,
  className = '',
  isEmpty = false,
  isPreview = false,
  onDrop
}) => {
  const { isOver, setNodeRef } = useDroppable({
    id,
  })

  const borderStyles = isPreview
    ? 'border-transparent bg-transparent shadow-none'
    : isOver
      ? 'border-blue-500 bg-blue-50 scale-105'
      : 'border-gray-300 bg-gray-50'

  return (
    <motion.div
      id={id}
      ref={setNodeRef}
      className={`
        relative min-h-[100px] rounded-lg border-2 border-dashed
        transition-all duration-300
        ${borderStyles}
        ${isEmpty && !isPreview ? 'flex items-center justify-center' : ''}
        ${className}
      `}
      whileHover={isEmpty && !isPreview ? { scale: 1.02 } : {}}
    >
      {isEmpty && !isPreview && (
        <div className="text-center text-gray-500">
          <p className="text-lg font-medium mb-2">Drop blocks here</p>
          <p className="text-sm">or click to add content</p>
        </div>
      )}
      {children}

      {/* Drop Indicator */}
      {isOver && !isPreview && (
        <motion.div
          className="absolute inset-0 bg-blue-100 rounded-lg pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          exit={{ opacity: 0 }}
        />
      )}
    </motion.div>
  )
}

export default DroppableArea
