import { Data } from "phaser";
import { EventBus } from "./EventBus";
import { getState } from "../api/getState";
import type {
  ModelsState,
  ModelsUser,
  ModelsUserState,
} from "../api/memegame-api";
interface ExtendedModelState extends ModelsState {
  mewLevel: number;
}
export interface IAppState {
  initState(): Promise<void>;
  getGameState(): ExtendedModelState;
  getUserState(): ModelsUser;
  setGameProp<T extends keyof ExtendedModelState>(
    key: T,
    value: ExtendedModelState[T]
  ): void;
  getGameProp<T extends keyof ExtendedModelState>(
    key: T
  ): ExtendedModelState[T];
  getUserProp<T extends keyof ModelsUser>(key: T): ModelsUser[T];
}

class AppState extends Data.DataManager implements IAppState {
  private gameState: ExtendedModelState = {
    dogeLevel: 0,
    pepeLevel: 0,
    mewLevel: 0,
    hpAmount: 0,
    hpLevel: 0,
    hpFillsAt: "",
    tokenAmount: 0,
  };

  constructor() {
    super(EventBus);
  }

  getGameState(): ExtendedModelState {
    return this.gameState;
  }

  setGameProp<T extends keyof ExtendedModelState>(
    key: T,
    value: ExtendedModelState[T]
  ) {
    this.gameState[key] = value;
  }
  getGameProp<T extends keyof ExtendedModelState>(
    key: T
  ): ExtendedModelState[T] {
    return this.gameState[key];
  }
  private userState: ModelsUser = {};

  getUserState(): ModelsUser {
    return this.userState;
  }

  getUserProp<T extends keyof ModelsUser>(key: T): ModelsUser[T] {
    return this.userState[key];
  }

  setState({ user, state }: ModelsUserState & { state: ExtendedModelState }) {
    this.userState = user!;
    this.gameState = state!;
  }

  async initState() {
    const state = await getState();
    this.setState(state as ModelsUserState & { state: ExtendedModelState });
  }
}

const appState = new AppState();

export default appState;
