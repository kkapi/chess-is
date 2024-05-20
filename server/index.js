require('dotenv').config();

const express = require('express');

const sequelize = require('./db');
const models = require('./models/models');

const cors = require('cors');
const cookies = require('cookie-parser');

const router = require('./routes');

const errorMiddleware = require('./middlewares/error-middleware');

const PORT = process.env.PORT ?? 5000;

const app = express();

app.use(
	cors({
		origin: 'http://localhost:5173',
		credentials: true,
	})
);
app.use(cookies());
app.use(express.json());
app.use(router);
app.use(errorMiddleware);

async function start() {
	try {
		await sequelize.authenticate();
		await sequelize.sync();

		app.listen(PORT, () => {
			console.log(`server started on port ${PORT}, http://localhost:${PORT}`);
		});
	} catch (error) {
		console.log(error);
	}
}

start();
