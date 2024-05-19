import { createContext } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import Store from './store/Store.ts';

const store = new Store()

export const Context = createContext({
  store,
});


ReactDOM.createRoot(document.getElementById('root')!).render(
	<Context.Provider value={{
    store
  }}>
		<App />
	</Context.Provider>
);
