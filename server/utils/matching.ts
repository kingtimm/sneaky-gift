// import { getRandomValues } from 'uncrypto'

type Exclusions = number[][]

function getRandomItem<T>(array: T[]) {
  return array[Math.floor((Math.random()*array.length))];
}

export function getPermutations<T>(arr: T[]): T[][] {
  if (arr.length <= 1) {
    return [arr];
  }

  const result: T[][] = [];

  for (let i = 0; i < arr.length; i++) {
    const current = arr[i];
    const rest = arr.slice(0, i).concat(arr.slice(i + 1));
    const perms = getPermutations(rest);

    for (const perm of perms) {
      const candidate = [current, ...perm]
      result.push(candidate);     
    }
  }
  return result;
}

export function getAllPossibilities(array: number[], exclusions?: Exclusions): number[][] {
  array = array.slice()
  const permutationArray = getPermutations(array)

  const possibilities = permutationArray.filter((perm) => {
    const isRejectable = array.some((item, index) => {
      // skip if there's a fixed point
      const isFixedPoint = item === perm[index]
      let isExcluded = false
      
      // skip if there's an exclusion
      if (exclusions && exclusions[index]) {
        isExcluded = exclusions[index].some((exItem, _exIndex)=> exItem === perm[index])
      }
      return (isFixedPoint || isExcluded)
    })
    return !isRejectable
  })
  console.log('possibilities ', possibilities)
  if (possibilities.length === 0) {
    throw createError({
      statusCode: 400,
      message: "No secret santa matches for this list"
    })
  }
  return possibilities
}

export function getPossibility(array: number[], exclusions?: Exclusions): number[] {
  array = array.slice()
  const permutationArray = getAllPossibilities(array, exclusions)
  return getRandomItem(permutationArray)
}

export function getTotalPossibilites(array: number[], exclusions?: Exclusions): number {
  return getAllPossibilities(array, exclusions).length
}