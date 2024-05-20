import { API_URL } from '@/http';
import axios from 'axios';
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
		return this._user;
	}

	set isAuth(bool: boolean) {
		this._isAuth = bool;
	}

	set user(user: User | null) {
		this._user = user;
	}

	async checkAuth() {
		try {
			const response = await axios.get(`${API_URL}/user/refresh`, {
				withCredentials: true,
			});

      console.log({RESOPNSE: response})
			const { user, accessToken } = response.data;
			localStorage.setItem('token', accessToken);
      this.user = user;
      this.isAuth = true;
		} catch (e) {
			console.log(e);
		}
	}
}
