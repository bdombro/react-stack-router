import styles from './BottomNav.module.css'
import { h } from 'preact';
import { useLocation } from '~/lib/routing';
import { Paths } from '~/routes/router';
import { useState } from 'preact/hooks';

export default function Nav() {
    const { pathname } = useLocation()
    const [isMenuOpen, setMenuIsOpen] = useState(false)

    return <nav class={styles.nav}>
        <NavLink uri={Paths.AdminStatsStack} icon='Ø' isActive={isActive(Paths.AdminStatsStack) && !isMenuOpen} />
        <NavLink uri={Paths.AdminUserStack} icon='Ö' isActive={isActive(Paths.AdminUserStack) && !isMenuOpen} />
        <NavLink uri={Paths.AdminBlogStack} icon='Ó' isActive={isActive(Paths.AdminBlogStack) && !isMenuOpen} />
        <NavLinkMenu isOpen={isMenuOpen} setIsOpen={setMenuIsOpen} />
    </nav>

    function isActive(uri: string) {
        return pathname.startsWith(uri)
    }
}

function NavLink({ uri, icon, isActive }: { uri: string, icon: string, isActive: boolean }) {
    return (
        <a  class={`${styles.navlink} ${isActive && styles.active}`}
            href={uri + (isActive ? '?stack=reset' : '')}
        >
            <div>{icon}</div>
        </a>
    )
}

type SetIsOpenCallback = (prev: boolean) => boolean
function NavLinkMenu({ isOpen, setIsOpen }: { isOpen: boolean, setIsOpen: (prev: SetIsOpenCallback) => any}) {
    return (
        <a class={`${styles.navlink} ${isOpen && styles.active}`}
           href="#open-sidebar"
           onClick={onClick}
        >
            <div>{isOpen ? "X" : "Ξ"}</div>
        </a>
    )

    function onClick(e: any) {
        e.preventDefault()
        window.dispatchEvent(new Event('toggle-sidebar-right'))
        setIsOpen(isOpen => !isOpen)
    }
}