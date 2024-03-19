import { makeAutoObservable } from "mobx";
import { makePersistable } from "mobx-persist-store";

import { removeAccessToken, setAccessToken } from "~/utils/cookies";

class UserStore {
  id = "";
  isLoggedIn = false;

  constructor() {
    makeAutoObservable(this);
    makePersistable(this, {
      name: "UserStore",
      properties: ["id", "isLoggedIn"],
      storage: window.localStorage,
    });
  }

  logIn(userData: { access_token: string; userId: string }) {
    setAccessToken(userData.access_token);
    this.isLoggedIn = true;
    this.id = userData.userId;
  }

  logOut() {
    removeAccessToken();
    this.isLoggedIn = false;
    this.id = "";
  }
}

export const userStore = new UserStore();
