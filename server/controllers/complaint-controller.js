const complaintService = require('../services/complaint-service');

class ComplaintController {
	async createComplaint(req, res, next) {
		try {
			const { gameUuid, applicant, defendant, reason, description } = req.body;
			await complaintService.createComplaint(
				gameUuid,
				applicant,
				defendant,
				reason,
				description
			);
			res.json('ok');
		} catch (error) {
			next(error);
		}
	}

	async getAllComplaints(req, res, next) {
		try {
			const complaints = await complaintService.getAllComplaints();
			res.json(complaints);
		} catch (error) {
			next(error);
		}
	}

	async addReview(req, res, next) {
		const { userId, complaintId, result, description, defendantId } = req.body;
    await complaintService.addReview(userId, complaintId, result, description, defendantId);

    res.json('ok');
	}
}

module.exports = new ComplaintController();
