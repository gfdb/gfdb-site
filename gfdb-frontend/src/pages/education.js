import ExperienceCard from '../components/work-experience/work-experience'
import lccLogo from '../resources/images/lcc.jpg'
import concordiaLogo from '../resources/images/concordia.jpg'
import { useSpring, animated as a } from 'react-spring'
import { useEffect, useRef, useState } from 'react'

const Education = () => {

    const experienceCardRef = useRef(null)
    const [workExpWidth, setWorkExpWidth] = useState()

    const animationOnRender0 = useSpring({
        opacity: 1,
        marginLeft: workExpWidth,
        from: {marginLeft: -1000, opacity: 0},
        config: {mass: 1, tension: 150, friction: 30},
        ...animatedDivStyles
    })

    const animationOnRender1 = useSpring({
        opacity: 1,
        marginLeft: workExpWidth,
        from: {marginLeft: -2000, opacity: 0},
        config: {mass: 1, tension: 150, friction: 30},
        ...animatedDivStyles
    })
    const animationOnRender2 = useSpring({
        opacity: 1,
        marginLeft: workExpWidth,
        from: {marginLeft: -3000, opacity: 0},
        config: {mass: 1, tension: 125, friction: 30},
        ...animatedDivStyles
    })

    const handleResize = () => {
        setWorkExpWidth(window.innerWidth/2 - experienceCardRef.current.offsetWidth/2)
    }


    useEffect(() => {
        handleResize()
        window.addEventListener('resize', handleResize)
    }, [])

    useEffect(() => {
		return () => {
			window.removeEventListener('resize', handleResize)
		}
	}, [])

    const concordiaBullets = [
        'Object Oritented Programming I & II',
        'System Hardware',
        'Web Programming',
        'Principles of Programming Languages',
        'Data Structures and Algorithms',
        'Operating Systems',
        'Formal Methods for Software Engineering',
        'Software Processes',
        'Theoretical Computer Science',
        'Software Requirements and Specifications',
        'Software Architecture and Design',
        'Management and Quality Control - SW Development',
        'Databases',
        'Software Testing and Quality Assurance',
        'User Interface Design',
        'Data Systems for Software Engineers',
        'Advanced Program Design, C++',
        'Information Systems Security',
        'Data Communications and Computer Networks',
        'Machine Learning',
        'Control Systems and Applications'
    ]


    return (
        <div
            style = {{
                display: 'flex',
                flexDirection: 'column',
                gap: '25px',
                width: '100%',
                paddingTop: '100px',
                overflowX: 'hidden',
                paddingBottom: '100px'
            }}
        >
            <a.div style = {{...animationOnRender0, boxShadow: '24px 24px 24px rgba(0, 0, 0, 0.32)'}}>
                <ExperienceCard 
                    companyName = {'Concordia University'}
                    jobTitle = {'MCompSc - Computer Science'}
                    companyLogo = {concordiaLogo}
                    companyWebsite = {'https://www.concordia.ca/'}
                    // jobDescription = {''}
                    // jobBullets = {''}
                    startDate = {new Date(2023, 8, 1)}
                    endDate = {new Date(2025, 8, 1)}
                />
            </a.div>
            <a.div style = {{...animationOnRender1, boxShadow: '24px 24px 24px rgba(0, 0, 0, 0.32)'}}>
                <ExperienceCard 
                    companyName = {'Concordia University'}
                    jobTitle = {'BE - Software Engineering'}
                    companyLogo = {concordiaLogo}
                    companyWebsite = {'https://www.concordia.ca/'}
                    jobDescription = {''}
                    jobBullets = {concordiaBullets}
                    startDate = {new Date(2019, 8, 1)}
                    endDate = {new Date(2023, 4, 4)}
                />
            </a.div>
            <a.div style = {{...animationOnRender2, boxShadow: '24px 24px 24px rgba(0, 0, 0, 0.32)'}} ref = {experienceCardRef}>
                <ExperienceCard 
                    companyName = {'Lower Canada College'}
                    jobTitle = {'High School and Grade 12'}
                    companyLogo = {lccLogo}
                    companyWebsite = {'https://www.lcc.ca/'}
                />
            </a.div>
        </div>

    )
}

const animatedDivStyles = {
    display: 'flex',
    flexDirection: 'column',
    width: '50%',
    minWidth: '350px',
    marginTop: 'auto',
    marginRight: 'auto',
    marginBottom: 'auto',
    gap: '25px',
    overflow: 'hidden',
    height: 'fit-content',
}

export default Education