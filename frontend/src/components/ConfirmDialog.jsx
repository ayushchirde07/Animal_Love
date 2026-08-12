import { motion, AnimatePresence } from 'framer-motion'

export default function ConfirmDialog({ open, title, description, confirmLabel, cancelLabel, onConfirm, onCancel }) {
  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="dialog-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="dialog-panel"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
          >
            <h3>{title}</h3>
            <p>{description}</p>
            <div className="dialog-actions">
              <button className="button button-secondary" type="button" onClick={onCancel}>
                {cancelLabel}
              </button>
              <button className="button button-primary" type="button" onClick={onConfirm}>
                {confirmLabel}
              </button>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
