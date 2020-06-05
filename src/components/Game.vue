<template>
  <div>

    <div class="stats">
      <div>Your hp: 
        <div class="heart-text">{{ gm.player.currentState.hp }}</div>
        <div class="heart"></div>
      </div>
      <div>Enemy hp:
        <div class="heart-text">{{ gm.opponent.currentState.hp }}</div>
        <div class="heart"></div>
      </div>

    </div>

    <button 
      @click="selectAction(ACTIONS.ROCK)" 
      :class="{ selected: selectedAction == ACTIONS.ROCK }"
    >
      Rock
    </button>
    <button 
      @click="selectAction(ACTIONS.PAPER)" 
      :class="{ selected: selectedAction == ACTIONS.PAPER }"
    >
      Paper
    </button>
    <button 
      @click="selectAction(ACTIONS.SCISSORS)" 
      :class="{ selected: selectedAction == ACTIONS.SCISSORS }"
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
        Future log
      </div>
      <div 
        v-for="(entry, index) in entries" 
        :key="'pred-' + index"
        :class="{ 
          'prediction': true,
          'past-prediction': index < turn, 
          'next-prediction': index == turn 
        }"
      >

        <h5>Entry #{{ index + 1 }}</h5>

        You play <span class="play">{{ actions[entry.playerAction] }}</span> 
        against your opponent's <span class="play">{{ actions[entry.opponentAction] }}.</span>
        ({{ (entry.opponentActionsPmf[entry.opponentAction] * 100).toFixed(2) }}% predicted probability)

        <br>As a result, you 
          <span 
            :class="{
              'positive-result': entry.result == RESULTS.WIN,
              'negative-result': entry.result == RESULTS.LOSE
            }">
            {{ results[entry.result] }}.
          </span>

        <div v-if="entry.result == RESULTS.WIN">
          The hp of your opponent drops down to {{ entry.opponentHp }}.

          
        </div>
        <div v-else-if="entry.result == RESULTS.LOSE">
          Your hp drops down to {{ entry.playerHp }}.
        </div>
        
      </div>

      <div 
        v-if="lastPrediction && lastPrediction.deadEnd"
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

import GameManager from '../game/manager'

import * as ACTIONS from '../game/actions' 
import { WIN, LOSE, TIE } from '../game/offsets'


export default {
  data() {
    return {
      gm: new GameManager(),
      ACTIONS,
      actions: [ 'rock', 'paper', 'scissors' ],
      RESULTS: { WIN, LOSE, TIE },
      results: [ 'win the round', 'lose the round', 'tie' ],
      selectedAction: null
    }
  },

  methods: {

    selectAction(action) {
      this.selectedAction = action
      this.gm.setPlayerAction(this.selectedAction)
    },

    reset() {
      this.gm.reset()
    },

    async endRound() {
      await this.gm.ready()
      this.gm.endRound()
      this.selectedAction = null
    }
  },

  computed: {

    turn: function() {
      return this.gm.game.turn
    },

    entries: function() {
      return [...this.gm.history, ...this.gm.predictions]
    },

    lastPrediction: function() {
      return this.entries[this.entries.length - 1]
    }
  }
}
</script>

<style scoped>
.selected {
  background-color: rgb(100%, 99.2%, 60.1%);
  border-color:rgb(100%, 99.2%, 60.1%);
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

/* Heart shamelessly stolen from https://stackoverflow.com/questions/17386168/how-to-create-a-heart-shape-using-css */
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