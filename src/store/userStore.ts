import { makeAutoObservable } from 'mobx';
import {setAccessToken} from "~/utils/cookies";

class UserStore {
  isLoggedIn = false;
  userData: { [key: string]: any } | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  logIn(userData: { [key: string]: any }) {
    this.isLoggedIn = true;
    this.userData = userData;
    setAccessToken(userData.access_token)
  }

  logOut() {
    this.isLoggedIn = false;
    this.userData = null;
  }
}

export const userStore = new UserStore();
