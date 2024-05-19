import { makeAutoObservable } from 'mobx';

export type User = {
	id: number;
	login: string;
	email: string;
	role: string;
};

export default class Store {
	_isAuth: boolean = false;
	_user: User | null = null;

	constructor() {
		makeAutoObservable(this);
	}

	get isAuth(): boolean {
		return this._isAuth;
	}

	get user(): User | null {
		return this.user;
	}

  set isAuth(bool: boolean) {
    this._isAuth = bool;
  }

  set user(user: User | null) {
    this._user = user;
  }
}
