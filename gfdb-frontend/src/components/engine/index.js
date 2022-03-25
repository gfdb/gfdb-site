import React, { useEffect, useState, useRef } from 'react'
import Matter, { use } from 'matter-js'
import { use_event } from '../hooks';

const STATIC_DENSITY = 15
const PARTICLE_SIZE = 6

// urls have to be preloaded in matterjs
const loadImage = (url, onSuccess) => {
  const img = new Image();
  img.onload = () => {
    onSuccess(img.src);
  };
  img.src = url;
};

export default function Comp() {

  const boxRef = useRef(null)
  const canvasRef = useRef(null)

  const [constraints, setContraints] = useState()
  const [scene, setScene] = useState()

  // const [someStateValue, setSomeStateValue] = useState(false)

  const [character_movement, setCharacterMovement] = useState(true)
  // const [character_velocity, setCharacterVelocity] = useState(0)

  const [spawn_character, spawnCharacter] = useState(true)

  // const [update_sprite, updateSprite] = useState(true)

  const [movementStateArray, setMovementArray] = useState({
    movement_array: []
  })

  // const [update_sprqite, updateSprite] = useState(false)

  const handleResize = () => {
    setContraints(boxRef.current.getBoundingClientRect())
  }

  // const handleClick = () => {
  //   setSomeStateValue(!someStateValue)
  // }

  const handleKeyDown = (e) => {

    if (e.key === ' ' || e.key === 'ArrowUp') {
      if (!movementStateArray.movement_array.includes('up')) {
        setMovementArray(movementStateArray => ({
          movement_array: [movementStateArray.movement_array, 'up']
        }))
      }
      console.log('jumped')
    }

    if (e.key === 'ArrowRight'){
      if (!movementStateArray.movement_array.includes('right')) {
        setMovementArray(movementStateArray => ({
          movement_array: [movementStateArray.movement_array, 'right']
        }))
      }
      console.log('you pressed right')
    }

    if (e.key === 'ArrowDown'){
      if (!movementStateArray.movement_array.includes('down')) {
        setMovementArray(movementStateArray => ({
          movement_array: [movementStateArray.movement_array, 'down']
        }))
      }
      console.log('you pressed down')
    }

    if (e.key === 'ArrowLeft') {
      console.log([movementStateArray.movement_array])
      if (!movementStateArray.movement_array.includes('left')) {
        setMovementArray(movementStateArray => ({
          movement_array: [movementStateArray.movement_array, 'left']
        }))
      }
      console.log('you pressed left')
    }
    console.log(movementStateArray.movement_array)
  };

  const handleKeyUp = (e) => {

    // considering

    var index = -1
    var temp_movement_array = movementStateArray.movement_array

    if (e.key === ' ' || e.key === 'ArrowUp')
      index = temp_movement_array.indexOf('up')

    if (e.key === 'ArrowRight')
      index = temp_movement_array.indexOf('right')

    if (e.key === 'ArrowDown')
      index = temp_movement_array.indexOf('down')      

    if (e.key === 'ArrowLeft')
      index = temp_movement_array.indexOf('left')

    if (index > -1) {
      setMovementArray({
        movement_array: temp_movement_array
      })
    }
  };

  use_event('keydown', handleKeyDown);
  use_event('keyup', handleKeyUp);

  useEffect(() => {
    if (scene) {

      let penguin = scene.engine.world.bodies[1]
      let floor = scene.engine.world.bodies[0]

      if (scene && penguin && constraints) {
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
      }
      if(movementStateArray.movement_array.includes('right')) {
        Matter.Body.applyForce(
          penguin,
          penguin.position,
          Matter.Vector.create(0.00005, 0)
        )
      }

      if(movementStateArray.movement_array.includes('left')) {
        Matter.Body.applyForce(
          penguin,
          penguin.position,
          Matter.Vector.create(-0.00005, 0)
        )
      }

      if(movementStateArray.movement_array.includes('up')) {
        // console.log(floor.position.y)
        // console.log(floor)
        // console.log(penguin)
        // console.log(Matter.Collision.collides(penguin, floor).collided)
        // check to make sure they are not already jumping
        if (Matter.Collision.collides(penguin, floor) != null) {
          console.log('jumped')
          Matter.Body.applyForce(
            penguin,
            penguin.position,
            Matter.Vector.create(0, -0.014),
          )
        }
      }
      if (movementStateArray.movement_array.length !== 0) {
        console.log(movementStateArray.movement_array.length)
        setCharacterMovement(!character_movement)
      }
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
        fillStyle: 'light blue',
      },
    })

    World.add(engine.world, [floor])

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

      // Dynamically update floor
      const floor = scene.engine.world.bodies[0]

      Matter.Body.setPosition(floor, {
        x: width / 2,
        y: height + STATIC_DENSITY / 2,
      })

      // console.log('width: ' + width)
      // console.log('height: ' + height)
      Matter.Body.setVertices(floor, [
        { x: 0, y: height },
        { x: width*2, y: height},
        { x: width*2, y: height + STATIC_DENSITY },
        { x: 0, y: height + STATIC_DENSITY },
      ])

      // spawn character into the game
      if (spawn_character) {
        spawnCharacter(false)
      }
    }
  }, [scene, constraints])

  useEffect(() => {
    // Add character to the game
    if (scene) {
      loadImage(
        "/penguin/penguin_walk01.png",
        url => {
          console.log("Success");
          let { width } = constraints
          let randomX = Math.floor(Math.random() * -width) + width
          Matter.World.add(
            scene.engine.world,
            Matter.Bodies.rectangle(randomX, 0, 25, 25,
              {
                friction: 0,
                render: {
                  sprite: {
                    texture: url,
                    xScale: 0.4,
                    yScale: 0.4
                  }
                }
              }
            )
          )
        }
      );
    }
  }, [spawn_character])

  return (
    <div> 
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