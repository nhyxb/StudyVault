import { Compass } from 'lucide-react'
import { Link } from '../lib/router'
import styles from './NotFoundPage.module.css'

export default function NotFoundPage() {
  return (
    <div className="container">
      <div className={styles.wrap}>
        <Compass size={44} aria-hidden="true" className={styles.icon} />
        <p className={styles.code}>404</p>
        <h1 className={styles.title}>页面走丢了</h1>
        <p className={styles.description}>这个地址不存在，或者内容已经被移动。</p>
        <Link to="/" className={styles.home}>
          回到首页
        </Link>
      </div>
    </div>
  )
}
