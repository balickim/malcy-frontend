import { makeAutoObservable } from "mobx";
import { makePersistable } from "mobx-persist-store";

import { IUser } from "~/types/user";
import { removeAccessToken, setAccessToken } from "~/utils/cookies";

const userReset = (): IUser => {
  return {
    id: "",
    email: "",
    nick: "",
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
    army: { swordsman: 0, archer: 0, knight: 0, luchador: 0, archmage: 0 },
  };
};

class UserStore {
  user: IUser = userReset();
  isLoggedIn = false;

  constructor() {
    makeAutoObservable(this);
    makePersistable(this, {
      name: "UserStore",
      properties: ["user", "isLoggedIn"],
      storage: window.localStorage,
    });
  }

  logIn(userData: { access_token: string; user: IUser }) {
    setAccessToken(userData.access_token);
    this.isLoggedIn = true;
    this.user = { ...userData.user, army: userReset().army };
  }

  logOut() {
    removeAccessToken();
    this.isLoggedIn = false;
    this.user = userReset();
  }
}

export const userStore = new UserStore();
