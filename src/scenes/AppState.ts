import { Data } from "phaser";
import { EventBus } from "./EventBus";
import { getState } from "../api/getState";
import { ModelsState, ModelsUser, ModelsUserState } from "../api/memegame-api";

export interface IAppState {
  initState(): Promise<void>;
  getGameState(): ModelsState;
  getUserState(): ModelsState;
  setGameProp<T extends keyof ModelsState>(key: T, value: ModelsState[T]): void;
  getGameProp<T extends keyof ModelsState>(key: T): ModelsState[T];
  getUserProp<T extends keyof ModelsUser>(key: T): ModelsUser[T];
}

class AppState extends Data.DataManager implements IAppState {
  private gameState: ModelsState = {
    dogeLevel: 0,
    pepeLevel: 0,
    hpAmount: 0,
    hpLevel: 0,
    hpFillsAt: "",
    tokenAmount: 0,
  };

  constructor() {
    super(EventBus);
  }

  getGameState(): ModelsState {
    return this.gameState;
  }

  setGameProp<T extends keyof ModelsState>(key: T, value: ModelsState[T]) {
    this.gameState[key] = value;
  }
  getGameProp<T extends keyof ModelsState>(key: T): ModelsState[T] {
    return this.gameState[key];
  }
  private userState: ModelsUser = {};

  getUserState(): ModelsState {
    return this.userState;
  }

  getUserProp<T extends keyof ModelsUser>(key: T): ModelsUser[T] {
    return this.userState[key];
  }

  setState({ user, state }: ModelsUserState) {
    this.userState = user!;
    this.gameState = state!;
  }

  async initState() {
    const state = await getState();
    this.setState(state);
  }
}

const appState = new AppState();

export default appState;
