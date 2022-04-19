import './home.scss';
import Penguin from '../../components/engine'
import Nav from '../nav/Nav'

const Home = () => {
  return (
	<div className="App">
	  <header className="App-header">
		<div>
			{/* <Penguin />
			<Nav /> */}
			<div className='home-content'>
				<h1>Gianfranco Dumoulin Bertucci</h1>
				<h4>Software Engineering Major</h4>
			</div>
	  </div>
	  </header>
  </div>
  )  
}

export default Home;
