import 'little-state-machine';

declare module 'little-state-machine' {
  interface GlobalState {
    username: string | undefined
    gameDetails: {
      opponent?: string,
      boardsize?: number,
      id?: string
    } | undefined
  }
}