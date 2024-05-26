const { Complaint, Review, User } = require('../models/models');

class ComplaintService {
	async createComplaint(gameUuid, applicant, defendant, reason, description) {
		defendant = !isNaN(defendant) ? defendant : null;

		console.log({ gameUuid, applicant, defendant, reason, description });
		const complaint = Complaint.create({
			gameUuid,
			applicant,
			defendant,
			reason,
			description,
		});

		return gameUuid;
	}

	async getAllComplaints() {
		const complaints = await Complaint.findAll({
			where: {
				isGameEnded: true,
			},
			include: [
				{ model: Review, as: 'review' },
				{
					model: User,
					as: 'applicantUser',
					attributes: ['id', 'email', 'role', 'login'],
				},
				{
					model: User,
					as: 'defendantUser',
					attributes: ['id', 'email', 'role', 'login'],
				},
			],
		});

		return complaints;
	}
}

module.exports = new ComplaintService();
