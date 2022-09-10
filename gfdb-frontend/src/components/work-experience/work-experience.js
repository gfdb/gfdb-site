
import { THEME } from '../../resources/theme'
import arrowLeft from '../../resources/images/arrow-left.svg'
import { useState, useEffect, useRef } from 'react'
import { useSpring, animated as a, SpringValue } from 'react-spring'

const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'June',
    'July',
    'Aug',
    'Sept',
    'Oct',
    'Nov',
    'Dec'
]

const ExperienceCard = ({
    companyName,
    jobTitle,
    companyLogo,
    jobDescription,
    jobBullets,
    startDate,
    endDate,
    companyWebsite,
}) => {

    const [droppedDown, setDroppedDown] = useState(false)
    const [animate, setAnimate] = useState(false)
    const [dropdownHeight, setDropdownHeight] = useState(0)
    const dropdownRef = useRef(null)

    const handleResize = () => {
		setDropdownHeight(dropdownRef?.current?.clientHeight)
	}

    useEffect(() => {
        handleResize()
        dropdownRef?.current?.addEventListener('resize', handleResize)
    }, [dropdownHeight])

    useEffect(() => {
		return () => {
			dropdownRef?.current?.removeEventListener('resize', handleResize)
		}
	}, [dropdownHeight])
    
    const dropDownAnimationParent = useSpring({
        immediate: !animate,
        to: {height: droppedDown ? (dropdownHeight + 90) : 90},
        config: {mass: 1, tension: 100, friction: 35}
    })

    const fadeInAnimation = useSpring({
        immediate: !animate,
        to: {opacity: droppedDown ? 1 : 0},
        config: {mass: 1, tension: 100, friction: 35}
    })


    return (
        <a.div
            style = {{
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: THEME.bgLight,
                borderRadius: '8px',
                padding: '15px',
                borderColor: THEME.text,
                borderStyle: 'solid',
                borderWidth: '1px',
                cursor: ( (jobBullets || jobDescription) && 'pointer'),
                height: `${dropdownHeight + 90}px`,
                overflow: 'hidden',
                ...dropDownAnimationParent

            }}
            onClick = {() => {
                if (jobBullets || jobDescription) {
                    setAnimate(true)
                    setDroppedDown(droppedDown => !droppedDown)
                }
            }}
        > 
           <div
                style = {{
                    display: 'flex',
                    width: '100%',
                    height: '100%'
                }}
           >
                <div
                    style = {{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '10px',
                        color: THEME.text
                    }}
                >
                    <p
                        style = {{
                            fontSize: '18px',
                            fontWeight: 600,
                            margin: '0'
                        }}
                    >
                        {jobTitle}
                    </p>
                    <p
                        style = {{
                            fontSize: '12px',
                            fontWeight: 600,
                            margin: '0'
                        }}
                    >
                        {companyName}
                    </p>
                    { startDate && endDate &&
                        <p
                            style = {{
                                fontSize: '12px',
                                fontWeight: 600,
                                margin: '0'
                            }}
                        >
                            {months[startDate.getMonth()]} {startDate.getFullYear()} - {months[endDate.getMonth()]} {endDate.getFullYear()}
                        </p>
                    }

                </div>
                <img 
                    src = {companyLogo}
                    style = {{
                        width: '50px',
                        height: '50px',
                        margin: 'auto 12px auto auto',
                        cursor: 'pointer'
                    }}
                    onClick = {() => window.location.href = companyWebsite}
                />
                <img 
                    src = {arrowLeft}
                    style = {{
                        width: '14px',
                        height: '14px',
                        margin: 'auto 0',
                        transform: (droppedDown ? 'rotate(90deg)': 'rotate(-90deg)'),
                        display: (!(jobBullets || jobDescription) && 'none'),
                    }}
                />
           </div>
            { (jobDescription || jobBullets) &&
                <a.div
                    style = {{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '10px',
                        color: THEME.text,
                        marginTop: '20px',
                        ...fadeInAnimation
                    }}
                    ref = {dropdownRef}
                >

                    <ul
                        style = {{
                            paddingRight: '1rem',
                            paddingLeft: '1rem'
                        }}
                    >
                        {jobBullets?.map((bulletText, i) => (
                            <li key = {i}>
                                {bulletText}
                            </li>
                        ))}
                    </ul>
                    <p
                        style = {{
                            fontSize: '14px',
                            fontWeight: 400,
                            margin: '0'
                        }}
                    >
                        {jobDescription} 
                    </p>
                </a.div>
            }
        </a.div>
    )
}

export default ExperienceCard