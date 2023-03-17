import { useEffect, useState, useRef } from 'react'
import Matter from 'matter-js'
import { use_event } from '../hooks'
import { trim_url_domain, preload_sprites, find_body_in_array} from '../../helpers'
import './penguin.scss'

const STATIC_DENSITY = 15

const AFK_THRESHOLD = 20000
const UP_VECTOR = Matter.Vector.create(0, -0.012)
const DOWN_VECTOR = Matter.Vector.create(0, 0.012)
const LEFT_VECTOR = Matter.Vector.create(-0.0005, 0)
const RIGHT_VECTOR = Matter.Vector.create(0.0005, 0)



const SLIDE_ANIMATION = [
	'/penguin_slide01.png',
	'/penguin_slide02.png'
]

const JUMP_ANIMATION = [
	'/penguin_jump01.png',
	'/penguin_jump02.png',
	'/penguin_jump03.png'
]

const SPRITE_PATH_RIGHT = '/penguin/right'
const SPRITE_PATH_LEFT = '/penguin/left'
const DEFAULT_SPRITE = '/penguin_walk01.png'

var loaded_sprites = preload_sprites([
	SPRITE_PATH_LEFT + DEFAULT_SPRITE,
	SPRITE_PATH_LEFT + SLIDE_ANIMATION[0],
	SPRITE_PATH_LEFT + SLIDE_ANIMATION[1],
	SPRITE_PATH_LEFT + JUMP_ANIMATION[0],
	SPRITE_PATH_LEFT + JUMP_ANIMATION[1],
	SPRITE_PATH_LEFT + JUMP_ANIMATION[2],
	
	SPRITE_PATH_RIGHT + DEFAULT_SPRITE,
	SPRITE_PATH_RIGHT + SLIDE_ANIMATION[0],
	SPRITE_PATH_RIGHT + SLIDE_ANIMATION[1],
	SPRITE_PATH_RIGHT + JUMP_ANIMATION[0],
	SPRITE_PATH_RIGHT + JUMP_ANIMATION[1],
	SPRITE_PATH_RIGHT + JUMP_ANIMATION[2],
])


