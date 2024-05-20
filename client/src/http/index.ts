import axios from 'axios';

export const API_URL = `http://localhost:5000`;

const $authApi = axios.create({
	withCredentials: true,
	baseURL: API_URL,
});

const $api = axios.create({
	baseURL: API_URL,
});

$authApi.interceptors.request.use(config => {
	config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;
	return config;
});

$authApi.interceptors.response.use(
	config => {
		return config;
	},
	async err => {
		const originalRequest = err.config;
		if (err.response.status === 401 && err.config && !err.config._isRetry) {
			try {
				originalRequest._isRetry = true;
				const response = await axios.get(`${API_URL}/refresh`, {
					withCredentials: true,
				});
				localStorage.setItem('token', response.data.accessToken);
				return $authApi.request(originalRequest);
			} catch (err) {}
		}
		throw err;
	}
);

export { $authApi, $api };
