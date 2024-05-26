import { Review, UserInfo } from '@/lib/complaints/columns';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Dispatch, SetStateAction } from 'react';
import { getRusRole } from '@/lib/users-1/columns';

const Decision = ({
	reviewerUser,
	applicantUser,
	defendantUser,
	review,
	decisionVisible,
	setDecisionVisible,
}: {
	reviewerUser: UserInfo | null;
	applicantUser: UserInfo | null;
	defendantUser: UserInfo | null;
	review: Review | null;
	decisionVisible: boolean;
	setDecisionVisible: Dispatch<SetStateAction<boolean>>;
}) => {
	return (
		<Dialog open={decisionVisible} onOpenChange={setDecisionVisible}>
			<DialogContent className="sm:max-w-[525px]">
				<DialogHeader>
					<DialogTitle className="text-xl">
						Результат рассмотрения жалобы # {review?.complaintId}
					</DialogTitle>
					<DialogDescription className='text-lg'>
            <div>
              Результат {review?.result}
            </div>
            <div>Комментарий {review?.description}</div>
            <div>Дата {review?.createdAt}</div>
						<div className="flex flex-col text-sm">
							<div>ID: {reviewerUser?.id}</div>
							<div>Логин: {reviewerUser?.login}</div>
							<div>Почта: {reviewerUser?.email}</div>
							<div className="font-medium">
								Роль: {getRusRole(reviewerUser?.role)}
							</div>
						</div>
						<div className="flex flex-col text-sm">
							<div>ID: {applicantUser?.id}</div>
							<div>Логин: {applicantUser?.login}</div>
							<div>Почта: {applicantUser?.email}</div>
							<div className="font-medium">
								Роль: {getRusRole(applicantUser?.role)}
							</div>
						</div>
						<div className="flex flex-col text-sm">
							<div>ID: {defendantUser?.id}</div>
							<div>Логин: {defendantUser?.login}</div>
							<div>Почта: {defendantUser?.email}</div>
							<div className="font-medium">
								Роль: {getRusRole(defendantUser?.role)}
							</div>
						</div>
					</DialogDescription>
				</DialogHeader>
				<div className="grid gap-4 py-4"></div>
			</DialogContent>
		</Dialog>
	);
};

export default Decision;
