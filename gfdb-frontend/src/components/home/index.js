import './home.scss';
import NavGame from '../engine'
import Nav from '../nav'

function Home() {
  return (
    <div>
      <NavGame />
      <Nav />
      <div className='home-header'>
        <h1>Gianfranco</h1>
        <h4>gfdb</h4>
      </div>
    </div>
  )  
}

export default Home;
