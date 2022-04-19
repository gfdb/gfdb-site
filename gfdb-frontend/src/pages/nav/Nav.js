import './nav.scss'
import Penguin from "../../components/engine/index"
import { Outlet, Link } from "react-router-dom";

export default function Nav() {
    return (
        <>
            <div className='navbar'>
                <nav 
                    className="stroke"
                >
                    <ul style={{
                        listStyleType: "none"
                    }}>
                        <li>
                            <Link to = "/">Home</Link>
                        </li>
                        <li>
                            <Link to = "/work-experience">Work Experience</Link>
                        </li>
                        <li>
                            <Link to = "/education">Education</Link>
                        </li>
                        <li>
                            <Link to = "/games">Games</Link>
                        </li>
                    </ul>
                </nav>
                <Penguin />
            </div>

            <Outlet />
        </>
        

        
    )
}