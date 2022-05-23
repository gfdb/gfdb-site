import './home.scss';
import { useEffect, useRef, useState } from 'react';
import Matter from 'matter-js'
import { preload_sprites } from '../../helpers';

const MY_NAME = 'Gianfranco Dumoulin Bertucci'
const LETTER_PATH = '/letters/'

var loaded_sprites = preload_sprites([
	LETTER_PATH + "a.png",
	LETTER_PATH + "B.png",
	LETTER_PATH + "c.png",
	LETTER_PATH + "D.png",
	LETTER_PATH + "e.png",
	LETTER_PATH + "f.png",
	LETTER_PATH + "G.png",
	LETTER_PATH + "i.png",
	LETTER_PATH + "l.png",
	LETTER_PATH + "m.png",
	LETTER_PATH + "n.png",
	LETTER_PATH + "o.png",
	LETTER_PATH + "r.png",
	LETTER_PATH + "t.png",
	LETTER_PATH + "u.png",
], true)

const STATIC_DENSITY = 15

const Home = () => {

	const boxRef = useRef(null)
	const canvasRef = useRef(null)
	const [constraints, setContraints] = useState()
	const [scene, setScene] = useState()
	const [gravityToggle, setGravityToggle] = useState(false)
	const [invertGravity, setInvertGravityToggle] = useState(false)

	const handleResize = () => {
		setContraints(boxRef.current.getBoundingClientRect())}

	useEffect(() => {
		if (!scene) return
		const letters = Matter.Composite.allBodies(scene.engine.world).filter(body => body.label === 'letter')
		letters.forEach(letter => {
			if (letter.isStatic) {
				// 0.001 is default density
				Matter.Body.setMass(letter, 0.001 * (letter.width * letter.height))
				Matter.Body.setStatic(letter, false)
			} else {
				Matter.Body.setStatic(letter, true)
				Matter.Body.setMass(letter, Infinity)
			}
		})
	}, [gravityToggle])

	useEffect(() => {
		if (!scene) return
		const letters = Matter.Composite.allBodies(scene.engine.world).filter(body => body.label === 'letter')
		letters.forEach(letter => {
			letter.gravityScale *= -1
			console.log('here')
		})
		
	}, [invertGravity])

	useEffect(() => {
		let Engine = Matter.Engine
		let Render = Matter.Render
		let World = Matter.World
		let Bodies = Matter.Bodies

		let engine = Engine.create({})

		let render = Render.create({
			element: boxRef.current,
			engine: engine,
			canvas: canvasRef.current,
			options: {
				background: 'light blue',
				wireframes: false,
			},
		})

		let body_list = []

		body_list.push(Bodies.rectangle(0, 1000, 0, 100, {
			isStatic: true,
			label: "floor",
			restitution: 0.9,
			friction: 0,
			render: {
				fillStyle: 'light blue',
			},
		}))
		
		// const wall_left = Bodies.rectangle(0, 100, 1, 10000, {
		// 	isStatic: true,
		// 	friction: 0,
		// 	render: {
		// 		fillStyle: 'red'
		// 	}
		// })

		// const wall_right = Bodies.rectangle(0, 100, 1, 10000, {
		// 	isStatic: true,
		// 	friction: 0,
		// 	render: {
		// 		fillStyle: 'light blue'
		// 	}
		// })

		// const ceiling = Bodies.rectangle(0, 100, 0, 100, {
		//   isStatic: true,
		//   friction: 0,
		//   render: {
		//     fillStyle: 'light blue',
		//   },
		// })

		World.add(engine.world, body_list)
		// World.add(engine.world, [wall_left])
		// World.add(engine.world, [wall_right])
		// World.add(engine.world, [ceiling])
		
		engine.gravity.y = 0.5

		Matter.Runner.run(engine)
		Render.run(render)

		setContraints(boxRef.current.getBoundingClientRect())
		setScene(render)
		console.log("scene has been set")

		window.addEventListener('resize', handleResize)

		
	}, [])

	useEffect(() => {
		return () => {
			window.removeEventListener('resize', handleResize)
		}
	}, [])

	useEffect(() => {
		if (constraints) {
			let { width, height } = constraints

			// Dynamically update canvas and bounds
			scene.bounds.max.x = width
			scene.bounds.max.y = height
			scene.options.width = width
			scene.options.height = height
			scene.canvas.width = width
			scene.canvas.height = height

			
			const floor = scene.engine.world.bodies[0]

			let letter_x_pos = width/4
			let letter_y_pos = height/4
			const LETTER_SPACING = 10
			let letter_heigh_ref = null
			let prev_letter = null

			for (let i = 0; i < MY_NAME.length; i++) {
				if (MY_NAME.charAt(i) === " ") {
					letter_x_pos += 25
					continue
				}
				let current_img = loaded_sprites[LETTER_PATH + MY_NAME.charAt(i) + '.png']
				let curr_height = current_img.height * 0.1
				let curr_width = current_img.width * 0.1

				if (!letter_heigh_ref)
					letter_heigh_ref = curr_height

				let curr_horizontal_radius = curr_width/2
				let curr_vertical_radius = curr_height/2
				/*  in order to maintain consistent letter spacing I take the
				*	horizontal radius of each rectangle and add the constant
				*	letter spacing to it. I do this because the x position
				* 	of a body in space is its center point.
				*/
				if (prev_letter)
					letter_x_pos += (prev_letter.width*0.1)/2 + curr_horizontal_radius + LETTER_SPACING

				if (current_img.height !== letter_heigh_ref)
					letter_y_pos += letter_heigh_ref - curr_height + curr_vertical_radius

				
				let letter_body = Matter.Bodies.rectangle(
					letter_x_pos,
					letter_y_pos, 
					curr_width,
					curr_height,
					{
						isStatic: true,
						friction: 0,
						render: {
							sprite: {
								texture: current_img.src,
								xScale: 0.1,
								yScale: 0.1
							}
						},
						restitution: 0.9,
						label: "letter"
					}
				)
				Matter.World.add(scene.engine.world, letter_body)
				console.log('mass', letter_body.mass)

				Matter.Body.setPosition(letter_body, {
					x: letter_x_pos,
					y: letter_y_pos
				})

				Matter.Body.setVertices(letter_body, [
					{
						// top left
						x: letter_x_pos - curr_horizontal_radius,
						y: letter_y_pos - curr_vertical_radius
					},
					{
						// top right
						x: letter_x_pos + curr_horizontal_radius,
						y: letter_y_pos - curr_vertical_radius
					},
					{
						// bottom right
						x: letter_x_pos + curr_horizontal_radius,
						y: letter_y_pos + curr_vertical_radius
					},
					{
						// bottom left
						x: letter_x_pos - curr_horizontal_radius,
						y: letter_y_pos + curr_vertical_radius
					},
				])
								
				// Matter.Body.setVertices(letter_body, [
				// 	Matter.Vector.create(letter_x_pos-),
				// 	{ x: width*2, y: height},
				// 	{ x: width*2, y: height + STATIC_DENSITY },
				// 	{ x: 0, y: height + STATIC_DENSITY },
				// ])

				letter_y_pos = height/4
				prev_letter = current_img
			}


			// const letter_g = scene.engine.world.bodies[1]

			// const wall_left = scene.engine.world.bodies[1]

			// const wall_right = scene.engine.world.bodies[2]

			// const ceiling = scene.engine.world.bodies[3]

			// Dynamically update floor
			Matter.Body.setPosition(floor, {
				x: width / 2,
				y: height,
			})

			Matter.Body.setVertices(floor, [
				{ x: 0, y: height },
				{ x: width*2, y: height},
				{ x: width*2, y: height + STATIC_DENSITY },
				{ x: 0, y: height + STATIC_DENSITY },
			])


		}
	}, [scene, constraints])

  	return (
		<div className='home-body'> 
			<div
				ref={boxRef}
				style={{
					position: 'absolute',
					bottom: 0,
					left: 0,
					width: '100%',
					height: '90%',
					pointerEvents: 'none',
					overflow: 'hidden'
				}}
			>
				<canvas ref={canvasRef} />
			</div>
			<div className = 'home-page-button-group'>
				<button
					className = 'toggle-gravity-button'
					onClick={() => {setGravityToggle(prevState => !prevState)}}>
						Toggle Gravity
				</button>

				<button
					className = 'invert-gravity-button'
					onClick={() => {setInvertGravityToggle(prevState => !prevState)}}>
						Invert Gravity
				</button>
			</div>
		</div>
  )  
}

export default Home;
