import { Palette } from 'lucide-react'
import { motion } from 'framer-motion'
import { Button } from './Button'
import { useTheme } from '../../context/ThemeContext'

export function ThemeToggle() {
  const { theme, toggle } = useTheme()
  const isGold = theme === 'gold'

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggle}
      aria-label="Toggle theme"
      className="h-9 w-9 p-0 rounded-full"
      title={isGold ? 'Switch to green theme' : 'Switch to gold theme'}
    >
      <motion.div
        initial={{ rotate: 0 }}
        animate={{ rotate: isGold ? 0 : 180 }}
        transition={{ duration: 0.3 }}
        className="w-5 h-5"
      >
        <Palette />
      </motion.div>
    </Button>
  )
}
