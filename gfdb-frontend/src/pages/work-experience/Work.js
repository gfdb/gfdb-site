import WorkExperienceCard from '../../components/work-experience/work-experience'
import competeLogo from '../../resources/images/compete.svg'

const WorkExperience = () => {
    return (
        <div
            style = {{
                display: 'flex',
                flexDirection: 'column',
                width: '50%',
                margin: 'auto',
                paddingTop: '5%',
                gap: '25px'
            }}
        >
            <WorkExperienceCard 
                companyName = {'Compete.gg'}
                jobTitle = {'Full Stack Engineer Intern'}
                companyLogo = {competeLogo}
                companyWebsite = {'https://compete.gg/'}
                jobDescription1 = {'this is the job description'}
                startDate = {new Date(2022, 5, 9)}
                endDate = {new Date(2022, 8, 26)}
            />
            <WorkExperienceCard 
                companyName = {'Compete.gg'}
                jobTitle = {'Backend Engineer Intern'}
                companyLogo = {competeLogo}
                companyWebsite = {'https://compete.gg/'}
                jobDescription1 = {'this is the job description'}
                startDate = {new Date(2021, 5, 9)}
                endDate = {new Date(2021, 8, 26)}
            />
        </div>

    )
}

export default WorkExperience