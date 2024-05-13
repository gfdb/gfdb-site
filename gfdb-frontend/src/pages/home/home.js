import { useEffect, useState } from 'react'
import { loadImage } from '../../helpers'
import HomeComponent from '../../components/home/home.js'
import loading from '../../resources/images/whiteG.gif'
import { useLocation } from 'react-router-dom'

const LETTER_PATH = '/letters/'
const LOGO_PATH = '/logos/'

const SPRITES = [
	LETTER_PATH + 'a.png',
	LETTER_PATH + 'B.png',
	LETTER_PATH + 'c.png',
	LETTER_PATH + 'D.png',
	LETTER_PATH + 'e.png',
	LETTER_PATH + 'f.png',
	LETTER_PATH + 'G.png',
	LETTER_PATH + 'i.png',
	LETTER_PATH + 'l.png',
	LETTER_PATH + 'm.png',
	LETTER_PATH + 'n.png',
	LETTER_PATH + 'o.png',
	LETTER_PATH + 'r.png',
	LETTER_PATH + 't.png',
	LETTER_PATH + 'u.png',
	LOGO_PATH + 'github.png',
	LOGO_PATH + 'linkedin.png'

]


const Home = () => {

	const [loaded_sprites, setLoadedSprites] = useState()
	const location = useLocation()

	useEffect(() => {
        return () => {
            sessionStorage.setItem('lastVisited', location.pathname)
        }
    }, [location.pathname])
	
	useEffect(() => {
		Promise.all(SPRITES.map(url => loadImage(url))).then(
			arrayOfImageObjects => {
				let spriteArrayOfObjects = {}
				arrayOfImageObjects.forEach((element) => {
					spriteArrayOfObjects = {...spriteArrayOfObjects, ...element}
				})
				setLoadedSprites(spriteArrayOfObjects)
			}
		)
	}, [])


	return (
		<>
			{ (loaded_sprites) ? 
			  <HomeComponent loaded_sprites = {loaded_sprites}/>
			: <div style = {{
					textAlign: 'center',
					marginTop: '10rem'
				}}
			>
				<img 
					src = {loading}
					style = {{
						width: '131px',
						height: '164px'
					}}

				/>
			  </div>
			}
		</>
	)
}

export default Home