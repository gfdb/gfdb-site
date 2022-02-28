import React, { useEffect, useState, useRef } from 'react'
import Matter from 'matter-js'
import { use_event } from '../hooks';

const STATIC_DENSITY = 15
const PARTICLE_SIZE = 6
const CHARACTER_BOUNCYNESS = 0.5

// urls have to be preloaded for some reason in matterjs
// so thats what this is used for
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

  const [someStateValue, setSomeStateValue] = useState(false)

  const [character_movement, setCharacterMovement] = useState('none')
  const [character_velocity, setCharacterVelocity] = useState(0)

  const [spawn_character, spawnCharacter] = useState(true)

  const [update_sprite, updateSprite] = useState(false)

  const handleResize = () => {
    setContraints(boxRef.current.getBoundingClientRect())
  }

  const handleClick = () => {
    setSomeStateValue(!someStateValue)
  }

  const handleKeyPress = (e) => {

    if (e.key === ' ' || e.key === 'ArrowUp') {
      setCharacterMovement('up')
      console.log('jumped')
    }

    if (e.key === 'ArrowRight' ){
      setCharacterMovement('right')
      console.log('you pressed right')
    }

    if (e.key === 'ArrowDown'){
      setCharacterMovement('down')
      console.log('you pressed down')
    }

    if (e.key === 'ArrowLeft' ){
      setCharacterMovement('left')
      console.log('you pressed left')
    }
  };

  use_event('keydown', handleKeyPress);

  useEffect(() => {
    if (scene) {
      console.log(scene.engine.world.bodies[1].position)
      // console.log(constraints.width)
      // console.log('here')
      // console.log(scene.engine.world.bodies[1])

      
      if(character_movement.localeCompare('right') === 0) {
        Matter.Body.applyForce(
          scene.engine.world.bodies[1],
          scene.engine.world.bodies[1].position,
          Matter.Vector.create(0.001, 0)
        )
      }

      if(character_movement.localeCompare('left') === 0) {
        Matter.Body.applyForce(
          scene.engine.world.bodies[1],
          scene.engine.world.bodies[1].position,
          Matter.Vector.create(-0.001, 0)
        )
      }

      if(character_movement.localeCompare('up') === 0) {
        Matter.Body.applyForce(
          scene.engine.world.bodies[1],
          scene.engine.world.bodies[1].position,
          Matter.Vector.create(0, 0.03),
        )
      }
      setCharacterMovement('static')
    }

  }, [character_movement])

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
        background: 'transparent',
        wireframes: false,
      },
    })

    const floor = Bodies.rectangle(0, 100, 0, STATIC_DENSITY, {
      isStatic: true,
      friction: 0,
      render: {
        fillStyle: 'blue',
      },
    })

    World.add(engine.world, [floor])

    Matter.Runner.run(engine)
    Render.run(render)

    setContraints(boxRef.current.getBoundingClientRect())
    setScene(render)

    window.addEventListener('resize', handleResize)
  }, [])

  // useEffect(() => {
    
  // }, [character])

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

      console.log('height' + height)

      Matter.Body.setPosition(floor, {
        x: width / 2,
        y: height + STATIC_DENSITY / 2,
      })

      console.log('width: ' + width)
      console.log('height: ' + height)
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

      // if (scene.engine.world.bodies[1])
    }
  }, [spawn_character])

  // useEffect(() => {
    
  // }, [character_velocity])

  return (
    <div
      style={{
        position: 'relative',
        border: '1px solid white',
        padding: '8px',
      }}
    >
      {/* <div style={{ textAlign: 'center' }}>Checkout</div> */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr auto',
          rowGap: '16px',
          marginBottom: '32px',
        }}
      >
        {/* <div>SubTitle</div>
        <div>£xxx</div>
        <div>Discount</div>
        <div>£xxx</div>
        <div>Total</div>
        <div>£xxx</div> */}
      </div>

      {/* <button
        style={{
          cursor: 'pointer',
          display: 'block',
          textAlign: 'center',
          marginBottom: '16px',
          width: '100%',
        }}
        onClick={() => handleClick()}
      >
        Checkout
      </button> */}

      <div
        ref={boxRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
        }}
      >
        <canvas ref={canvasRef} />
      </div>
    </div>
  )
}