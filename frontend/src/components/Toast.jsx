import { motion, AnimatePresence } from 'framer-motion'

export default function Toast({ message, type = 'success', onClose }) {
  if (!message) return null
  return (
    <AnimatePresence>
      <motion.div
        key={message}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.2 }}
        className={`toast toast-${type}`}
        onClick={onClose}
      >
        <p>{message}</p>
      </motion.div>
    </AnimatePresence>
  )
}
