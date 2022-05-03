import './home.scss';
import { useEffect, useRef, useState } from 'react';
import Matter, { use } from 'matter-js'
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

	const handleResize = () => {
		setContraints(boxRef.current.getBoundingClientRect())
	}

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
			friction: 0,
			render: {
				fillStyle: 'light blue',
			},
		}))
		let letter_x_pos = 250
		let letter_y_pos = 200
		const LETTER_SPACING = 10
		const LETTER_HEIGHT_REF = 47.1
		let prev_img = null


		for (let i = 0; i < MY_NAME.length; i++) {
			if (MY_NAME.charAt(i) === " ") {
				letter_x_pos += 40
				continue
			}
			let current_img = loaded_sprites[LETTER_PATH + MY_NAME.charAt(i) + '.png']
			/*  in order to maintain consistent letter spacing we take the
			*	horizontal radius of each rectangle and add the constant
			*	letter spacing to it. We do this because the x position
			* 	of a body in space is its center point.
			*/
			if (prev_img)
				letter_x_pos += (prev_img.width*0.1)/2 + (current_img.width*0.1)/2 + LETTER_SPACING

			if (current_img.height*0.1 !== LETTER_HEIGHT_REF)
				letter_y_pos += LETTER_HEIGHT_REF-(current_img.height*0.1)

			
			body_list.push(
				Bodies.rectangle(
						letter_x_pos,
						letter_y_pos + (current_img.height*0.1 / 2), 
						current_img.width*0.1, 
						current_img.height*0.1, 
						{
							isStatic: false,
							friction: 0,
							render: {
								sprite: {
									texture: current_img.src,
									xScale: 0.1,
									yScale: 0.1
								}
							},
							restitution: 0.8
						}
					))
			letter_y_pos = 200
			prev_img = current_img
		}

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



			// Matter.Body.setPosition(wall_right, {
			// 	x: width + 100,
			// 	y: height + STATIC_DENSITY / 2
			// })

			// Matter.Body.setPosition(wall_left, {
			// 	x: -100,
			// 	y: height + STATIC_DENSITY / 2
			// })

			// Matter.Body.setPosition(ceiling, {
			//   x: width / 2,
			//   y: -5,
			// })

			// Matter.Body.setVertices(ceiling, [
			//   { x: 0, y: 0 },
			//   { x: width*2, y: 0},
			//   { x: width*2, y: 1},
			//   { x: 0, y: 1},
			// ])

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
		</div>
  )  
}

export default Home;
