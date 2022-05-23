import './home.scss';
import { useEffect, useRef, useState } from 'react';
import {Engine, Render, World, Composite, Runner, Body, Bodies} from 'matter-js'
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
		const letters = Composite.allBodies(scene.engine.world).filter(body => body.label === 'letter')
		letters.forEach(letter => {
			if (letter.isStatic) {
				// 0.001 is default density
				Body.setMass(letter, 0.001 * (letter.width * letter.height))
				Body.setStatic(letter, false)
			} else {
				Body.setStatic(letter, true)
				Body.setMass(letter, Infinity)
			}
		})
	}, [gravityToggle])

	useEffect(() => {
		if (!scene) return
		if (!gravityToggle) return
		scene.engine.gravity.y *= -1
	}, [invertGravity])

	useEffect(() => {
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
		
		engine.gravity.y = 0.5

		Runner.run(engine)
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

				
				let letter_body = Bodies.rectangle(
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
				World.add(scene.engine.world, letter_body)

				Body.setPosition(letter_body, {x: letter_x_pos, y: letter_y_pos})

				Body.setVertices(letter_body, [
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

				letter_y_pos = height/4
				prev_letter = current_img
			}
			

			const ceiling = Bodies.rectangle(0, 100, 100, 100, {
				isStatic: true,
				label: 'ceiling',
				friction: 0,
				render: {
				  fillStyle: 'light blue',
				},
			})

			const floor = Bodies.rectangle(0, 1000, 0, 100, {
				isStatic: true,
				label: "floor",
				restitution: 0.9,
				friction: 0,
				render: {
					fillStyle: 'light blue',
				},
			})

			const wall_left = Bodies.rectangle(0, 0, 10, 1000, {
				isStatic: true,
				label: "floor",
				restitution: 0.9,
				friction: 0,
				render: {
					fillStyle: 'light blue',
				},
			})

			const wall_right = Bodies.rectangle(0, 0, 10, 1000, {
				isStatic: true,
				label: "floor",
				restitution: 0.9,
				friction: 0,
				render: {
					fillStyle: 'light blue',
				},
			})


			World.add(scene.engine.world, [ceiling, floor, wall_left, wall_right])

			Body.setPosition(ceiling, {x: width / 2, y: -8})

			Body.setVertices(ceiling, [
				{ x: 0, y: 0 },
				{ x: width*2, y: 0},
				{ x: width*2, y: STATIC_DENSITY },
				{ x: 0, y: STATIC_DENSITY },
			])

			// Dynamically update floor
			Body.setPosition(floor, {
				x: width / 2,
				y: height,
			})

			Body.setVertices(floor, [
				{ x: 0, y: height },
				{ x: width*2, y: height},
				{ x: width*2, y: height + STATIC_DENSITY },
				{ x: 0, y: height + STATIC_DENSITY },
			])

			Body.setPosition(wall_left, {x: 0, y: height/2})

			Body.setVertices(wall_left, [
				{ x: 0, y: -8 },
				{ x: 1, y: -8},
				{ x: 1, y: height },
				{ x: 0, y: height },
			])

			Body.setPosition(wall_right, {x: width, y: height/2})

			Body.setVertices(wall_right, [
				{ x: width, y: -8 },
				{ x: width + 1, y: -8},
				{ x: width + 1, y: height },
				{ x: width, y: height },
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
