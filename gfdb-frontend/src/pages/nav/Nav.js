import './nav.scss'
import Penguin from '../../components/penguin/index'
import { Outlet, Link } from 'react-router-dom'
import { useEffect, useState, useRef } from 'react'
import hamburger from '../../resources/images/hamburger.svg'
import { THEME } from '../../resources/theme'

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
    const dropDownRef = useRef(null)
    const [constraints, setConstraints] = useState()
    const [showDropDown, setShowDropDown] = useState(false)
	const [iconRotation, setIconRotation] = useState()
    

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
        const checkIfClickedOutside = e => {
            if (showDropDown && dropDownRef?.current && !dropDownRef?.current?.contains(e.target)) {
                setIconRotation(80)
            }
        }
        document.addEventListener('click', checkIfClickedOutside)
      
        return () => {
            document.removeEventListener('click', checkIfClickedOutside)
        }
    }, [showDropDown])

	useEffect(() => {
		const interval = setInterval(() => {
			if (iconRotation === 90) {
				setShowDropDown(true)
				clearInterval(interval)
			}
			if (iconRotation === 0) {
				setShowDropDown(false)
				clearInterval(interval)
			}
			if (!showDropDown && iconRotation !== 90)
				setIconRotation(iconRotation => iconRotation+10)
			if (showDropDown && iconRotation !== 0)
				setIconRotation(iconRotation => iconRotation-10)
		}, 1)
		return () => clearInterval(interval)
	}, [iconRotation])



    return (
        <>
            <div 
                className='navbar'
                ref = {navRef}
                style = {{
                    width: '100%',
                    height: '100px',
                    overflow: 'hidden'
                }}
            >
            { constraints?.width >= 688 ?
                <NavList />
                : <>
                    { showDropDown &&
                        <>
                            <div
                                style = {{
                                    height: 'fit-content',
                                    maxHeight: 'fit-content',
                                    zIndex: 1,
                                    position: 'absolute',
                                    top: '100px',
                                    left: 0,
                                    width: '200px',
                                    backgroundColor: THEME.bgLight,
                                    borderRadius: '0px 0px 8px 8px',
                                    boxShadow: '0px 12px 24px rgba(0, 0, 0, 0.32)',
                                    overflow: 'hidden'
                                }}
                                ref = {dropDownRef}
                            >
                                <NavList 
        
                                />
                            </div>
                        </>
                    }
                    <div
                        style = {{
                            height: '100px',
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
                                padding: '20px',
                                transform: `rotate(${iconRotation}deg)`
                            }}
                            onClick = {() => {
                                if (!showDropDown)
									setIconRotation(10)
								else
									setIconRotation(80)
                            }}
                        />
                    </div>
                  </>
            }
            <Penguin />
            </div>

            <Outlet />
        </>
        

        
    )
}