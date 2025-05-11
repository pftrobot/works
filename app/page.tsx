import styles from './page.module.css'

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1>Welcome to Junie&apos;s Portfolio</h1>
        <p>I&apos;m a developer passionate about creating beautiful and functional web applications.</p>

        <div className={styles.ctas}>
          <a href="#projects" className={styles.primary}>
            View My Projects
          </a>
          <a href="#contact" className={styles.secondary}>
            Contact Me
          </a>
        </div>

        <section id="about">
          <h2>About Me</h2>
          <p>
            Hello! I&apos;m Junie, a web developer with experience in React, Next.js, and modern frontend
            technologies.
          </p>
        </section>

        <section id="projects">
          <h2>My Projects</h2>
          <ol>
            <li>Portfolio Website - A personal showcase built with Next.js</li>
            <li>Project 2 - Description coming soon</li>
            <li>Project 3 - Description coming soon</li>
          </ol>
        </section>

        <section id="contact">
          <h2>Get In Touch</h2>
          <p>Feel free to reach out to me for collaboration or questions.</p>
        </section>
      </main>

      <footer className={styles.footer}>
        <a href="https://github.com" target="_blank" rel="noopener noreferrer">
          GitHub
        </a>
        <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
          LinkedIn
        </a>
        <a href="mailto:example@example.com">Email</a>
      </footer>
    </div>
  )
}
