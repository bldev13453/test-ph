import { Data } from "phaser";
import { EventBus } from "./EventBus";
import { State } from "../types/State";
import { getState } from "../api/getState";

export interface IAppState {
  getProp<T extends keyof State>(key: T): State[T];
  setProp<T extends keyof State>(key: T, value: State[T]): void;
  setState(state: State): State;
  initState(): Promise<void>;
  all: State;
}

class AppState extends Data.DataManager implements IAppState {
  private state: State = {
    coins: 0,
    lives: 0,
    globalGoal: 0,
    gameBoosters: {
      lives: 0,
      // coins: 0,
    },
    memeBoosters: {
      shield: 0,
      doge: 0,
    },
  };

  constructor() {
    super(EventBus);
  }

  get all(): State {
    return this.state;
  }

  getProp<T extends keyof State>(key: T): State[T] {
    return this.state[key];
  }

  setProp<T extends keyof State>(key: T, value: State[T]) {
    this.state[key] = value;
    return this.set(key, value);
  }

  setState(state: State) {
    Object.assign(this.state, state);
    return this.all;
  }

  async initState() {
    const state = await getState();
    this.setState(state);
  }
}

const appState = new AppState();

export default appState;
