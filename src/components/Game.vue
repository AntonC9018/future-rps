<template>
  <div>

    <div class="stats">
      <div>Your hp: 
        <div class="heart-text">{{ game.players[0].currentState.hp }}</div>
        <div class="heart"></div>
      </div>
      <div>Enemy hp:
        <div class="heart-text">{{ game.players[1].currentState.hp }}</div>
        <div class="heart"></div>
      </div>

    </div>

    <button 
      @click="selectAction(ACTIONS.ROCK)" 
      :class="{ selected: selectAction == ACTIONS.ROCK }"
    >
      Rock
    </button>
    <button 
      @click="selectAction(ACTIONS.PAPER)" 
      :class="{ selected: selectAction == ACTIONS.PAPER }"
    >
      Paper
    </button>
    <button 
      @click="selectAction(ACTIONS.SCISSORS)" 
      :class="{ selected: selectAction == ACTIONS.SCISSORS }"
    >
      Scissors
    </button>

    <button 
      @click="endRound()" 
      :disabled="selectedAction == null"
    >
      Go!
    </button>

    <button
      @click="reset()">
      Reset
    </button>

    <div class="predictions">
      <div class="predictions-title">
        Predictions
      </div>
      <div 
        v-for="(prediction, index) in predictions" 
        :key="'pred-' + index"
        :class="{ 
          'prediction': true,
          'past-prediction': index < game.turn, 
          'next-prediction': index == game.turn 
        }"
      >

        <h5>Entry #{{ index + 1 }}</h5>

        You play <span class="play">{{ actions[prediction.playerAction] }}</span> 
        against your opponent's <span class="play">{{ actions[prediction.opponentAction] }}.</span>
        ({{ (prediction.opponentActionsPmf[prediction.opponentAction] * 100).toFixed(2) }}% predicted probability)

        <br>As a result, you 
          <span 
            :class="{
              'positive-result': prediction.result == RESULTS.WIN,
              'negative-result': prediction.result == RESULTS.LOSE
            }">
            {{ results[prediction.result] }}.
          </span>

        <div v-if="prediction.result == RESULTS.WIN">
          The hp of your opponent drops down to {{ prediction.opponentHp }}.

          
        </div>
        <div v-else-if="prediction.result == RESULTS.LOSE">
          Your hp drops down to {{ prediction.playerHp }}.
        </div>
        
      </div>

      <div 
        v-if="lastPrediction.deadEnd"
        class="dead-end"  
      >

        <div 
          v-if="lastPrediction.result == RESULTS.WIN" 
          class="positive-result"
        >
          Your opponent dies. You become the God of time.
        </div>
        
        <div 
          v-else-if="lastPrediction.result == RESULTS.LOSE" 
          class="negative-result"
        >
          DEAD END
        </div>
        
      </div>      

    </div>
  </div>
</template>

<script>

import { 
  Player,
  Game,
  getPredictionsBySimulation,
  getGameStateAsPrediction
} from '../game/game'

import { createPmfs, createRandomPmfs } from '../game/pmf'
import * as ACTIONS from '../game/actions' 
import { WIN, LOSE, TIE } from '../game/offsets'
// import { indexOfMax } from '../game/utils'

const START_HP = 3

