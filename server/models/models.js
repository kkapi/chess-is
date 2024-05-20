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
  recoveryLink: {type: DataTypes.STRING},
  isBlocked: {type: DataTypes.BOOLEAN, defaultValue: false}
});

const Token = sequelize.define('token', {
	id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
	refreshToken: { type: DataTypes.STRING },
});

/* const UserInfo = sequelize.define('user_info', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},    
  name: {type: DataTypes.STRING},
  second_name: {type: DataTypes.STRING},
})
 */

User.hasOne(Token);
Token.belongsTo(User);

module.exports = {
	User,
	Token,
};
