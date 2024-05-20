import axios from 'axios';
import { $api, $authApi, API_URL } from '.';

export const registration = async (email, login, password) => {
	const response = await $api.post('user/registration', {
		email,
		login,
		password,
	});

  return response.data;
};

export const login = async (login, password) => {
  const response = await $api.post('/user/login', {
    login,
    password
  }, {withCredentials: true})

  return response.data;
}

export const logout = async () => {
  const response = await $authApi.post('/user/logout');

  return response.data;
}
