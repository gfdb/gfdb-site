import WorkExperienceCard from '../../components/work-experience/work-experience'
import competeLogo from '../../resources/images/compete.svg'
import haivisionLogo from '../../resources/images/haivision.jpg'
import { useSpring, animated as a } from 'react-spring'
import { useEffect, useRef, useState } from 'react'

const WorkExperience = () => {

    const workExperienceCardRef = useRef(null)
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
        config: {mass: 1, tension: 125, friction: 30},
        ...animatedDivStyles
    })
    const animationOnRender2 = useSpring({
        opacity: 1,
        marginLeft: workExpWidth,
        from: {marginLeft: -3000, opacity: 0},
        config: {mass: 1, tension: 100, friction: 25},
        ...animatedDivStyles
    })

    const handleResize = () => {
        setWorkExpWidth(window.innerWidth/2 - workExperienceCardRef.current.offsetWidth/2)
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

    const haivisionDesc = 'My first coop internship was at Haivision. I learned a great deal about python, QA, software processes, and programming in general. '+
                          'All the teams I worked with (and everyone I interacted with) were filled with professional, kind, and intelligent people. ' +
                          'Working in a big company like this taught me a lot. The biggest thing I took out of this experience is the ' +
                          'importance of a team. Although the the role of the engineers who write the \'core\' code is important, without the ' +
                          'automated tests and QA, the product we were building would either be buggy or wouldn\'t work at all. ' +
                          'Huge shoutout to Borislav, hardest working QA engineer I\'ve ever seen.'
    const haivisionBullets = [
        'Worked on the automation and quality assurance teams.',
        'Automation: automated test suites for testing proprietary company hardware related to video streaming.',
        'QA: testing UI components and frontend as a whole, documenting bugs, creating tests, performing regression tests.'
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
                marginBottom: '100px'
            }}
        >
            <a.div style = {{...animationOnRender0}} ref = {workExperienceCardRef}>
                <WorkExperienceCard 
                    companyName = {'Compete.gg'}
                    jobTitle = {'Full Stack Engineer Intern'}
                    companyLogo = {competeLogo}
                    companyWebsite = {'https://compete.gg/'}
                    startDate = {new Date(2022, 4, 9)}
                    endDate = {new Date(2022, 7, 26)}
                />
            </a.div>
            <a.div style = {{...animationOnRender1}}>
                <WorkExperienceCard 
                    companyName = {'Compete.gg'}
                    jobTitle = {'Backend Engineer Intern'}
                    companyLogo = {competeLogo}
                    companyWebsite = {'https://compete.gg/'}
                    jobDescription1 = {'this is the job description'}
                    startDate = {new Date(2021, 4, 9)}
                    endDate = {new Date(2021, 7, 26)}
                />
            </a.div>
            <a.div style = {{...animationOnRender2}}>
                <WorkExperienceCard 
                    companyName = {'Haivision'}
                    jobTitle = {'Software Development Engineer in Test'}
                    companyLogo = {haivisionLogo}
                    companyWebsite = {'https://haivision.com/'}
                    jobDescription = {haivisionDesc}
                    jobBullets = {haivisionBullets}
                    startDate = {new Date(2020, 8, 9)}
                    endDate = {new Date(2020, 11, 26)}
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

export default WorkExperience