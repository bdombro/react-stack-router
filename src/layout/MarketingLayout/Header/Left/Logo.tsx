import styles from  './Logo.module.css'
import { h } from 'preact';
import {ReactLogo} from '~/layout/icons'

export default function HeaderLogo() {
    return <a class={styles.logo} href='/'>
        <ReactLogo />
        <div>Stacks!</div>
    </a>
}