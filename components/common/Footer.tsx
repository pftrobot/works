import Link from 'next/link'
import styles from './Footer.module.scss'

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <p className={styles.text}>&copy; 2025 Yiseul Oh. 기술 수사는 끝나지 않습니다.</p>
        <nav className={styles.links}>
          <Link href="/about">프로파일</Link>
          <Link href="/contact">제보</Link>
          <a href="https://github.com/yourname" target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
        </nav>
      </div>
    </footer>
  )
}

export default Footer