export default {
  data() {
    let game = new Game()
    let opponentGame = new Game()

    let playerPmfs = createRandomPmfs()
    let opponentPmfs = createRandomPmfs()
    
    game.addPlayer(playerPmfs, START_HP)
    game.addPlayer(opponentPmfs, START_HP)

    opponentGame.addPlayer(opponentPmfs, START_HP)
    opponentGame.addPlayer(playerPmfs, START_HP)

    game.setupPredicPmf()
    opponentGame.setupPredicPmf()

    return {
      game, 
      opponentGame,
      ACTIONS,
      actions: [ 'rock', 'paper', 'scissors' ],
      RESULTS: { WIN, LOSE, TIE },
      results: [ 'win the round', 'lose the round', 'tie' ],
      predictions: getPredictionsBySimulation(game),
      selectedAction: null
    }
  },

  methods: {

    selectAction(action) {
      this.selectedAction = action
      console.log(this.game)
    },

    setAction() {
      let opponentAction = this.predictions[this.game.turn].opponentAction
      this.game.setPlayerAction(0, this.selectedAction)
      this.game.setPlayerAction(1, opponentAction)
      this.opponentGame.setPlayerAction(0, opponentAction)
      this.opponentGame.setPlayerAction(1, this.selectedAction)
    },

    reset() {
      this.game = new Game()
      this.opponentGame = new Game()

      let playerPmfs = createRandomPmfs()
      let opponentPmfs = createRandomPmfs()
      
      this.game.addPlayer(playerPmfs, START_HP)
      this.game.addPlayer(opponentPmfs, START_HP)

      this.opponentGame.addPlayer(opponentPmfs, START_HP)
      this.opponentGame.addPlayer(playerPmfs, START_HP)

      this.game.setupPredicPmf()
      this.opponentGame.setupPredicPmf()

      this.predictions = getPredictionsBySimulation(this.game)
    },

    updatePredictions() {
      let roundResult = getGameStateAsPrediction(this.game)
      let newPredictions = getPredictionsBySimulation(this.game)
      this.predictions = 
        [...this.predictions.slice(0, this.game.turn), ...newPredictions]
      this.predictions[this.game.turn - 1] = roundResult
    },

    endRound() {
      this.setAction()
      this.game.endRound()
      this.opponentGame.endRound()
      this.updatePredictions()
      this.selectedAction = null
    }
  },
  computed: {
    lastPrediction: function() {
      return this.predictions[this.predictions.length - 1]
    }
  }
}
</script>

<style>
.selected {
  background-color: blueviolet;
}
.past-prediction {
  background-color: grey;
  color: rgb(64.8%, 64.8%, 64.8%);
}
.positive-result {
  color: green;
  font-style: italic;
}
.negative-result {
  color: red;
  font-style: italic;
}
.play {
  font-weight: bold;
  /* text-decoration: underline; */
}
.prediction {
  padding: 15px;
  border-bottom: 1px solid rgb(44.8%, 44.8%, 44.8%);
}
.dead-end {
  padding: 15px;
  text-align: center;
}
.stats {
  padding: 10px;
}
/* 
.dead-end {
  background-color: #E6ECF0;
  color: #34495E;
} */

.predictions {
  width: 700px;
  height: 400px;
  overflow-y: scroll;
  padding: 20px;
  display: flex;
  align-items: left;
  flex-direction: column;
}

.predictions-title {
  border-bottom: 1px solid rgb(44.8%, 44.8%, 44.8%);
  padding: 10px;
  text-align: center;
  font-size: 25px;
  font-weight: bold;
}

/* Heart stolen from https://stackoverflow.com/questions/17386168/how-to-create-a-heart-shape-using-css */
.heart-text{
  position:absolute;
  z-index:3;
  margin-left: 0.7em;
  margin-top: 0.45em;
  color:white;
}
.heart {
  position:relative;
  width:2em;
  height:2em;
}

.heart:before,.heart:after {
  position:absolute;
  content:"";
  left:1em;
  top:0;
  width:1em;
  height:1.8em;
  background:#F00000;
  -moz-border-radius:1em 1em 0 0;
  border-radius:1em 1em 0 0;
  -webkit-transform:rotate(-45deg);
  -moz-transform:rotate(-45deg);
  -ms-transform:rotate(-45deg);
  -o-transform:rotate(-45deg);
  transform:rotate(-45deg);
  -webkit-transform-origin:0 100%;
  -moz-transform-origin:0 100%;
  -ms-transform-origin:0 100%;
  -o-transform-origin:0 100%;
  transform-origin:0 100%;
}

.heart:after {
  left: 0;
  -webkit-transform:rotate(45deg);
  -moz-transform:rotate(45deg);
  -ms-transform:rotate(45deg);
  -o-transform:rotate(45deg);
  transform:rotate(45deg);
  -webkit-transform-origin:100% 100%;
  -moz-transform-origin:100% 100%;
  -ms-transform-origin:100% 100%;
  -o-transform-origin:100% 100%;
  transform-origin:100% 100%;
}
</style>