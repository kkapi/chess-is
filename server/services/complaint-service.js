const { Complaint, Review, User } = require('../models/models');

class ComplaintService {
	async createComplaint(gameUuid, applicant, defendant, reason, description) {
		defendant = !isNaN(defendant) ? defendant : null;

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
					as: 'reviewerUser',
					attributes: ['id', 'email', 'role', 'login'],
				},
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
			attributes: [
				'id',
				'gameUuid',
				'reason',
				'description',
				'isReviewed',
				'isGameEnded',
				'createdAt',
			],
			order: [['id', 'ASC']],
		});

		return complaints;
	}

	async addReview(userId, complaintId, result, description) {
		const complaint = await Complaint.findOne({
			where: {
				id: complaintId,
			},
		});

		if (!complaint || complaint.isReviewd) {
			return;
		}

		const review = await Review.create({
			result,
			description,
			userId,
			complaintId: complaint.id,
		});

		complaint.isReviewed = true;
		complaint.reviewer = userId;
		await complaint.save();

		return review.id;
	}
}

module.exports = new ComplaintService();
