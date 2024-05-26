import { ColumnDef } from '@tanstack/react-table';
import HoverUser from './HoverUser';
import { Badge } from '@/components/ui/badge';
import { ArrowUpDown, MoreHorizontal } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useNavigate } from 'react-router-dom';
import Decision from '@/components/Decision';
import { useState } from 'react';
import DecisionForm from '@/components/DecisionForm';

export type UserInfo = {
	id: number;
	email: string;
	role: string;
	login: string;
};

export type Review = {
	id: number;
	result: string;
	description: string;
	createdAt: string;
	updatedAt: string;
	userId: number;
	complaintId: number;
};

export type Complaint = {
	id: number;
	gameUuid: string;
	reason: string;
	description: string;
	isReviewed: boolean;
	isGameEnded: boolean;
	createdAt: string;
	review: Review | null;
	reviewerUser: UserInfo | null;
	applicantUser: UserInfo | null;
	defendantUser: UserInfo | null;
};

function formatDateTime(isoString: string) {
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

function getRusReason(reason: string) {
	if (reason === 'cheat') return 'Читерство';
	if (reason === 'insult') return 'Оскорблениe';
	if (reason === 'stall') return 'Затягивание';
	return 'Другое';
}

export const columns: ColumnDef<Complaint>[] = [
	{
		accessorKey: 'id',
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					ID
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
	},
	{
		accessorKey: 'reason',
		header: 'Причина',
		cell: ({ row }) => {
			const reason = row.getValue('reason') as string;

			return <div>{getRusReason(reason)}</div>;
		},
	},
	{
		accessorKey: 'applicantUser',
		header: 'Отправитель',
		cell: ({ row }) => {
			const user = row.getValue('applicantUser') as UserInfo;

			return <HoverUser user={user} />;
		},
	},
	{
		accessorKey: 'defendantUser',
		header: 'Обвиняемый',
		cell: ({ row }) => {
			const user = row.getValue('defendantUser') as UserInfo;

			return <HoverUser user={user} />;
		},
	},
	{
		accessorKey: 'isReviewed',
		header: 'Статус',
		cell: ({ row }) => {
			const isReviewed = row.getValue('isReviewed') as boolean;

			if (isReviewed) {
				return (
					<Badge variant="secondary" className="text-sm">
						Рассмотрена
					</Badge>
				);
			}

			return <Badge className="text-sm">Не рассмотрена</Badge>;
		},
		filterFn: (row, columnId, filterValue) => {
			if (filterValue) {
				return !row.getValue('isReviewed');
			}
			return true; // true or false based on your custom logic
		},
	},
	{
		accessorKey: 'createdAt',
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					Дата
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
		cell: ({ row }) => {
			const date = row.getValue('createdAt') as string;

			return <div>{formatDateTime(date)}</div>;
		},
	},
	{
		id: 'actions',
		cell: ({ row }) => {
			const complaint = row.original;

			const navigate = useNavigate();
			const [decisionVisible, setDecisionVisible] = useState(false);
			const [decisionFormVisible, setDecisionFormVisible] = useState(false);

			return (
				<>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="ghost" className="h-8 w-8 p-0">
								<span className="sr-only">Открыть</span>
								<MoreHorizontal className="h-4 w-4" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuLabel>Действия</DropdownMenuLabel>
							<DropdownMenuItem
								onClick={() =>
									navigate(`/profile/${complaint.applicantUser?.id}`)
								}
							>
								Профиль отправителя
							</DropdownMenuItem>
							<DropdownMenuItem
								onClick={() =>
									navigate(`/profile/${complaint.defendantUser?.id}`)
								}
							>
								Профиль обвиняемого
							</DropdownMenuItem>
							<DropdownMenuItem
								onClick={() => navigate(`/games/${complaint.gameUuid}`)}
							>
								Партия
							</DropdownMenuItem>
							<DropdownMenuSeparator />
							{complaint.isReviewed ? (
								<DropdownMenuItem onClick={() => setDecisionVisible(true)}>
									Результат рассмотрения
								</DropdownMenuItem>
							) : (
								<DropdownMenuItem onClick={() => setDecisionFormVisible(true)}>Рассмотреть жалобу</DropdownMenuItem>
							)}
						</DropdownMenuContent>
					</DropdownMenu>
					<Decision
						review={complaint.review}
						decisionVisible={decisionVisible}
						setDecisionVisible={setDecisionVisible}
						applicantUser={complaint.applicantUser}
						defendantUser={complaint.defendantUser}
						reviewerUser={complaint.reviewerUser}
					/>
					<DecisionForm
            complaint={complaint}
						decisionFormVisible={decisionFormVisible}
						setDecisionFormVisible={setDecisionFormVisible}
            defendantUser={complaint.defendantUser}
					/>
				</>
			);
		},
	},
];
