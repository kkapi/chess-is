const complaintService = require('../services/complaint-service')

class ComplaintController {
	async createComplaint(req, res, next) {
		try {
			const { gameUuid, applicant, defendant, reason, description } = req.body;
      await complaintService.createComplaint(gameUuid, applicant, defendant, reason, description);
      res.json('ok');
		} catch (error) {
			next(error);
		}
	}
}

module.exports = new ComplaintController();
