import './styles.scss'

export default function Nav() {
    return (
        <div className='navbar'>
            <nav 
                className="stroke"
            >
                <ul style={{
                    listStyleType: "none"
                }}>
                    <li><a href = "">Home</a></li>
                    <li><a href = "">Work Experience</a></li>
                    <li><a href = "">Education</a></li>
                    <li><a href = "">Games</a></li>
                </ul>
            </nav>
        </div>
        
        
    )
}