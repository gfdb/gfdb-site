
import { THEME } from '../../resources/theme'
const months = [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'June',
'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dev' ]

const WorkExperienceCard = ({
    companyName,
    jobTitle,
    companyLogo,
    jobDescription1,
    startDate,
    endDate,
    companyWebsite
}) => {
    return (
        <div
            style = {{
                display: 'flex',
                backgroundColor: THEME.bgLight,
                borderRadius: '8px',
                padding: '15px',
                borderColor: THEME.text,
                borderStyle: 'solid',
                borderWidth: '1px'
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
                        margin: '0'
                    }}
                >
                    {jobTitle}
                </p>
                <p
                    style = {{
                        fontSize: '12px',
                        margin: '0'
                    }}
                >
                    {companyName}
                </p>
                <p
                    style = {{
                        fontSize: '12px',
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
                    margin: 'auto 0 auto auto'
                }}
                onClick = {() => window.location.href = companyWebsite}
            />
        </div>
    )
}

export default WorkExperienceCard