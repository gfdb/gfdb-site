import Home from './pages/home/Home'
import WorkExperience from './pages/work-experience/Work'
import ReactDOM from 'react-dom'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Nav from './pages/nav/Nav'


export default function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path='/' element={<Nav />}>
					<Route index element={<Home />} />
					<Route path='/education' />
					<Route path='/work-experience' element = {<WorkExperience/>}/>
					<Route path='/games' />
				</Route>
			</Routes>
		</BrowserRouter>
	)
}
ReactDOM.render(<App />, document.getElementById('root'))
