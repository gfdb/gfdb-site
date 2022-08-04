import React, { useEffect, useState, useRef } from 'react'
import Matter from 'matter-js'
import { use_event } from '../hooks'
<<<<<<< Updated upstream
import { trim_url_domain, preload_sprites, find_body_in_array} from '../../helpers'
=======
import { trim_url_domain, preload_sprites, find_body_in_array } from '../../helpers'
>>>>>>> Stashed changes
import './penguin.scss'

const STATIC_DENSITY = 15

const SPRITE_PATH_RIGHT = '/penguin/right'
const SPRITE_PATH_LEFT = '/penguin/left'

const DEFAULT_SPRITE = '/penguin_walk01.png'

const SLIDE_ANIMATION = [
	'/penguin_slide01.png',
	'/penguin_slide02.png'
]

const JUMP_ANIMATION = [
	'/penguin_jump01.png',
	'/penguin_jump02.png',
	'/penguin_jump03.png'
]

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
	const [scene, setScene] = useState()

	const [character_movement, setCharacterMovement] = useState(true)
	const [spawn_character, spawnCharacter] = useState(true)

	// const [update_sprite, updateSprite] = useState(true)

	const [movementStateArray, setMovementArray] = useState({movement_array: []})

	const [update_sprite_flag, updateSpriteFlag] = useState(false)

	const handleResize = () => {
		setConstraints(boxRef.current.getBoundingClientRect())
	}

	useEffect(() => {
		if (!spawn_character) {
			const interval = setInterval(() => {
				if (Array.isArray(movementStateArray.movement_array) 
						&& movementStateArray.movement_array.length) {
					setCharacterMovement(character_movement => !character_movement)
				}

				
				
				// check to see if penguin is in bounds, if not 
				// teleport him back in bounds on the opposite side of the screen
				if (scene && constraints) {
									
					const penguin = scene.engine.world.bodies[3]

					if (penguin !== undefined) {

						if (penguin.position.x > constraints.width)
						Matter.Body.setPosition(
							penguin,
							{x: 10, y: penguin.position.y}
						)
						if (penguin.position.x < 0)
							Matter.Body.setPosition(
								penguin,
								{x: constraints.width, y: penguin.position.y}
							)

						let sprite_to_apply = undefined
						let current_texture = trim_url_domain(penguin.render.sprite.texture)

						// penguin was moving left
						if (penguin.velocity.x < 0 && penguin.velocity.x > -1)
							sprite_to_apply = SPRITE_PATH_LEFT
						// penguin was moving right
						else if (penguin.velocity.x > 0 && penguin.velocity.x < 1)
							sprite_to_apply = SPRITE_PATH_RIGHT
						
						if (sprite_to_apply !== undefined) {
							switch (current_texture) {
								case (sprite_to_apply + SLIDE_ANIMATION[1]):
									sprite_to_apply += SLIDE_ANIMATION[0]
									break

								case (sprite_to_apply + SLIDE_ANIMATION[0]):
									sprite_to_apply += DEFAULT_SPRITE
									break

								default:
									sprite_to_apply = current_texture
							}
						}

						if (sprite_to_apply !== undefined && 
								penguin.render.sprite.texture !== sprite_to_apply) {
							penguin.render.sprite.texture = loaded_sprites[sprite_to_apply]
						}
							
					}
				}
			}, 35)
			return () => clearInterval(interval)
		}
		
	}, [spawn_character])


	useEffect(() => {
		if (update_sprite_flag && scene) {

			const penguin = scene.engine.world.bodies[3]
			const floor = scene.engine.world.bodies[0]

			let  current_texture = trim_url_domain(penguin.render.sprite.texture)
			let sprite_to_apply = undefined

			// penguin moving right
			if (penguin.velocity.x > 1)
				sprite_to_apply = SPRITE_PATH_RIGHT
			// penguin moving left
			else if (penguin.velocity.x < -1)
				sprite_to_apply = SPRITE_PATH_LEFT
			
			if (sprite_to_apply !== undefined) {
				// if penguin is not jumping
				if (Matter.Collision.collides(penguin, floor) != null) {
					switch(current_texture) {
						case (sprite_to_apply + DEFAULT_SPRITE):
							sprite_to_apply += SLIDE_ANIMATION[0]
							break
						case (sprite_to_apply + SLIDE_ANIMATION[0]):
							sprite_to_apply += SLIDE_ANIMATION[1]
							break
						case (sprite_to_apply + SLIDE_ANIMATION[1]):
							sprite_to_apply += SLIDE_ANIMATION[1]
							break
						default:
							sprite_to_apply += DEFAULT_SPRITE
					}
				} else {
					// TODO: add jump animation
					sprite_to_apply = current_texture
				}
			}
			if (sprite_to_apply !== undefined 
					&& current_texture !== sprite_to_apply) {
				penguin.render.sprite.texture = loaded_sprites[sprite_to_apply]
			}
			updateSpriteFlag(false)
		}
	}, [update_sprite_flag])

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
		if (scene) {
			
			let floor = scene.engine.world.bodies[0]
			const penguin = scene.engine.world.bodies[3]
			
			if(movementStateArray.movement_array.includes('right')) {
				Matter.Body.applyForce(
					penguin,
					penguin.position,
					Matter.Vector.create(0.001, 0)
				)
			}

			if(movementStateArray.movement_array.includes('left')) {
				Matter.Body.applyForce(
					penguin,
					penguin.position,
					Matter.Vector.create(-0.001, 0)
				)
			}

			if(movementStateArray.movement_array.includes('up')) {
				// check to make sure they are not already jumping
				if (Matter.Collision.collides(penguin, floor) != null) {
					Matter.Body.applyForce(
						penguin,
						penguin.position,
						Matter.Vector.create(0, -0.012),
					)
				}
			}
			updateSpriteFlag(true)
		}

	}, [movementStateArray, character_movement])

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
			render: {
				fillStyle: '#272b33',
			},
		})

		const wall_left = Bodies.rectangle(0, 100, 1, 10000, {
			isStatic: true,
			friction: 0,
			render: {
				fillStyle: '#272b33'
			}
		})

		const wall_right = Bodies.rectangle(0, 100, 1, 10000, {
			isStatic: true,
			friction: 0,
			render: {
				fillStyle: '#272b33'
			}
		})

		// const ceiling = Bodies.rectangle(0, 100, 0, 100, {
		//   isStatic: true,
		//   friction: 0,
		//   render: {
		//     fillStyle: '#272b33',
		//   },
		// })

		World.add(engine.world, [floor])
		World.add(engine.world, [wall_left])
		World.add(engine.world, [wall_right])
		// World.add(engine.world, [ceiling])
		
		engine.gravity.y = 0.5

		Matter.Runner.run(engine)
		Render.run(render)

		setConstraints(boxRef.current.getBoundingClientRect())
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

			// Dynamically update floor
			const floor = scene.engine.world.bodies[0]

			const wall_left = scene.engine.world.bodies[1]

			const wall_right = scene.engine.world.bodies[2]

			// const ceiling = scene.engine.world.bodies[3]


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

			let penguin = find_body_in_array('penguin', scene.engine.world.bodies)
			// spawn character into the game
			if (spawn_character)
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
	}, [scene, constraints])

	useEffect(() => {
		// Add character to the game
		if (scene) {
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
					label: 'penguin'
				}
			)
			Matter.World.add(scene.engine.world, penguin)
		}
	}, [spawn_character])

	return (
		<div className='penguin'> 
			<div
				ref={boxRef}
				style={{
					position: 'absolute',
					top: 0,
					left: 0,
					width: '100%',
					height: '10%',
					pointerEvents: 'none',
				}}
			>
				<canvas ref={canvasRef} />
			</div>
		</div>
	)
}