
import { THEME } from '../../resources/theme'
import arrowLeft from '../../resources/images/arrow-left.svg'
import { useState, useEffect, useRef } from 'react'
import { useSpring, animated as a, SpringValue } from 'react-spring'
import { useMediaQuery } from 'react-responsive'

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

const WorkExperienceCard = ({
    companyName,
    jobTitle,
    companyLogo,
    jobDescription = 'this is a job description',
    jobBullets = ['bullet 1', 'bullet 2', 'bullet 3'],
    startDate,
    endDate,
    companyWebsite,
}) => {

    const [droppedDown, setDroppedDown] = useState(false)
    const [animate, setAnimate] = useState(false)
    const [dropdownHeight, setDropdownHeight] = useState(175)
    const dropdownRef = useRef(null)


    
    const dropDownAnimation = useSpring({
        immediate: !animate,
        // from: {height: !droppedDown ? 'fit-content' : '0vh', opacity: !droppedDown ? 1 : 0},
        to: {height: droppedDown ? '100%' : '0%', opacity: droppedDown ? 1 : 0},
        config: {mass: 1, tension: 100, friction: 35}
    })


    return (
        <div
            style = {{
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: THEME.bgLight,
                borderRadius: '8px',
                padding: '15px',
                borderColor: THEME.text,
                borderStyle: 'solid',
                borderWidth: '1px',
                cursor: 'pointer',
                height: `${76 + dropDownAnimation.height}px`
            }}
            onClick = {() => {
                setAnimate(true)
                setDroppedDown(droppedDown => !droppedDown)
            }}
        > 
           <div
                style = {{
                    display: 'flex',
                    width: '100%'
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
                    <p
                        style = {{
                            fontSize: '12px',
                            fontWeight: 600,
                            margin: '0'
                        }}
                    >
                        {months[startDate.getMonth()]} {startDate.getFullYear()} - {months[endDate.getMonth()]} {endDate.getFullYear()}
                    </p>

                </div>
                <img 
                    src = {companyLogo}
                    style = {{
                        width: '50px',
                        height: '50px',
                        margin: 'auto 12px auto auto'
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
                    }}
                />
           </div>
            {/* { droppedDown && */}
                <a.div
                    style = {{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '10px',
                        color: THEME.text,
                        marginTop: '20px',
                        ...dropDownAnimation
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
                            fontSize: '12px',
                            fontWeight: 600,
                            margin: '0'
                        }}
                    >
                        {jobDescription} 
                    </p>
                </a.div>
            {/* } */}
        </div>
    )
}

export default WorkExperienceCard