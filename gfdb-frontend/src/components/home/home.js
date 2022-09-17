import './home.scss'
import { useEffect, useRef, useState } from 'react'
import { Engine, Render, Composite, World, Runner, Body, Bodies, Vertices} from 'matter-js'
import { find_body_in_array } from '../../helpers'
import { distanceBetweenTwoPoints } from '../../utils/misc'
import { useMediaQuery } from 'react-responsive'
import { mq } from '../../utils/mq'

const MY_NAME = 'Gianfranco Dumoulin Bertucci'
const LETTER_PATH = '/letters/'
const BODY_LABELS = ['letter', 'linkedin', 'github']
const GITHUB_URL = 'https://www.github.com/gfdb'
const LINKEDIN_URL = 'https://www.linkedin.com/in/gianfrancodumoulinbertucci'

const STATIC_DENSITY = 15

const HomeComponent = ({loaded_sprites}) => {

	const boxRef = useRef(null)
	const canvasRef = useRef(null)
	const [createLetters, setCreateLetters] = useState(true)
	const [renderState, setRenderState] = useState()
	const [constraints, setContraints] = useState()
	const [resetWorld, setResetWorld] = useState(true)
	const [cursorState, setCursorState] = useState('default')
	const [mouseClickInfo, setMouseClickInfo] = useState({x: 0, y: 0, ctrlKey: undefined})
	const [mouseMovePos, setMouseMovePos] = useState({x: 0, y: 0})

	const [gravityToggle, setGravityToggle] = useState(false)
	const [invertGravity, setInvertGravityToggle] = useState(false)
	const [indexOfBodies, setIndicesOfBodies] = useState({
		ceiling: 0,
		floor: 0,
		wall_left: 0,
		wall_right: 0
	})


	const handleResize = () => {
		setContraints(boxRef.current.getBoundingClientRect())
	}


	const handleMouseClick = (e) => {
		window.removeEventListener('click', handleMouseClick)
		if (!e) return
		e.preventDefault()
		setMouseClickInfo({x: e.clientX, y: e.clientY - 100, ctrlKey: e.ctrlKey})
	}

	const handleMouseMove = (e) => {
		window.removeEventListener('mousemove', handleMouseMove)
		if (!e) return
		setMouseMovePos({x: e.clientX, y: e.clientY - 100})
	}

	useEffect(() => {
		if (!renderState) return

		let githubLogo = find_body_in_array('github', renderState.engine.world.bodies)

		let linkedInLogo = find_body_in_array('linkedin', renderState.engine.world.bodies)

		if (!githubLogo || !linkedInLogo) return

		let mousePos = {x:mouseClickInfo.x, y:mouseClickInfo.y}

		if (githubLogo.circleRadius >= distanceBetweenTwoPoints(mousePos, githubLogo.position)) {
			if (mouseClickInfo.ctrlKey)
				window.open(GITHUB_URL,'_blank')
			else
				window.location.href = GITHUB_URL
		} else if (linkedInLogo.circleRadius >= distanceBetweenTwoPoints(mousePos, linkedInLogo.position)) {
			if (mouseClickInfo.ctrlKey)
				window.open(LINKEDIN_URL,'_blank')
			else
				window.location.href = LINKEDIN_URL
		}
		window.addEventListener('click', handleMouseClick)

	}, [mouseClickInfo])

	useEffect(() => {
		if (!renderState) return

		let githubLogo = find_body_in_array('github', renderState.engine.world.bodies)

		let linkedInLogo = find_body_in_array('linkedin', renderState.engine.world.bodies)

		if (!githubLogo || !linkedInLogo) return

		if (githubLogo.circleRadius >= distanceBetweenTwoPoints(mouseMovePos, githubLogo.position))
			setCursorState('pointer')
		else if (linkedInLogo.circleRadius >= distanceBetweenTwoPoints(mouseMovePos, linkedInLogo.position))
			setCursorState('pointer')
		else
			setCursorState('')


		window.addEventListener('mousemove', handleMouseMove)
	}, [mouseMovePos])

	
	useEffect(() => {

		setContraints(boxRef.current.getBoundingClientRect())

		let engine = Engine.create({})

		let render = Render.create({
			element: boxRef.current,
			engine: engine,
			canvas: canvasRef.current,
			options: {
				background: '',
				wireframes: false
			}
		})

		Runner.run(engine)
		Render.run(render)
		
		render.engine.gravity.y = 0.5
				

		const ceiling = Bodies.rectangle(0, 100, 100, 100, {
			isStatic: true,
			label: 'ceiling',
			friction: 0,
			render: {
				fillStyle: '#272b33',
			},
		})

		const floor = Bodies.rectangle(0, 1000, 0, 100, {
			isStatic: true,
			label: 'floor',
			restitution: 0.9,
			friction: 0,
			render: {
				fillStyle: '#272b33',
			},
		})

		const wall_left = Bodies.rectangle(0, 0, 10, 1000, {
			isStatic: true,
			label: 'wall_left',
			restitution: 0.9,
			friction: 0,
			render: {
				fillStyle: '#272b33',
			},
		})

		const wall_right = Bodies.rectangle(0, 0, 10, 1000, {
			isStatic: true,
			label: 'wall_right',
			restitution: 0.9,
			friction: 0,
			render: {
				fillStyle: '#272b33',
			},
		})

		
		World.add(render.engine.world, [ceiling, floor, wall_left, wall_right])

		setIndicesOfBodies(indexOfBodies => ({...indexOfBodies, ceiling: 0}))
		setIndicesOfBodies(indexOfBodies => ({...indexOfBodies, floor: 1}))
		setIndicesOfBodies(indexOfBodies => ({...indexOfBodies, wall_left: 2}))
		setIndicesOfBodies(indexOfBodies => ({...indexOfBodies, wall_right: 3}))

		window.addEventListener('resize', handleResize)
		window.addEventListener('click', handleMouseClick)
		window.addEventListener('mousemove', handleMouseMove)


		setRenderState(render)


	}, [])



	useEffect(() => {
		if (!renderState) return
		const letters = renderState.engine.world.bodies.filter(body => BODY_LABELS.includes(body.label))
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
		if (!renderState) return
		if (!gravityToggle) return
		renderState.engine.gravity.y *= -1
	}, [invertGravity])

	useEffect(() => {
		if (!renderState) return
		const letters = renderState.engine.world.bodies.filter(body => BODY_LABELS.includes(body.label))
		letters.forEach(letter => Composite.remove(renderState.engine.world, letter))
		if (renderState.engine.gravity.y < 0)
			renderState.engine.gravity.y *= -1
		if (gravityToggle)
			setGravityToggle(gravityToggle => !gravityToggle)
		setCreateLetters(createLetters => !createLetters)
	}, [resetWorld])


	
	useEffect(() => {
		return () => {
			window.removeEventListener('resize', handleResize)
		}
	}, [])


	useEffect(() => {
		if (constraints) {
			let { width, height } = constraints
			// Dynamically update canvas and bounds
			renderState.bounds.max.x = width
			renderState.bounds.max.y = height
			renderState.options.width = width
			renderState.options.height = height
			renderState.canvas.width = width
			renderState.canvas.height = height

			let ceiling = renderState.engine.world.bodies[indexOfBodies.ceiling]
			let floor = renderState.engine.world.bodies[indexOfBodies.floor]
			let wall_left = renderState.engine.world.bodies[indexOfBodies.wall_left]
			let wall_right = renderState.engine.world.bodies[indexOfBodies.wall_right]


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
			
			const floor_vertices = [
				{ x: 0, y: height },
				{ x: width*2, y: height},
				{ x: width*2, y: height + STATIC_DENSITY },
				{ x: 0, y: height + STATIC_DENSITY },
			]

			if (!floor.vertices) {
				Vertices.create(floor_vertices, floor)
			} else {
				Body.setVertices(floor, floor_vertices)
			}
	
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
			setResetWorld(resetWorld => !resetWorld)

		}
	}, [constraints])

	useEffect(() => {
		if (!(constraints && renderState)) return

		let { width, height } = constraints

		let letter_x_pos = (width/2) - 450
		let letter_y_pos = height/4
		const LETTER_SPACING = 10
		let letter_heigh_ref = null
		let prev_letter = null

		let myName = MY_NAME
		if (width <= 960) {
			myName = 'Gianfranco'
			letter_x_pos = (width/2) - 145
		}
		for (let i = 0; i < myName.length; i++) {
			if (myName.charAt(i) === ' ') {
				letter_x_pos += 25
				continue
			}

			let current_img = loaded_sprites[LETTER_PATH + myName.charAt(i) + '.png']
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
					label: 'letter'
				}
			)
			World.add(renderState.engine.world, letter_body)

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

		let linkedInLogo = Bodies.circle(
			(width)*3/8,
			height*1/2,
			30,
			{
				isStatic: true,
				friction: 0,
				render: {
					sprite: {
						texture: loaded_sprites['/logos/linkedin.png'].src,
						xScale: 0.5,
						yScale: 0.5
					}
				},
				restitution: 0.9,
				label: 'linkedin'
			}
		)

		let githubLogo = Bodies.circle(
			(width)*5/8,
			height*1/2,
			30,
			{
				isStatic: true,
				friction: 0,
				render: {
					sprite: {
						texture: loaded_sprites['/logos/github.png'].src,
						xScale: 0.5,
						yScale: 0.5
					}
				},
				restitution: 0.9,
				label: 'github'
			}
		)
		

		World.add(renderState.engine.world, [githubLogo, linkedInLogo])

		
	}, [createLetters])

  	return (
		<div 
			className='home-body'
			style = {{
				height: 'calc(100vh - 100px',
				cursor: cursorState
			}}
		> 
			<div
				ref={boxRef}
				style={{
					position: 'absolute',
					bottom: 0,
					left: 0,
					width: '100%',
					height: 'calc(100% - 100px',
					pointerEvents: 'none',
					overflow: 'hidden',
				}}
			>
				<canvas ref={canvasRef}/>
			</div>
			<div className = 'home-page-button-group'>
				<button
					className = 'toggle-gravity-button'
					onClick={() => {setGravityToggle(gravityToggle => !gravityToggle)}}
				>
					Toggle Gravity
				</button>
				{ gravityToggle &&
					<>
						<button
							className = 'invert-gravity-button'
							onClick={() => {setInvertGravityToggle(invertGravity => !invertGravity)}}
						>
							Invert Gravity
						</button>
					</>
				}
				<button
					className = 'invert-gravity-button'
					onClick={() => {setResetWorld(resetWorld => !resetWorld)}}
				>
					Reset
				</button>
			</div>
		</div>
  )  
}

export default HomeComponent
