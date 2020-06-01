import {
  WIN,
  LOSE,
  TIE,
  HIGH_HEALTH,
  LOW_HEALTH,
  FIRST_TURN,
  predicOffsetByAction,
  playedOffsetByAction,
  resultOffsetByResult,
  healthOffsetByHealth
} from './offsets'

import {
  ROCK,
  PAPER,
  SCISSORS
} from './actions'

function createPlayerState(action, hp, predicPmf) {
  return {
    action, hp, predicPmf
  }
}

function cloneState(state) {
  return {
    action: state.action, 
    hp: state.hp, 
    predicPmf: state.predicPmf
  }
}

export class Player {

  constructor(pmfs, hp) {
    this.pmfs = pmfs
    this.currentState = createPlayerState(null, hp, null)
    this.lastState = createPlayerState()
  }

  clone() {
    let player = new Player(this.pmfs, this.hp)
    player.lastState =    cloneState(this.lastState)
    player.currentState = cloneState(this.currentState)
    return player
  }
}


export class Game {
  
  constructor() {
    this.players = []
    this.turn = 0
    this.deadEnd = false
    this.lastResult = null
    this.observations = []
  }

  makeObservation() {
    this.observations[0].push(
      {
        hp: this.players[0].currentState.hp,
        result: this.lastResult,
        predicPmf: this.players[0].lastState.predicPmf,
        enemyAction: this.players[1].lastState.action,
        actualAction: this.players[0].lastState.action
      }
    )
  }

  setPlayer(index, player) {
    this.players[index] = player
    this.observations[index] = []
  }

  setPlayerAction(index, action) {
    this.players[index].currentState.action = action
  }

  setupPredicPmf() {
    if (this.turn == 0) {
      this.players[0].currentState.predicPmf = 
        this.players[1].pmfs[FIRST_TURN]
      this.players[1].currentState.predicPmf =
        this.players[0].pmfs[FIRST_TURN]
    } else {

    }
  }

  addPlayer(pmfs, hp) {
    let index = this.players.length
    this.addPlayer(index, new Player(pmfs, hp))
    return index
  }

  damagePlayer(player) {
    player.currentState.hp -= 1
    if (player.currentState.hp == 0) {
      this.deadEnd = true
    }
  }

  forceEndRound() {
    if (!players[0].currentAction) {

    }
  }

  // play out the rock paper scissors logic
  // decrease the hp of the player that lost
  // update the players 'last' stats accordingly
  // this function relies on the assumption that player actions
  // have been set beforehand 
  endRound() {
    let player = this.players[0]
    let opponent = this.players[1]
    let a0 = player.currentState.action
    let a1 = opponent.currentState.action
    let result

    if (a0 == a1) {
      result = TIE
    } 
    else if (
         a0 == ROCK     && a1 == SCISSORS 
      || a0 == PAPER    && a1 == ROCK
      || a0 == SCISSORS && a1 == PAPER)
    {
      result = WIN
      this.damagePlayer(player)
    }
    else {
      result = LOSE
      this.damagePlayer(opponent)
    }

    this.makeObservation(0)

    player.lastState = player.currentState
    opponent.lastState = opponent.currentState
    player.currentState = { hp: player.currentState.hp }
    opponent.currentState = { hp: opponent.currentState.hp }

    /* 
    So, there are four variables we need to calculate.
    Actually, there are 8: 4 from the perspective of the player
    and 4 from the perspective of the opponent, but those are left
    to the second game instance.

    1. The hypothetical action of the player
    2. The pmf of the player
    3. The hypothetical action of the enemy
    4. The pmf of the opponent

    They are interdependent, though. The hypothetical action of the PLAYER
    is going to be based upon one of three pmfs of that PLAYER, which is
    selected based on the next hypothetical action of the OPPONENT, which
    is the most probable action the OPPONENT would take based on one of 3
    pmfs of the OPPONENT. Which pmf to select is going to be based on the 
    action of the PLAYER, which means we end up with cross dependencies.

    This can be circumvented. Here:
    1. Take the average over the pmfs of the opponent's (the player's) next
       action, base the hypothetical actions off of that, then calculate 
       the other variables.
    2. Try out all possible opponent's (player's) actions and calculate 
       the other variables based on that. Take the combination that ends up
       with most likely probability for that first action in the first place.
    
    I think this second method makes most sense.
    */
    // let r = player.pmfs[
    //   playedOffsetByAction(player.lastState.action) +
    //   resultOffsetByResult(result) +
    //   healthOffsetByHealth(player.currentState)
    // ]
  }
}