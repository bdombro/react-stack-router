import { h } from 'preact'
import { useEffect, useState } from 'preact/hooks'

import { SidebarRightCtx } from '~/App.context'
import { ReactLogo } from '~/lib/icons'
import { useLocation } from '~/lib/router'
import styled from '~/lib/styled'
import useMedia from '~/lib/useMedia'

interface NavLinkProps { uri: string, text: string, isButton?: boolean }
type NavLinks = NavLinkProps[]

// TODO: Custom button for login/console
export default function Navbar({ sidebarLeft, navLinks }: { sidebarLeft?: boolean, navLinks: NavLinks}) {
	const isWide = useMedia('(min-width: 600px)')
	return <NavbarDiv>
		<div>
			{sidebarLeft && isWide && <LeftBurger href="#sidebar-toggle">Ξ</LeftBurger>}
			<LogoA href='/' class={sidebarLeft && isWide ? 'withBurger' : ''}>
				<div>
					{!sidebarLeft && <ReactLogo />}
					<div>Stacks!</div>
				</div>
			</LogoA>
		</div>

		<div>
			{isWide && navLinks.map(nl => nl.isButton ? <NavButton {...nl} /> : <NavLink {...nl} />)}
			<RightBurger />
		</div>

	</NavbarDiv>
}
const NavbarDiv = styled.div`
	:root {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: var(--header-height);
    background: var(--header-background);
    display: flex;
    flex-direction: row;
    justify-content: space-between;
		overflow: hidden;
	}
	:root > div {
		height: var(--header-height);
		display: flex;
		flex-direction: row;
	}
`
const LeftBurger = styled.a`
	:root {
    padding: 15px 0px;
    text-align: center;
    width: var(--sidebar-width-mini);
    box-sizing: border-box;
    color: white;
	}
	:root:hover {
			background: var(--primary);
	}
`
const LogoA = styled.a`
	:root {
		transform: rotate(20deg);
		margin: -66px 0 0 -4px;
		padding: 80px 9px;
	}
	:root > div {
		transform: rotate(-20deg);
    display: flex;
    flex-direction: row;
    align-items: center;
    box-sizing: border-box;
    font-weight: bold;
    padding-left: 2px;
	}
	:root:hover {
			background: var(--primary);
	}
	:root > div > div {
			color: white;
	}
	:root svg {
			color: hsl(var(--primary-h), var(--primary-s), 70%);
			margin: 0 6px 0 8px;
	}
	:root.withBurger {
		margin: -65px 0 0 0;
		padding: 80px 7px;
	}
`

function NavButton({ uri, text }: { uri: string, text: string }) {
	return (
		<NavButtonA href={uri}>
			{text}
		</NavButtonA>
	)
}
const NavButtonA = styled.a`
	:root {
    height: calc( var(--header-height) - 12px );
		margin: 6px 4px 6px 20px;
		border-radius: 2px;
    display: flex;
    flex-direction: row;
    align-items: center;
    box-sizing: border-box;
    padding: 0 10px;
    color: white;
		background: var(--primary);
	}
	:root:hover, .active {
			background: var(--primary-darker);
	}
`

function NavLink({ uri, text }: { uri: string, text: string }) {
	const location = useLocation()
	const [isSidebarActive] = SidebarRightCtx.use()
	const isActive = location.pathname.startsWith(uri)
	return (
		<NavLinkA class={isActive && !isSidebarActive ? 'active' : ''}
			href={uri + (isActive ? '?stack=reset' : '')}
		>
			<div>{text}</div>
		</NavLinkA>
	)
}
const NavLinkA = styled.a`
	:root {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-top: -56px;
    padding: 80px 14px;
    color: white;
		transform: rotate(20deg)
	}
	:root:hover, .active {
			background: var(--primary);
	}
	:root > div {
			transform: rotate(-20deg)
	}
`

/**
 * This is a little complex b/c it can have a diff state than sidebarRight b/c the sidebar can
 * also be activated in BottomNav components. The added complexity allows NavBurger to handle 
 * this gracefully.
 */
function RightBurger() {
	const [isLinkActive, setIsLinkActive] = useState(false)
	const [isSidebarActive, setIsSidebarActive] = SidebarRightCtx.use()
	useEffect(() => {
		if (!isSidebarActive) setIsLinkActive(false)
	}, [isSidebarActive])
	return (
		<NavBurgerA class={isLinkActive ? 'active' : ''}
			href={'#navburger-click'}
			onClick={() => {
				setIsLinkActive(isActive => {
					setIsSidebarActive(!isActive)
					return !isActive
				})
			}}
		>
			{isLinkActive ? 'X' : 'Ξ'}
		</NavBurgerA>
	)
}
const NavBurgerA = styled.a`
	:root {
    height: var(--header-height);
    display: flex;
    flex-direction: row;
    align-items: center;
    box-sizing: border-box;
    padding: 0 20px;
    color: white;
	}
	:root:hover, .active {
			background: var(--primary);
	}
`
