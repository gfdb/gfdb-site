import { useEffect, useState } from 'react'
import { loadImage } from '../../helpers'
import HomeComponent from '../../components/home/home'

const LETTER_PATH = '/letters/'

const LETTER_SPRITES = [
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
]


const Home = () => {

	const [loaded_sprites, setLoadedSprites] = useState()

	useEffect(() => {
		Promise.all(LETTER_SPRITES.map(url => loadImage(url))).then(
			arrayOfImageObjects => {
				let spriteArrayOfObjects = {}
				arrayOfImageObjects.forEach((element) => {
					spriteArrayOfObjects = {...spriteArrayOfObjects, ...element}
				})
				setLoadedSprites(spriteArrayOfObjects)
			}
		)
	}, [])

	console.log('loaded_sprites', loaded_sprites)


	return (
		<>
			{ loaded_sprites ? 
			  <HomeComponent loaded_sprites = {loaded_sprites}/>
			: <span>Loading</span>
			}
		</>
	)
}

export default Home