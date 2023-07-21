export const OPEN_SIMPLEX = 'Open Simplex' as const
export const PERLIN = 'Perlin' as const

export const ALGORITHMS = [
  OPEN_SIMPLEX,
  PERLIN,
] as const

export type Algorithm = (typeof ALGORITHMS)[number]

export const getAlgorithmByIndex = (index: number) => ALGORITHMS[index]
export const getIndexByAlgorithm = (algo: Algorithm) =>
  ALGORITHMS.findIndex(rithm => algo === rithm)
