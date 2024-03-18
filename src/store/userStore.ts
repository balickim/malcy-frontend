import { makeAutoObservable } from 'mobx';
import {setAccessToken} from "~/utils/cookies";

class UserStore {
  isLoggedIn = false;
  userData: { [key: string]: any } | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  logIn(userData: { access_token: string }) {
    setAccessToken(userData.access_token)
  }

  logOut() {
    this.isLoggedIn = false;
    this.userData = null;
  }
}

export const userStore = new UserStore();
