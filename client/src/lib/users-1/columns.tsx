import { Badge } from '@/components/ui/badge';
import { ColumnDef } from '@tanstack/react-table';
import Actions from './Actions';
import { Button } from '@/components/ui/button';
import { ArrowUpDown } from 'lucide-react';

export type User = {
	id: number;
	login: string;
	email: string;
	role: string;
	isBlocked: boolean;
	createdAt: string;
	isChatBlocked: boolean;
	isPrivate: boolean;
};

function getRusRole(role: string): string {
	if (role === 'ADMIN') return 'Администратор';
	if (role === 'MODERATOR') return 'Модератор';
	return 'Пользователь';
}

function getDate(dateString: string): string {
	const date = new Date(dateString);

	const options = {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
	};

	const formattedDate = new Intl.DateTimeFormat('ru-RU', options).format(date);
	return formattedDate;
}

function StatusBadge({ status }: { status: boolean }) {
	if (status) {
		return <Badge className="text-sm">Заблокирован</Badge>;
	}
	return (
		<Badge variant="secondary" className="text-sm">
			Активный
		</Badge>
	);
}

export const columns: ColumnDef<User>[] = [
	{
		accessorKey: 'id',
		header: 'ID',
	},
	{
		accessorKey: 'login',
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					Логин
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
	},
	{
		accessorKey: 'email',
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					Почта
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
		cell: ({ row }) => {
			const email = row.getValue('email') as string;
			return <div className="italic">{email}</div>;
		},
	},
	{
		accessorKey: 'role',
		header: () => <div>Роль</div>,
		cell: ({ row }) => {
			const role = row.getValue('role') as string;
			const formatted = getRusRole(role);
			return <div className="font-medium">{formatted}</div>;
		},
	},
	{
		accessorKey: 'isBlocked',
		header: 'Статус',
		cell: ({ row }) => {
			const status = row.getValue('isBlocked') as boolean;
			return <StatusBadge status={status} />;
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
					Дата создания
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
		cell: ({ row }) => {
			const date = row.getValue('createdAt') as string;
			const formatted = getDate(date);
			return <div className="font-medium">{formatted}</div>;
		},
	},
	{
		id: 'actions',
		cell: ({ row }) => {
			const user = row.original;
			return <Actions user={user} />;
		},
	},
];
