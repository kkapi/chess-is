import { Review, UserInfo } from '@/lib/complaints/columns';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from './ui/dialog';

import { Dispatch, SetStateAction } from 'react';
import { getRusRole } from '@/lib/users-1/columns';
import { Separator } from './ui/separator';
import { useNavigate } from 'react-router-dom';

function getResult(res:string | undefined) :string {
  if (res === 'BAN') return "Пользователь заблокирован"
  if (res === 'CHAT') return "Чат заблокирован"
  return "Жалоба проигнорирована"
}

function formatDateTime(isoString: string | undefined) {
	const date = new Date(isoString);

	const options = {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
		hour: 'numeric',
		minute: 'numeric',
	};

	return date.toLocaleString('ru-RU', options);
}

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
	const navigate = useNavigate();

	return (
		<Dialog open={decisionVisible} onOpenChange={setDecisionVisible}>
			<DialogContent className="sm:max-w-[525px]">
				<DialogHeader>
					<DialogTitle className="text-xl">
						Результат рассмотрения жалобы # {review?.complaintId}
					</DialogTitle>
					<Separator className="my-3" />
					<DialogDescription className="text-lg">
						<div className="text-foreground">
							<div>Результат: {getResult(review?.result)}</div>
							<div>Комментарий: {review?.description}</div>
							<div>Дата: {formatDateTime(review?.createdAt)}</div>
						</div>
						<Separator className="my-3" />
						<div
							className="flex flex-col text-sm cursor-pointer"
							onClick={() => navigate(`/profile/${review?.id}`)}
						>
							<div className="text-base text-foreground font-semibold">
								Проверяющий
							</div>
							<div>ID: {reviewerUser?.id}</div>
							<div>Логин: {reviewerUser?.login}</div>
							<div>Почта: {reviewerUser?.email}</div>
							<div className="font-medium">
								Роль: {getRusRole(reviewerUser?.role)}
							</div>
						</div>
						<Separator className="my-3" />
						<div
							className="flex flex-col text-sm cursor-pointer"
							onClick={() => navigate(`/profile/${applicantUser?.id}`)}
						>
							<div className="text-base text-foreground font-semibold">
								Отправитель
							</div>
							<div>ID: {applicantUser?.id}</div>
							<div>Логин: {applicantUser?.login}</div>
							<div>Почта: {applicantUser?.email}</div>
							<div className="font-medium">
								Роль: {getRusRole(applicantUser?.role)}
							</div>
						</div>
						<Separator className="my-3" />
						<div
							className="flex flex-col text-sm cursor-pointer"
							onClick={() => navigate(`/profile/${defendantUser?.id}`)}
						>
							<div className="text-base text-foreground font-semibold">
								Обвиняемый
							</div>
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
