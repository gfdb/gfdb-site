import './home.scss';
import { useEffect, useRef, useState } from 'react';
import Matter, { use } from 'matter-js'


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

		const floor = Bodies.rectangle(0, 1000, 0, 100, {
			isStatic: true,
			friction: 0,
			render: {
				fillStyle: 'light blue',
			},
		})

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

		World.add(engine.world, [floor])
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
