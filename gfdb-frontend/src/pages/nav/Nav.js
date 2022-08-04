import './nav.scss'
import Penguin from '../../components/penguin/index'
import { Outlet, Link } from 'react-router-dom'
import { useEffect, useState, useRef } from 'react'
import hamburger from '../../images/hamburger.svg'

const NavList = () => {
    return (
        <nav 
            className='stroke'
        >
            <ul style={{
                    listStyleType: 'none'
                }}
            >
                <li>
                    <Link to = '/'>Home</Link>
                </li>
                <li>
                    <Link to = '/work-experience'>Work Experience</Link>
                </li>
                <li>
                    <Link to = '/education'>Education</Link>
                </li>
                <li>
                    <Link to = '/games'>Games</Link>
                </li>
            </ul>
        </nav>
    )
}

export default function Nav() {

    const navRef = useRef(null)
    const [constraints, setConstraints] = useState()
    

    const handleResize = () => {setConstraints(navRef.current.getBoundingClientRect())}

    useEffect(() => {
        setConstraints(navRef.current.getBoundingClientRect())
        window.addEventListener('resize', handleResize)
    }, [])

	useEffect(() => {
		return () => {
			window.removeEventListener('resize', handleResize)
		}
	}, [])

    useEffect(() => {
        console.log('width', constraints?.width)
    }, [constraints])

    return (
        <>
            <div className='navbar' ref = {navRef}>
            { constraints?.width >= 688 ?
                <NavList />
                :<div
                    style = {{
                        display: 'flex'
                    }}
                >
                    <img
                        src = {hamburger}
                        style = {{
                            cursor: 'pointer',
                            height: '42px',
                            width: '42px',
                            position: 'fixed',
                            zIndex: 1,
                            padding: '20px'
                        }}
                        onClick = {() => {

                        }}
                    />
                </div>
            }
            <Penguin />
            </div>

            <Outlet />
        </>
        

        
    )
}