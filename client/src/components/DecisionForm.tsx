import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { Button } from './ui/button';
import { Dispatch, SetStateAction, useContext, useState } from 'react';
import { Complaint, UserInfo } from '@/lib/complaints/columns';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { DropdownMenu } from '@radix-ui/react-dropdown-menu';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from './ui/select';
import { Context } from '@/main';
import { $authApi } from '@/http';

const DecisionForm = ({
	complaint,
	defendantUser,
	decisionFormVisible,
	setDecisionFormVisible,
}: {
	complaint: Complaint;
	defendantUser: UserInfo | null;
	decisionFormVisible: boolean;
	setDecisionFormVisible: Dispatch<SetStateAction<boolean>>;
}) => {
	const [result, setResult] = useState('IGNORE');
	const [description, setDescription] = useState('');

	const { store } = useContext(Context);

	return (
		<Dialog open={decisionFormVisible} onOpenChange={setDecisionFormVisible}>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>
						Вынесение решения по жалобе # {complaint.id}
					</DialogTitle>
					<DialogDescription>
						Пожалуйста, ознакомьтесь с информацией, просмотрите историю чата, а
						затем вынесете решение.
						<div className="mt-5 flex flex-col gap-3">
							<Label htmlFor="sel">Решение</Label>
							<Select onValueChange={setResult} defaultValue={result}>
								<SelectTrigger>
									<SelectValue placeholder="Игнорировать" />
								</SelectTrigger>

								<SelectContent>
									<SelectItem value="IGNORE">Игнорировать</SelectItem>
									<SelectItem value="BAN">Забанить пользователя</SelectItem>
									<SelectItem value="CHAT">Заблокировать чат</SelectItem>
								</SelectContent>
							</Select>
						</div>
						<div className="mt-2">
							<Label htmlFor="desc">Комментарий</Label>
							<Textarea
								id="desc"
								value={description}
								onChange={e => setDescription(e.target.value)}
							/>
						</div>
					</DialogDescription>
				</DialogHeader>

				<DialogFooter>
					<Button
						className="w-full"
						onClick={async () => {
							setDecisionFormVisible(false);
							await $authApi.post('/complaint/addReview', {
								userId: store.user?.id,
								complaintId: complaint.id,
								result,
								description,
								defendantId: defendantUser?.id,
							});
						}}
					>
						Вынести решение
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default DecisionForm;
