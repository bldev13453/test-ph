import { State } from "../types/State";

export const getState = (): Promise<State> => {
  return new Promise<State>((resolve) => {
    setTimeout(() => {
      resolve({
        coins: 100,
        lives: 3,
        globalGoal: 35, // percentage
        gameBoosters: {
          lives: 1,
          // coins: 1,
        },
        memeBoosters: {
          shield: 1,
          doge: 1,
        },
      });
    }, 200);
  });
};
