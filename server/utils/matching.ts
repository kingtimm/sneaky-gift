// import { getRandomValues } from 'uncrypto'

type Exclusions = number[][]

// function getRandomInt(min: number, max:number, exclusions?: number[]) {
//   const randomBuffer = new Uint32Array(1);

//   getRandomValues(randomBuffer);

//   const randomNumber = randomBuffer[0] / (0xffffffff + 1);

//   min = Math.ceil(min);
//   max = Math.floor(max);
//   const result = Math.floor(randomNumber * (max - min + 1)) + min;
//   // recursively avoid exclusions
//   if (exclusions?.includes(result)) {
//     return getRandomInt(min, max, exclusions)
//   }
//   return result
// }

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