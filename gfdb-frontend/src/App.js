import Home from './pages/home/home.js'
import WorkExperience from './pages/work'
import Education from './pages/education'
import Projects from './pages/projects'
import Games from './pages/games'
import ReactDOM from 'react-dom'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Nav from './pages/nav/Nav'


export default function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path='/' element={<Nav />}>
					<Route index element={<Home />} />
					<Route path='/education' element = {<Education/>}/>
					<Route path='/work-experience' element = {<WorkExperience/>}/>
					<Route path='/projects' element = {<Projects/>}/>
					<Route path='/games' element = {<Games/>}/>
				</Route>
			</Routes>
		</BrowserRouter>
	)
}
ReactDOM.render(<App />, document.getElementById('root'))
