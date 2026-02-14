import { motion } from 'framer-motion'
import { useDraggable } from '@dnd-kit/core'
import { ACTION_ICONS } from '../../blocks/BlockRegistry'

const BlockContainer = ({
  children,
  blockId,
  isActive,
  onClick,
  onAction,
  isDraggable = true,
  isPreview = false,
  className = ''
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
  } = useDraggable({
    id: blockId,
    disabled: !isDraggable,
  })

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      className={`
        relative group
        ${isActive && !isPreview ? 'ring-2 ring-blue-500 ring-offset-2' : ''}
        ${isDragging ? 'opacity-50' : ''}
        ${className}
      `}
      onClick={onClick}
      whileHover={!isPreview ? { scale: 1.02 } : {}}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      {/* Drag Handle */}
      {isDraggable && !isPreview && (
        <div
          {...attributes}
          {...listeners}
          className="absolute -left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <div className="bg-gray-200 rounded-md p-1 cursor-grab active:cursor-grabbing">
            <ACTION_ICONS.move_up className="w-4 h-4 text-gray-600" />
          </div>
        </div>
      )}

      {/* Block Content */}
      <div className={isPreview ? '' : 'block-container'}>
        {children}
      </div>

      {/* Action Buttons */}
      {!isPreview && (
        <div className="absolute -right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation()
              onAction?.('edit', blockId)
            }}
            className="bg-blue-500 text-white rounded-md p-1 hover:bg-blue-600 transition-colors"
          >
            <ACTION_ICONS.edit className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              onAction?.('delete', blockId)
            }}
            className="bg-red-500 text-white rounded-md p-1 hover:bg-red-600 transition-colors"
          >
            <ACTION_ICONS.delete className="w-4 h-4" />
          </button>
        </div>
      )}
    </motion.div>
  )
}

export default BlockContainer
