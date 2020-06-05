import Game from "./game"
import { createPmfs, createRandomPmfs, createConstantPmfs } from '../game/pmf'

function copy(aObject) {
  if (!aObject) {
    return aObject;
  }

  let v;
  let bObject = Array.isArray(aObject) ? [] : {};
  for (const k in aObject) {
    v = aObject[k];
    bObject[k] = (typeof v === "object") ? copy(v) : v;
  }

  return bObject;
}

class OpponentController {
  async ready(game) {
    // for now, just return the most likely action
    // later, set the action asynchronously via firebase
    // that way, this function would wait to return until the action has been set
    this.action = game.mostLikelyOpponentAction
  }
}


const START_HP = 3

export default class Manager
{

  constructor() {
    this.opponentController = new OpponentController()
    this.reset()
  }

  reset() {
    this.game = new Game()

    let playerPmfs = createRandomPmfs()
    let opponentPmfs = createRandomPmfs()
    // let opponentPmfs = createConstantPmfs()

    this.game.addPlayer(playerPmfs, START_HP)
    this.game.addPlayer(opponentPmfs, START_HP)

    this.player = this.game.players[0]
    this.opponent = this.game.players[1]

    this.game.setupPredicPmf()

    this.predictions = this.game.getPredictionsBySimulation()
    this.history = []
  }

  setPlayerAction(selectedAction) {
    this.game.setPlayerAction(0, selectedAction)
  }

  setOpponentAction(selectedAction) {
    this.game.setPlayerAction(1, selectedAction)
  }

  async ready() {
    await this.opponentController.ready(this.game)
    this.setOpponentAction(this.predictions[0].opponentAction)
  }

  endRound() {
    this.game.endRound()
    this.predictions = this.game.getPredictionsBySimulation()
    this.history.push(
      copy(this.game.getGameStateAsPrediction())
    )
  }
}