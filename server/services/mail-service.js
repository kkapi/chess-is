const nodemailer = require('nodemailer');

class MailService {
	constructor() {
		this.transporter = nodemailer.createTransport({
			host: process.env.SMTP_HOST,
			port: process.env.SMTP_PORT,
			secure: true,
			auth: {
				user: process.env.SMTP_USER,
				pass: process.env.SMTP_PASSWORD,
			},
		});
	}

	async sendActivationMail(to, link) {
		await this.transporter.sendMail({
			from: process.env.SMTP_USER,
			to,
			subject: 'Активания аккаунта chess-is',
			text: '',
			html: `
        <div>
          <h1>Для активации перейдите по ссылке</h1>
          <a href="${link}">${link}</a>
        </div>
      `,
		});
	}

  async sendRecoveryLink(to, link) {
    await this.transporter.sendMail({
			from: process.env.SMTP_USER,
			to,
			subject: 'Восстановление пароля chess-is',
			text: '',
			html: `
        <div>
          <h1>Для сброса пароля перейдите по ссылке</h1>
          <a href="${link}">${link}</a>
        </div>
      `,
		});
  }
}

module.exports = new MailService();