export default function Penguin() {

	const boxRef = useRef(null)
	const canvasRef = useRef(null)

	const [constraints, setConstraints] = useState()
	const [renderer, setRenderer] = useState()

	const [spawn_character, spawnCharacter] = useState(true)
	const [movementStateArray, setMovementArray] = useState({movement_array: []})

	let lastMovementTime = new Date()

	const handleResize = () => {
		setConstraints(boxRef.current.getBoundingClientRect())
	}

	const isAFK = (milliSecondsBeforeAFK) => {
		let timeNow = new Date()
		return ((timeNow.getTime() - lastMovementTime.getTime()) > milliSecondsBeforeAFK)
	}

	const movePenguin = (vector) => {
		if (!renderer) return

		lastMovementTime = new Date()
		const penguin = find_body_in_array('penguin', renderer.engine.world.bodies)

		Matter.Body.applyForce(
			penguin, // peguin body
			penguin.position, // penguin pos
			vector // vector of force to apply
		)
	}

	const movePenguinInRandomDirection = () => {
		const penguin = find_body_in_array('penguin', renderer.engine.world.bodies)
		let randomInt = Math.round(Math.random()*10)
		if (randomInt === 0 || randomInt === 9) 
			movePenguin(UP_VECTOR)
		else if (randomInt % 2 === 0) {
			movePenguin(Matter.Vector.create(-0.002, 0))
		} else {
			movePenguin(Matter.Vector.create(0.002, 0))
		}
	}

	const computeBodyVertices = (xPos, yPos, width, height) => {
		return ([
			{ x: xPos, y: yPos },
			{ x: xPos + width, y: yPos},
			{ x: xPos + width, y: yPos + height},
			{ x: xPos, y: yPos + height},
		])
	}

	const isJumping = () => {

		const collisions = Matter.Query.collides(
			find_body_in_array('penguin', renderer.engine.world.bodies),
			[
				find_body_in_array('homeBlock', renderer.engine.world.bodies),
				find_body_in_array('workExpBlock', renderer.engine.world.bodies),
				find_body_in_array('educationBlock', renderer.engine.world.bodies),
				find_body_in_array('floor', renderer.engine.world.bodies)
			]
		)

		if (collisions.length === 0)
			return true
		
		for (let i = 0; i < collisions.length; i++) {
			// if the penguin is touching any of the top edges of 
			// any of the bodies it is colliding with, then it is
			// not jumping
			if (collisions[i].normal.x === 0 && collisions[i].normal.y === 1)
				return false
		}

		return true
	}

	const updatePenguinSprite = () => {

		const penguin = find_body_in_array('penguin', renderer.engine.world.bodies)
		const floor = find_body_in_array('floor', renderer.engine.world.bodies)

		if (!penguin || !floor)
			return
		

		let current_texture = trim_url_domain(penguin.render.sprite.texture)
		let sprite_to_apply = undefined

		// penguin moving right
		if (penguin.velocity.x > 0) {
			sprite_to_apply = SPRITE_PATH_RIGHT
		// penguin moving left
		} else if (penguin.velocity.x < 0) {
			sprite_to_apply = SPRITE_PATH_LEFT
		} else {
			// not moving
			return
		}
		

		// if penguin is not jumping
		if (!isJumping()) {
			let absPenguinVelocityX = Math.abs(penguin.velocity.x)
			// standing straight
			if (1.3 < absPenguinVelocityX && absPenguinVelocityX < 1.45) {
				sprite_to_apply += SLIDE_ANIMATION[0]
			} else if (1.45 < absPenguinVelocityX) {
				sprite_to_apply += SLIDE_ANIMATION[1]
			} else {
				sprite_to_apply += DEFAULT_SPRITE
			}
		} else { // penguin is jumping
			let absPenguinVelocityY = Math.abs(penguin.velocity.y)
			if (absPenguinVelocityY > 3) {
				sprite_to_apply += JUMP_ANIMATION[0]
			} else if (3 > absPenguinVelocityY && absPenguinVelocityY > 2) {
				sprite_to_apply += JUMP_ANIMATION[1]
			} else {
				sprite_to_apply += JUMP_ANIMATION[2]
			}
		}

		// dont change texture if it's already that texture
		if (current_texture === sprite_to_apply)
			return
		
		penguin.render.sprite.texture = loaded_sprites[sprite_to_apply]
	}

	const updatePenguinMovement = () => {
		if (!renderer) return
			
		const floor = find_body_in_array('floor', renderer.engine.world.bodies)
		const penguin = find_body_in_array('penguin', renderer.engine.world.bodies)
		
		if(movementStateArray.movement_array.includes('right'))
			movePenguin(RIGHT_VECTOR)

		if(movementStateArray.movement_array.includes('left'))
			movePenguin(LEFT_VECTOR)

		if(movementStateArray.movement_array.includes('up'))
			// check to make sure they are not already jumping
			if (!isJumping())
				movePenguin(UP_VECTOR)
	}

	
	const mainGameLoop = () => {
		if (Array.isArray(movementStateArray.movement_array) 
			&& movementStateArray.movement_array.length) {
			updatePenguinMovement()
		}
		updatePenguinSprite()

		if (isAFK(AFK_THRESHOLD)) {
			movePenguinInRandomDirection()
		}

		// check to see if penguin is in bounds, if not 
		// teleport him back in bounds on the opposite side of the screen
		if (renderer && constraints) {
			const penguin = find_body_in_array('penguin', renderer.engine.world.bodies)

			if (penguin !== undefined) {
				if (penguin.position.x > constraints.width) {
					Matter.Body.setPosition(
						penguin,
						{
							x: 10,
							y: penguin.position.y
						}
					)
				}
				if (penguin.position.x < 0) {
					Matter.Body.setPosition(
						penguin,
						{
							x: constraints.width, 
							y: penguin.position.y
						}
					)
				}
			}

		}
	}

	const handleKeyDown = (e) => {

		let temp_movement_array =  movementStateArray.movement_array

		if (e.key === ' ' || e.key === 'ArrowUp') {
			if (!movementStateArray.movement_array.includes('up'))
				temp_movement_array.push('up')
		}

		if (e.key === 'ArrowRight'){
			if (!movementStateArray.movement_array.includes('right'))
				temp_movement_array.push('right')
		}

		if (e.key === 'ArrowDown'){
			if (!movementStateArray.movement_array.includes('down'))
				temp_movement_array.push('down')
		}

		if (e.key === 'ArrowLeft') {
			if (!movementStateArray.movement_array.includes('left'))
				temp_movement_array.push('left')
		}
	}

	const handleKeyUp = (e) => {

		let index = -1
		let temp_movement_array = movementStateArray.movement_array

		if (e.key === ' ' || e.key === 'ArrowUp')
			index = temp_movement_array.indexOf('up')

		if (e.key === 'ArrowRight')
			index = temp_movement_array.indexOf('right')

		if (e.key === 'ArrowDown')
			index = temp_movement_array.indexOf('down')      

		if (e.key === 'ArrowLeft')
			index = temp_movement_array.indexOf('left')

		if (index > -1) {
			temp_movement_array.splice(index, 1)
			setMovementArray({ movement_array: temp_movement_array })
		}
	}

	use_event('keydown', handleKeyDown)
	use_event('keyup', handleKeyUp)

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
				// background: 'transparent',
				wireframes: false,
			},
		})

		const floor = Bodies.rectangle(0, 100, 0, 100, {
			isStatic: true,
			friction: 0,
			label: 'floor',
			render: {
				fillStyle: '#272b33',
			},
		})

		const wall_left = Bodies.rectangle(0, 100, 1, 10000, {
			isStatic: true,
			friction: 0,
			label: 'wall_left',
			render: {
				fillStyle: '#272b33'
			}
		})

		const wall_right = Bodies.rectangle(0, 100, 1, 10000, {
			isStatic: true,
			friction: 0,
			label: 'wall_right',
			render: {
				fillStyle: '#272b33'
			}
		})

		const ceiling = Bodies.rectangle(0, 100, 0, 100, {
		  isStatic: true,
		  friction: 0,
		  label: 'ceiling',
		  render: {
		    fillStyle: '#272b33',
		  },
		})

		const homeBlock = Bodies.rectangle(0, 0, 0, 0, {
			isStatic: true,
			friction: 0,
			label: 'homeBlock',
			render: {
			  fillStyle: 'transparent',
			},
		})

		const workExpBlock = Bodies.rectangle(0, 0, 0, 0, {
			isStatic: true,
			friction: 0,
			label: 'workExpBlock',
			render: {
			  fillStyle: 'transparent',
			},
		})

		const educationBlock = Bodies.rectangle(0, 0, 0, 0, {
			isStatic: true,
			friction: 0,
			label: 'educationBlock',
			render: {
				fillStyle: 'transparent',
			},
		})

		World.add(engine.world, [
			floor,
			wall_left,
			wall_right,
			ceiling,
			homeBlock,
			workExpBlock,
			educationBlock
		])
		
		engine.gravity.y = 0.5

		Matter.Runner.run(engine)
		Render.run(render)

		setConstraints(boxRef.current.getBoundingClientRect())
		setRenderer(render)

		window.addEventListener('resize', handleResize)


		return () => {
			window.removeEventListener('resize', handleResize)
			if (renderer)
				Matter.Events.off(renderer.engine, 'afterUpdate', mainGameLoop)
		}

		
	}, [])

	useEffect(() => {

		if (constraints) {
			let { width, height } = constraints

			// Dynamically update canvas and bounds
			renderer.bounds.max.x = width
			renderer.bounds.max.y = height
			renderer.options.width = width
			renderer.options.height = height
			renderer.canvas.width = width
			renderer.canvas.height = height

			// Dynamically update floor
			const floor = renderer.engine.world.bodies[0]

			const wall_left = renderer.engine.world.bodies[1]

			const wall_right = renderer.engine.world.bodies[2]

			const ceiling = find_body_in_array('ceiling', renderer.engine.world.bodies)

			const homeBlock = find_body_in_array('homeBlock', renderer.engine.world.bodies)
			const workExpBlock = find_body_in_array('workExpBlock', renderer.engine.world.bodies)
			const educationBlock = find_body_in_array('educationBlock', renderer.engine.world.bodies)

			Matter.Body.setPosition(floor, {
				x: width / 2,
				y: height + STATIC_DENSITY / 2,
			})

			Matter.Body.setVertices(floor, [
				{ x: 0, y: height },
				{ x: width*2, y: height},
				{ x: width*2, y: height + STATIC_DENSITY },
				{ x: 0, y: height + STATIC_DENSITY },
			])

			Matter.Body.setPosition(wall_right, {
				x: width + 100,
				y: height + STATIC_DENSITY / 2
			})

			Matter.Body.setPosition(wall_left, {
				x: -100,
				y: height + STATIC_DENSITY / 2
			})

			Matter.Body.setPosition(ceiling, {
				x: width / 2,
				y: -1,
			})

			Matter.Body.setVertices(ceiling, [
				{ x: 0, y: -5 },
				{ x: width*2, y: -5},
				{ x: width*2, y: -1},
				{ x: 0, y: -1},
			])

			const homeBlockElem = document.querySelector('#nav-home')
			const homeRect = homeBlockElem.getBoundingClientRect()
			Matter.Body.setPosition(homeBlock, {
				x: homeRect.x + homeBlockElem.offsetWidth/2,
				y: homeRect.y + homeBlockElem.offsetHeight/2,
			})

			Matter.Body.setVertices(
				homeBlock, 
				computeBodyVertices(
					homeRect.x, 
					homeRect.y, 
					homeBlockElem.offsetWidth,
					homeBlockElem.offsetHeight
				)
			)

			const workExpBlockElem = document.querySelector('#nav-work-exp')
			const workExpRect = workExpBlockElem.getBoundingClientRect()
			Matter.Body.setPosition(workExpBlock, {
				x: workExpRect.x + workExpBlockElem.offsetWidth/2,
				y: workExpRect.y + workExpBlockElem.offsetHeight/2,
			})

			Matter.Body.setVertices(
				workExpBlock,
				computeBodyVertices(
					workExpRect.x, 
					workExpRect.y, 
					workExpBlockElem.offsetWidth,
					workExpBlockElem.offsetHeight
				)
			)

			const educationBlockElem = document.querySelector('#nav-education')
			const educationRect = educationBlockElem.getBoundingClientRect()
			Matter.Body.setPosition(educationBlock, {
				x: educationRect.x + educationBlockElem.offsetWidth/2,
				y: educationRect.y + educationBlockElem.offsetHeight/2,
			})

			Matter.Body.setVertices(
				educationBlock,
				computeBodyVertices(
					educationRect.x, 
					educationRect.y, 
					educationBlockElem.offsetWidth,
					educationBlockElem.offsetHeight
				)
			)

			let penguin = find_body_in_array('penguin', renderer.engine.world.bodies)
			// spawn character into the game
			if (spawn_character) {
				spawnCharacter(false)
			} else {
				if (penguin.x > width || penguin.x < 0 || penguin.y > height || penguin.y < 0) {
					Matter.Body.setPosition(penguin, {
						x: width/2,
						y: 2
					})
				}

			}	
		}

		if (renderer) {
			// unsubscribe
			Matter.Events.off(renderer.engine, 'afterUpdate', mainGameLoop)
			// resubscribe
			Matter.Events.on(renderer.engine, 'afterUpdate', mainGameLoop)
		}
	}, [renderer, constraints])

	useEffect(() => {
		// Add character to the game
		if (renderer) {
			let { width } = constraints
			let randomX = Math.floor(Math.random() * -width) + width

			const penguin = Matter.Bodies.rectangle(randomX, 2, 25, 25,
				{
					friction: 0,
					render: {
						sprite: {
							texture: loaded_sprites[SPRITE_PATH_RIGHT + DEFAULT_SPRITE],
							xScale: 0.4,
							yScale: 0.4
						}
					},
					inertia: Infinity,
					inertiaInverse: Infinity,
					label: 'penguin'
				}
			)
			Matter.World.add(renderer.engine.world, penguin)
		}
	}, [spawn_character])

	return (
		<div
			className='penguin'
			style = {{
				height: '100px'
			}}
		> 
			<div
				ref={boxRef}
				style={{
					position: 'absolute',
					top: 0,
					left: 0,
					width: '100%',
					height: '100px',
					pointerEvents: 'none',
				}}
			>
				<canvas ref={canvasRef} />
			</div>
		</div>
	)
}