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

    const competeBullets1 = [
        'Created Tool Suite to automate parts of our testing process and improve testing efficiency.',
        'Created Notifications component to display relevant messages to users.',
        'Created Chat for users in a tournament or a match to talk to each other, improved user to user communication.'
    ]
    const competeDesc1 = ''
    
    const competeBullets0 = [
        'Created statistic collection and processing systems for Call of Duty: Warzone and Fortnite tournaments.',
        'Created API wrappers for incoming data from game servers as well as backup APIs to ensure 100% stat tracking uptime.',
        'Created numerous automated scripts to assist in testing which drastically improved testing time.'
    ]
    const competeDesc0 = 'It was incredibly fun and interesting to work at Compete. At this time, the company was still in its early days ' +
                         'which meant that a lot of the software needed to be built from scratch. I initially noticed the automatability ' +
                         'of many parts of our testing process and after asking my manager, I was given permission to start automating them. ' +
                         'I immediately noticed the impact since at least a few times an hour someone would ask me \'what\'s the cli option for X again\' ' +
                         'despite the extensive docs I wrote hahaha. I didn\'t mind though because my team members were actually using the tools I created.' + 
                         ' After that I began working on our stat tracking systems. To sum it up, we would track players\' in game statistics and use them to ' +
                         'award players points in a tournament. We were giving away money which mean\'t that the system had to be sharp. My systems had to be able' +
                         ' to not only track stats but detect and handle attempts at \'cheating\' (in the context of our site rules). This included making sure players played on the same team,' +
                         ' used the allowed input devices, and many other things. Coming up with algorithms to detect this stuff with the data I had was a challenge but man it was fun' +
                         ' and eventually rewarding when they were deployed and I got to see them in action. During this time we were paying a third party API provider in order to' +
                         ' access Fortnite stats. At one point this provider\'s API kept going down and I insisted to my managers that we make our own. For many reasons' +
                         ' they didn\'t want to switch but I was able to convince them to at least let me make a backup since there were tournaments running and we needed' + 
                         ' to be able to track stats, to which they agreed. Essentially, I made a system that detects when our provider\'s API was down and when it was, it would ' +
                         ' deploy the one I wrote. If the provder\'s API came back up, it would kill mine and switch back. This system saved us many times since this provider' +
                         ' ended up being pretty bad. It reached a point where we were relying on my backup more than the provder hahaha. It was really cool to be able to' +
                         ' work at a company where I could very clearly see the impact of the software that I was writing. ' +
                         'All in all, it was a great experience and I learned a lot from this job. Special thanks to Jordan for teaching me so much.'

    const haivisionDesc = 'My first coop internship was at Haivision. I learned a great deal about python, QA, software processes, and programming in general. '+
                          'All the teams I worked with were filled with professional, kind, and intelligent people. ' +
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
                    jobDescription = {competeDesc1}
                    jobBullets = {competeBullets1}
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
                    jobDescription = {competeDesc0}
                    jobBullets = {competeBullets0}
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