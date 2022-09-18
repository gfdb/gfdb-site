import { useSpring, animated as a } from 'react-spring'
import { useEffect, useState, useRef } from 'react'
import { Outlet, Link } from 'react-router-dom'
import './nav.scss'
import Penguin from '../../components/penguin/index'
import hamburger from '../../resources/images/hamburger.svg'
import { THEME } from '../../resources/theme'
import { use_event } from '../../components/hooks'

const NavList = ({
    onClick = () => {}
}) => {
    return (
        <nav
            className='stroke'
        >
            <ul style={{
                    listStyleType: 'none'
                }}
            >
                <li>
                    <Link to = '/' onClick = {onClick}>Home</Link>
                </li>
                <li>
                    <Link to = '/work-experience' onClick = {onClick}>Work Experience</Link>
                </li>
                <li>
                    <Link to = '/education' onClick = {onClick}>Education</Link>
                </li>
                {/* <li>
                    <Link to = '/projects' onClick = {onClick}>Projects</Link>
                </li>
                <li>
                    <Link to = '/games' onClick = {onClick}>Games</Link>
                </li> */}
            </ul>
        </nav>
    )
}

export default function Nav() {

    const navRef = useRef(null)
    const dropDownRef = useRef(null)
    const [constraints, setConstraints] = useState()
    const [showDropDown, setShowDropDown] = useState(false)
    const [scrollHeight, setScrollHeight] = useState(0)
    const [dropDownHeight, setDropDownHeight] = useState(0)


    const rotateAnimation = useSpring({
        to: {transform: (showDropDown ? 'rotate(90deg)' : 'rotate(0deg)')},
        config: {mass: 1, tension: 250, friction: 16}
    })

    const dropDownAnimation = useSpring({
        to: {height: (showDropDown ? dropDownHeight + 30 : 0)},
	    config: {mass: 1, tension: 200, friction: 30}
    })

    const handleDropDownChange = () => {
		setDropDownHeight(dropDownRef?.current?.clientHeight)
	}

    const handleResize = () => {setConstraints(navRef.current.getBoundingClientRect())}

    const handleScroll = () => {
        setScrollHeight(window.scrollY)
    }

    const checkIfClickedOutside = (e) => {
        if (showDropDown && dropDownRef?.current && !dropDownRef?.current?.contains(e.target)) {
            console.log('toggle in check if clicked outside')
            setShowDropDown(showDropDown => !showDropDown)
        }
    }

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
        window.addEventListener('scroll', handleScroll)
    }, [])

	useEffect(() => {
		return () => {
			window.removeEventListener('scroll', handleScroll)
		}
	}, [])

    useEffect(() => {
        document.addEventListener('click', checkIfClickedOutside)
      
        return () => {
            document.removeEventListener('click', checkIfClickedOutside)
        }
    }, [showDropDown])

    useEffect(() => {
        handleDropDownChange()
        dropDownRef?.current?.addEventListener('resize', handleDropDownChange)
    }, [dropDownHeight])

    useEffect(() => {
		return () => {
			dropDownRef?.current?.removeEventListener('resize', handleDropDownChange)
		}
	}, [dropDownHeight])

    use_event('keydown', (e) => {if (e.key === 'Escape') {setShowDropDown(false)}})

    return (
        <>
            <div 
                className='navbar'
                ref = {navRef}
                style = {{
                    width: '100%', 
                    height: '100px',
                    overflow: 'hidden',
                    boxShadow: '0px 12px 24px rgba(0, 0, 0, 0.32)'
                }}
            >
            { constraints?.width >= 688 ?
                <NavList />
                : <>
                    <a.div
                        style = {{
                            zIndex: 1,
                            position: 'absolute',
                            top: `${(scrollHeight < 100 ? 100 : scrollHeight )}px`,
                            left: 0,
                            width: '200px',
                            backgroundColor: THEME.bgLight,
                            borderRadius: '0px 0px 8px 8px',
                            boxShadow: '0px 12px 24px rgba(0, 0, 0, 0.32)',
                            overflow: 'hidden',
                            ...dropDownAnimation

                        }}
                    >
                        <div
                            ref = {dropDownRef}
                        >
                            <NavList
                                onClick = {() => {
                                    setShowDropDown(showDropDown => !showDropDown)
                                }}
                            />
                        </div>
                    </a.div>
                    <div
                        style = {{
                            height: '100px',
                        }}
                    >
                        <a.img
                            src = {hamburger}
                            style = {{
                                cursor: 'pointer',
                                height: '42px',
                                width: '42px',
                                padding: '20px',
                                zIndex: 1,
                                position: 'fixed',
                                userSelect: 'none',
                                ...rotateAnimation
                            }}
                            onClick = {() => {
                                // only used to open the dropdown
                                // checkIfClickedOutside will handle closing it
                                if (!showDropDown)
                                    setShowDropDown(true)
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
