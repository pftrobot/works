import styles from './TechTagList.module.scss'

interface Props {
  tech: string[]
}

export default function TechTagList({ tech }: Props) {
  if (!tech || tech.length === 0) return null

  return (
    <div className={styles.techBlock}>
      <strong className={styles.label}>사용 기술</strong>
      <ul className={styles.list}>
        {tech.map((item) => (
          <li key={item} className={styles.tag}>
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}
