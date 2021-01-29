import styles from './Left.module.css'
import { h } from 'preact'
import lazy from '~/layout/lazy'

const Logo = lazy(() => import('./Logo'))

export default function Left() {
    return <div class={styles.left}>
        <Logo />
    </div>
}