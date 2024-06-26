// {
//         coins: 100,
//         lives: 3,
//         globalGoal: 35, // percentage
//         gameBoosters: {
//           lives: 1,
//           // coins: 1,
//         },
//         memeBoosters: {
//           shield: 1,
//           doge: 1,
//         },
//       }

export interface State {
  coins: number;
  lives: number;
  globalGoal: number;
  gameBoosters: {
    lives: number;
    // coins: number;
  };
  memeBoosters: {
    shield: number;
    doge: number;
  };
}
