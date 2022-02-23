import React, { useState, useEffect } from "react";
import styles from './engine.module.scss'
import penguin from '../penguins/small/penguin_walk01.png'
import { useEvent } from '../../hooks';

function CreateEngine(setState) {
    this.settings = {
      tile: 2, // width of one tile
    };
  
    // current char position
    this.character = 0;
    this.jump = false;
    this.direction = 'up';
    this.positionx = 0;
    this.positiony = 0;
    this.max = this.settings.tile * 25;

    const doJump = () => {
        console.log(this.positiony)
        // if not jumping
        if (!this.jump) {
            this.positiony = 0;
            this.direction = 'up';
            return;
        }

        // if finished jumping, reset and return
        if (this.direction === 'down' && this.positiony <= 0) {
            this.jump = false;
            this.positiony = 0;
            this.direction = 'up';
            return;
        }

        // if max height
        if (this.positiony >= this.max) this.direction = 'down';

        // depending on the direction increment the jump.
        if (this.direction === 'up') {
            this.positiony += this.settings.tile;
        } else {
            this.positiony -= this.settings.tile;
        }

    };
  
    // function that will be continuously ran
    this.repaint = () => {
      // move the character by one tile
    //   this.positiony += this.settings.tile;

      // check for jump and do it
      doJump();
  
      // set state for use in the component
      setState({ positionx: this.positionx , positiony: this.positiony });
  
      // start repaint on next frame
      return requestAnimationFrame(this.repaint);
    };
  
    // trigger initial paint
    this.repaint();
    return () => ({
        jump: () => {
            // if jump is not active trigger jump
            if (!this.jump) {
                this.jump = true;
            }
        }
    });
  }


function Engine() {

    // game state
    const [gameState, setGameState] = useState({ character: 0 });

    // trigger game to start
    const [start, setStart] = useState(false);

    // if game is running
    const [started, setStarted] = useState(false);

    // instance of game engine
    const [engine, setEngine] = useState(null);

    const handleKeyPress = (e) => {

        if (e.key === ' ' || e.key === 'ArrowUp') {
            if (!started && !start ) {
                setStart(true);
                return;
            }
            engine.jump();
            console.log('jumped')

        }

        if (e.key === 'ArrowRight' ){
            console.log('you pressed right')
        }

        if (e.key === 'ArrowDown' ){
            console.log('you pressed down')
        }

        if (e.key === 'ArrowLeft' ){
            console.log('you pressed left')
        }




    };

    useEvent('keydown', handleKeyPress);

    useEffect(() => {
        if (start) {
            setStarted(true);
            setStart(false);
            // create new engine and save it to the state to use
            setEngine(
                new CreateEngine(
                    state => setGameState(state),
                )
            );
        }
    }
    );

    return(
    <div
      className={styles.container}
    >
      <img src = {penguin} alt='penguin'
        className={styles.character}
        style = {{
            transform: `translate(${gameState.positionx}px, -${gameState.positiony}px)`, // move char in opposite direction
        }}
      />
    </div>
    )
}

export default Engine;
