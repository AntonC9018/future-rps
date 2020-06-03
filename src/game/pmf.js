

/*

The idea of the game is that the player sees the likelihood of the
enemies' next action. The player would see the probability of their
opponent playing Rock, Paper or Scissors. Then they would select an
action to hopefully win based on that information.

First Turn - 0

health: High (>= 2)                                           Low (< 2)
result: Win               Lose              Tie               Win               Lose              Tie
played: Rock  Paper Sciss Rock  Paper Sciss Rock  Paper Sciss Rock  Paper Sciss Rock  Paper Sciss Rock  Paper Sciss
predic: R P S R P S R P S R P S R P S R P S R P S R P S R P S R P S R P S R P S R P S R P S R P S R P S R P S R P S

1 + 2 * 3 * 3 * 3 = 55 PMFs


Each of these 55 probability mass functions (PMF) indicate the chance
of the player in question to select one of three actions (playing Rock,
Paper or Scissors). These PMFs will be updated based on observations.
It may be either an observation or a PMF created based on some observations.
Observations are actual actions done by the player in question in the 
particular situation.

As you can see by the above diagram, the PMFs are stored by different categories:
1. The health level of the player. They may play more aggressively or sparingly
   based on that (maybe add enemy health too? maybe remove?)
2. The result of the previous round. Can be either win, lose or tie.
3. The previous action of the player. Can be either of 3: rock, paper or scissors.
4. The prediction of the enemy actions that the player saw predictions for. 
   In fact, the player would see the percentages, so they are taken 
   into account when updating the PMFs.

After a round, game or a couple of games, the gathered information is applied
to update the PMFs of the player.

Having these splits makes it harder for the players to fool other players 
by quickly shifting their playstyle significantly. I'm wondering if a random
guess would be the best playstyle. It is hard to tell without testing.

*/

import { ROCK, PAPER, SCISSORS } from "./actions";
import { PREDIC } from "./offsets"

const NUM_PMFS = 55
const WEIGHT = 0.1

// PMF = [ % for rock, % for paper, % for scissors ]
function uniformPmf() {
  return [1 / 3, 1 / 3, 1 / 3]
}

function randomPmf() {
  let rock = Math.random()
  let paper = Math.random()
  let scissors = Math.random()
  let sum = rock + paper + scissors
  return [rock / sum, paper / sum, scissors / sum]
}


export function createPmfs() {
  let pmfs = []
  for (let i = 0; i < NUM_PMFS; i++) {
    pmfs[i] = uniformPmf()
  }
  return pmfs
}

export function createRandomPmfs() {
  let pmfs = []
  for (let i = 0; i < NUM_PMFS; i++) {
    pmfs[i] = randomPmf()
  }
  return pmfs
}

function updatePmfWithOneObservation(pmf, acluallyPlayed, coeff) {
  let w = coeff * WEIGHT
  pmf[ROCK] *= 1 - w
  pmf[PAPER] *= 1 - w
  pmf[SCISSORS] *= 1 - w
  pmf[acluallyPlayed] += w
}

function updatePmfWithPmfObservation(pmf, acluallyPlayedPmf, coeff) {
  let w = coeff * WEIGHT
  pmf[ROCK] *= 1 - w
  pmf[PAPER] *= 1 - w
  pmf[SCISSORS] *= 1 - w
  pmf[ROCK] += acluallyPlayedPmf[ROCK] * w
  pmf[PAPER] += acluallyPlayedPmf[PAPER] * w
  pmf[SCISSORS] += acluallyPlayedPmf[SCISSORS] * w
}

export function updatePmfsWithOneObservation(pmfs, result, prevPlayed, predicPmf, actualAction) {
  updatePmfWithOneObservation(pmfs[result + prevPlayed + PREDIC.ROCK], actualAction, predicPmf[ROCK])
  updatePmfWithOneObservation(pmfs[result + prevPlayed + PREDIC.PAPER], actualAction, predicPmf[PAPER])
  updatePmfWithOneObservation(pmfs[result + prevPlayed + PREDIC.SCISSORS], actualAction, predicPmf[SCISSORS])
}

export function updatePmfsWithPmf(pmfs, result, prevPlayed, predicPmf, actualActionPmf) {
  updatePmfWithPmfObservation(pmfs[result + prevPlayed + PREDIC.ROCK], actualActionPmf, predicPmf[ROCK])
  updatePmfWithPmfObservation(pmfs[result + prevPlayed + PREDIC.PAPER], actualActionPmf, predicPmf[PAPER])
  updatePmfWithPmfObservation(pmfs[result + prevPlayed + PREDIC.SCISSORS], actualActionPmf, predicPmf[SCISSORS])
}

function actionsToPmf(actions) {
  let pmf = [0, 0, 0]
  for (let action in actions) {
    pmf[action] += 1
  }
  pmf[0] /= actions.length
  pmf[1] /= actions.length
  pmf[2] /= actions.length
  return pmf
}