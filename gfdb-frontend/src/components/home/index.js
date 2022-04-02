import './home.scss';
import NavGame from '../engine'
import Nav from '../nav'

function Home() {
  return (
    <div>
      <NavGame />
      <Nav />
      <div className='home-content'>
        <h1>Gianfranco Dumoulin Bertucci</h1>
        <h4>Software Engineering Major</h4>
      </div>
    </div>
  )  
}

export default Home;
