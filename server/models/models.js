const sequelize = require('../db');
const { DataTypes } = require('sequelize');

const User = sequelize.define('user', {
	id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
	email: { type: DataTypes.STRING, allowNull: false },
	login: { type: DataTypes.STRING, allowNull: false },
	password: { type: DataTypes.STRING },
	role: { type: DataTypes.STRING, defaultValue: 'USER' },
	isActivated: { type: DataTypes.BOOLEAN, defaultValue: false },
	activationLink: { type: DataTypes.STRING },
	recoveryLink: { type: DataTypes.STRING },
	isBlocked: { type: DataTypes.BOOLEAN, defaultValue: false },
	isChatBlocked: { type: DataTypes.BOOLEAN, defaultValue: false },
	isPrivate: { type: DataTypes.BOOLEAN, defaultValue: false },
});

const UserInfo = sequelize.define('info', {
	id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
	name: { type: DataTypes.STRING, defaultValue: '' },
	surname: { type: DataTypes.STRING, defaultValue: '' },
	about: { type: DataTypes.STRING, defaultValue: ''},
	country: { type: DataTypes.STRING, defaultValue: '' },
	rating: { type: DataTypes.STRING },
	elo: { type: DataTypes.INTEGER, defaultValue: 1000 },
});

const Token = sequelize.define('token', {
	id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
	refreshToken: { type: DataTypes.STRING },
});

const Game = sequelize.define('game', {
	id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
	uuid: { type: DataTypes.STRING, allowNull: false },
	white: { type: DataTypes.INTEGER, allowNull: true },
	black: { type: DataTypes.INTEGER, allowNull: true },
	resultMessage: { type: DataTypes.STRING },
	messages: { type: DataTypes.TEXT },
	pgn: { type: DataTypes.TEXT, defaultValue: '' },
	time: { type: DataTypes.INTEGER, defaultValue: 0 },
	type: { type: DataTypes.STRING, defaultValue: 'PERSONAL_ROOM' },
});

const Complaint = sequelize.define('complaint', {
	id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
	gameUuid: { type: DataTypes.STRING, allowNull: false },
	applicant: { type: DataTypes.INTEGER },
	defendant: { type: DataTypes.INTEGER, allowNull: true },
	reason: { type: DataTypes.STRING, allowNull: false },
	description: { type: DataTypes.STRING, allowNull: false },
	isReviewed: { type: DataTypes.BOOLEAN, defaultValue: false },
	reviewer: { type: DataTypes.INTEGER },
});

User.hasOne(Token);
Token.belongsTo(User);

User.hasOne(UserInfo);
UserInfo.belongsTo(User);

Game.belongsTo(User, {
	as: 'whitePlayer',
	foreignKey: 'white',
});

Game.belongsTo(User, {
	as: 'blackPlayer',
	foreignKey: 'black',
});

User.hasMany(Game, {
	as: 'whiteGames',
	foreignKey: 'white',
});

User.hasMany(Game, {
	as: 'blackGames',
	foreignKey: 'black',
});

Complaint.belongsTo(User, {
	as: 'applicantUser',
	foreignKey: 'applicant',
});

Complaint.belongsTo(User, {
	as: 'defendantUser',
	foreignKey: 'defendant',
});

Complaint.belongsTo(User, {
	as: 'reviewerUser',
	foreignKey: 'reviewer',
});

module.exports = {
  UserInfo,
	User,
	Token,
	Game,
	Complaint,
};
