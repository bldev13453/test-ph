import { ModelsUserState } from "./memegame-api";

export const getState = (): Promise<ModelsUserState> => {
  return new Promise<ModelsUserState>((resolve) => {
    setTimeout(() => {
      resolve({
        state: {
          dogeLevel: 0,
          pepeLevel: 0,
          hpAmount: 0,
          hpLevel: 0,
          hpFillsAt: "",
          tokenAmount: 1000,
        },
        user: {
          id: 1,
        },
      });
    }, 200);
  });
};
