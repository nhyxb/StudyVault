import type { ReactNode } from 'react'
import Footer from '../components/Footer'
import Navbar from '../components/Navbar'
import styles from './MainLayout.module.css'

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <div className={styles.layout}>
      <Navbar />
      <main className={styles.main}>{children}</main>
      <Footer />
    </div>
  )
}
