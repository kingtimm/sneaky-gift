import { getPossibility, getTotalPossibilites } from '../utils/matching'
import { test, expect } from 'vitest'

test('should give us a new list of ids', () => {
  const initial = [1,2,3,4]
  const deranged = getPossibility(initial)
  expect(initial.some((item, index) => item === deranged[index])).toBeFalsy()
})

test('should respect exclusions', () => {
  const initial = [0,1,2]
  const exclusions = [[2]]
  const deranged = getPossibility(initial, exclusions)
  expect(deranged[0]).not.toBe(2)
})

test('should return a number of getTotalPossibilites', () => {
  const initial = [0,1,2,3,4]
  const exclusions = [[2,3,4],[0]]
  const total = getTotalPossibilites(initial, exclusions)
  expect(total).toBe(9)
})

test('should respect exclusions larger', () => {
  const initial = [0,1,2,3,4]
  const exclusions = [[],[3]]
  const deranged = getPossibility(initial, exclusions)
  expect(deranged[1]).not.toBe(3)
})


test('should respect exclusions two', () => {
  const initial = [0,1,2,3,4]
  const exclusions = [[],[3,4]]
  const deranged = getPossibility(initial, exclusions)
  expect(deranged[1]).not.toBe(3)
  expect(deranged[1]).not.toBe(4)
})