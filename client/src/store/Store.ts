import { API_URL } from '@/http';
import axios from 'axios';
import { makeAutoObservable } from 'mobx';
import { v4 as uuidv4 } from 'uuid';

export type User = {
	id: number;
	login: string;
	email: string;
	role: string;
};

export default class Store {
	_isAuth: boolean = false;
	_user: User | null = null;
  _browserId: string | null = null;

	constructor() {
		makeAutoObservable(this);
    
    let curBrowserId = localStorage.getItem('browserId');
    if (!curBrowserId) {
      curBrowserId = uuidv4();
      localStorage.setItem('browserId', curBrowserId!)
    }
    this.browserId = curBrowserId;
	}

	get isAuth(): boolean {
		return this._isAuth;
	}

	get user(): User | null {
		return this._user;
	}

	set isAuth(bool: boolean) {
		this._isAuth = bool;
	}

	set user(user: User | null) {
		this._user = user;
	}

  set browserId(id) {
    this._browserId = id;
  }

  get browserId() {
    return this._browserId;
  }
}
