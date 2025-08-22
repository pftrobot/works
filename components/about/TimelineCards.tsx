import { motion } from 'framer-motion'
import { TimelineItem } from 'types'
import styles from './TimelineCards.module.scss'

interface TimelineCardsProps {
  timelines: TimelineItem[]
}

export default function TimelineCards({ timelines }: TimelineCardsProps) {
  return (
    <div className={styles.timelineWrap}>
      {timelines?.map((item, index) => (
        <motion.div
          key={item.id}
          className={styles.card}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          viewport={{ once: true, amount: 0.3 }}
        >
          <div className={styles.year}>{item.year}</div>
          <div className={styles.text}>{item.text}</div>
        </motion.div>
      ))}
    </div>
  )
}
