export const WIN = 0
export const LOSE = 1
export const TIE = 2

export const HIGH_HEALTH = 0
export const LOW_HEALTH = 1

export const FIRST_TURN = 0

export const PREDIC = {
  ROCK: 0,
  PAPER: 1,
  SCISSORS: 2
}

export function predicOffsetByAction(action) {
  return action
}

export const PLAYED = {
  ROCK: 0,
  PAPER: 3,
  SCISSORS: 6
}

export function playedOffsetByAction(action) {
  return action * 3
}

export const RESULT = {
  WIN: 0,
  LOSE: 9,
  TIE: 18
}

export function resultOffsetByResult(result) {
  return result * 9
}

export const HEALTH = {
  HIGH: 0,
  LOW: 27
}

export function healthOffsetByHealth(hp) {
  if (hp < 2)
    return HEALTH.HIGH
  else
    return HEALTH.LOW
}
