const { Complaint } = require('../models/models');

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
}

module.exports = new ComplaintService();
