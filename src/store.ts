import { create } from 'zustand'
import { Algorithm, ALGORITHMS } from './algorithm'

export type Store = {
  algorithm: Algorithm
  setAlgorithm: (algorithm: Algorithm) => void
  isExporting: boolean
  setIsExporting: (isExporting: boolean) => void
  texture: string | undefined
  setTexture: (texture: string) => void
}

export const useStore = create<Store>()(set => ({
  algorithm: ALGORITHMS[0],
  setAlgorithm: algorithm => set({ algorithm: algorithm }),
  isExporting: false,
  setIsExporting: isExporting => set({ isExporting }),
  texture: undefined,
  setTexture: texture => set({ texture }),
}))