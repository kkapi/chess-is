require('dotenv').config();

const http = require('http');
const express = require('express');

const { Server } = require('socket.io');
const socketIo = require('./sockets/io')

const app = express();

// REST
const sequelize = require('./db');
const models = require('./models/models');

const cors = require('cors');
const cookies = require('cookie-parser');
const path = require('path')

const router = require('./routes');

const errorMiddleware = require('./middlewares/error-middleware');

const PORT = process.env.PORT ?? 5000;

app.use(
	cors({
		origin: 'http://localhost:5173',
		credentials: true,
	})
);
app.use(cookies());
app.use(express.static(path.resolve(__dirname, 'static')))
app.use(express.json());
app.use(router);
app.use(errorMiddleware);

// socket
const server = http.createServer(app);

const io = new Server(server, {
	cors: '*', // allow connection from any origin
});

socketIo(io);

// start

async function start() {
	try {
		await sequelize.authenticate();
		await sequelize.sync();

		server.listen(PORT, () => {
			console.log(`server started on port ${PORT}, http://localhost:${PORT}`);
		});
	} catch (error) {
		console.log(error);
	}
}

start();