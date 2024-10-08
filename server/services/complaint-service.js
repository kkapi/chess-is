const { Complaint, Review, User } = require('../models/models');

class ComplaintService {
	async createComplaint(gameUuid, applicant, defendant, reason, description) {
		defendant = !isNaN(defendant) ? defendant : null;

		const complaint = await Complaint.create({
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

	async addReview(userId, complaintId, result, description, defendantId) {
		const complaint = await Complaint.findOne({
			where: {
				id: complaintId,
				isReviewed: false,
			},
		});

		if (!complaint) {
			return;
		}

		const review = await Review.create({
			result,
			description,
			userId,
			complaintId: complaint.id,
		});

    if (result === 'BAN') {
      await User.update(
        { isBlocked: true },
        {
          where: {
            id: defendantId,
          },
        }
      );
    }
    
    if (result === 'CHAT') {
      await User.update(
        { isChatBlocked: true },
        {
          where: {
            id: defendantId,
          },
        }
      );
    }

		complaint.isReviewed = true;
		complaint.reviewer = userId;
		await complaint.save();

		return review.id;
	}
}

module.exports = new ComplaintService();
