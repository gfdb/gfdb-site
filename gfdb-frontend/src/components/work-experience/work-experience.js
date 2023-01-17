
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

const hoverStyles = {
    textDecoration: 'underline',
    color: THEME.textLighter,
    fontSize: '14.5px'
}

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
    const [disableParentDropDown, setdisableParentDropDown] = useState(false)
    const [animate, setAnimate] = useState(false)
    const [dropdownHeight, setDropdownHeight] = useState(0)
    const [readMoreStyles, setReadMoreStyles] = useState({})
    const dropdownRef = useRef(null)
    
    const [droppedDownJobDesc, setDroppedDownJobDesc] = useState(false)
    const [animateJobDesc, setAnimateJobDesc] = useState(false)
    const [jobDescHeight, setJobDescHeight] = useState(0)
    const [readMoreLess, setReadMoreLess] = useState('More')
    const jobDescriptionRef = useRef(null)

    const [combinedHeight, setCombinedHeight] = useState(0)

    const handleResize = () => {
		setDropdownHeight(dropdownRef?.current?.clientHeight)
	}
    const handleResizeJobDesc = () => {
        setJobDescHeight(jobDescriptionRef?.current?.clientHeight)
    }

    useEffect(() => {
        if (droppedDown && droppedDownJobDesc)
            setCombinedHeight(dropdownHeight + jobDescHeight)
        else if (droppedDown)
            setCombinedHeight(dropdownHeight)
    }, [dropdownHeight, jobDescHeight, droppedDownJobDesc, droppedDown])

    useEffect(() => {
        if (!droppedDown) {
            setDroppedDownJobDesc(false)
        }
    }, [droppedDown])

    useEffect(() => {
        handleResize()
        dropdownRef?.current?.addEventListener('resize', handleResize)
    }, [dropdownHeight])
    
    useEffect(() => {
        return () => {
            dropdownRef?.current?.removeEventListener('resize', handleResize)
        }
    }, [dropdownHeight])

    useEffect(() => {
        handleResizeJobDesc()
        jobDescriptionRef?.current?.addEventListener('resize', handleResizeJobDesc)
    }, [jobDescHeight])

    useEffect(() => {
		return () => {
			jobDescriptionRef?.current?.removeEventListener('resize', handleResizeJobDesc)
		}
	}, [jobDescHeight])
    
    const dropDownAnimationParent = useSpring({
        immediate: !animate,
        to: {height: droppedDown ? (combinedHeight + 90) : 90},
        config: {mass: 1, tension: 100, friction: 35},
    })

    const fadeInAnimation = useSpring({
        immediate: !animate,
        to: {opacity: droppedDown ? 1 : 0},
        config: {mass: 1, tension: 100, friction: 35}
    })
    const fadeInAnimationJobDesc = useSpring({
        immediate: !animateJobDesc,
        to: {opacity: droppedDownJobDesc ? 1 : 0},
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
                height: `${combinedHeight + 90}px`,
                overflow: 'hidden',
                ...dropDownAnimationParent

            }}
            onClick = {() => {
                if (jobBullets || jobDescription) {
                    setAnimate(true)
                    if (!disableParentDropDown) {
                        setDroppedDown(droppedDown => !droppedDown)
                    }

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
                <>
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
                            paddingLeft: '1rem',
                            lineHeight: '25px'
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
                            cursor: 'pointer',
                            ...readMoreStyles
                        }}
                        onClick = {() => {
                            setAnimateJobDesc(true)
                            if (readMoreLess === 'More') {
                                setReadMoreLess('Less')
                            } else {
                                setReadMoreLess('More')
                            }
                            setDroppedDownJobDesc(droppedDownJobDesc => !droppedDownJobDesc)

                        }}
                        onMouseEnter = {() => {
                            setdisableParentDropDown(true)
                            setReadMoreStyles(hoverStyles)
                        }}
                        onMouseLeave = {() => {
                            setdisableParentDropDown(false)
                            setReadMoreStyles({})
                        }}
                    >
                        Read {readMoreLess}
                    </p>   
                </a.div>
                <a.div
                    ref = {jobDescriptionRef}
                    style = {{
                        ...fadeInAnimationJobDesc
                    }}
                >
                    <p
                        style = {{
                            fontSize: '14px',
                            fontWeight: 400,
                            margin: '0',
                            color: THEME.text,
                            textIndent: '20px',
                            lineHeight: '25px',
                            paddingBottom: '10px'
                        }}
                    >
                        {jobDescription} 
                    </p>
                </a.div> 
                </>
            }
        </a.div>
    )
}

export default ExperienceCard