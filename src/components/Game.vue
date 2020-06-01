<template>
  <div>
    <button 
      @input="selectAction(ACTIONS.ROCK)" 
      :class="{ selected: selectAction == ACTIONS.ROCK }"
    >
      Rock
    </button>
    <button 
      @input="selectAction(ACTIONS.PAPER)" 
      :class="{ selected: selectAction == ACTIONS.PAPER }"
    >
      Paper
    </button>
    <button 
      @input="selectAction(ACTIONS.SCISSORS)" 
      :class="{ selected: selectAction == ACTIONS.SCISSORS }"
    >
      Scissors
    </button>

    <button 
      @input="endRound()" 
      :disabled="selectedAction == null"
    >
      Go!
    </button>

    <div v-for="(prediction, index) in predictions" :key="'pred-' + index">

      You play {{ actions[prediction.playerAction] }} 
      against your opponent's {{ actions[prediction.opponentAction] }}
      ({{ (actions[prediction.opponentActionPmf[prediction.opponentAction]] * 100).toFixed(2) }}% predicted probability)

      <br>As a result, you {{ results[prediction.result] }}

      <div v-if="prediction.result == RESULTS.WIN">
        The hp of your opponent drops down to {{ prediction.opponentHp }}.

        <div v-if="prediction.deadEnd">
          Your opponent dies. You become the God of time.
        </div>
      </div>
      <div v-else-if="prediction.result == RESULTS.LOSE">
        Your hp drops down to {{ prediction.playerHp }}.      
      
        <div v-if="prediction.deadEnd">
          --------- DEAD END ---------
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import { 
  Player,
  Game,
  getPredictionsBySimulation
} from '../game/game'

import { createPmfs } from '../game/pmf'
import * as ACTIONS from '../game/actions' 
import { WIN, LOSE, TIE } from '../game/offsets'
// import { indexOfMax } from '../game/utils'

export default {
  data() {
    let game = new Game()
    let opponentGame = new Game()

    let playerPmfs = createPmfs()
    let opponentPmfs = createPmfs()
    
    game.addPlayer(playerPmfs, 3)
    game.addPlayer(opponentPmfs, 3)

    opponentGame.addPlayer(opponentPmfs, 3)
    opponentGame.addPlayer(playerPmfs, 3)

    game.setupPredicPmf()
    opponentGame.setupPredicPmf()

    return {
      game, 
      opponentGame,
      ACTIONS,
      actions: [ 'rock', 'paper', 'scissors' ],
      RESULTS: { WIN, LOSE, TIE },
      results: [ 'win the round.', 'lose the round', 'tie' ],
      predictions: getPredictionsBySimulation(game),
      selectedAction: null
    }
  },

  methods: {

    selectAction(action) {
      this.selectedAction = action
    },

    setAction() {
      this.game.setPlayerAction(0, this.selectedAction)
      this.game.setPlayerAction(1, this.predictions[0].opponentAction)
      this.opponentGame.setPlayerAction(0, this.predictions[0].opponentAction)
      this.opponentGame.setPlayerAction(1, this.selectedAction)
    },

    updatePredictions() {
      if (
        this.game.players[0].lastState.action == this.predictions[0].playerAction
        && this.game.players[1].lastState.action == this.predictions[0].opponentAction
      ) {
        this.predictions = this.predictions.slice(1)
      } else {
        this.predictions = getPredictionsBySimulation(this.game)
      }
    },

    endRound() {
      this.game.endRound()
      this.opponentGame.endRound()
      this.updatePredictions()
      this.selectedAction = null
    }
  }
}
</script>

<style>
.selected {
  background-color: blueviolet;
}
</style>