import { useEffect, useState } from 'react';
import { User, columns } from './columns';
import { DataTable } from './data-table';

async function getData(): Promise<User[]> {
	// Fetch data from your API here.
	return [
		{
			id: 1,
			email: 'hzg2fik_j8@mail.ru',
			role: 'ADMIN',
			isBlocked: false,
			isChatBlocked: true,
			isPrivate: true,
			login: 'kkapi',
			createdAt: '2024-05-25T11:49:13.902Z',
		},

		// ...
	];
}

export default function UsersTable() {
	const [data, setData] = useState([] as User[]);

	useEffect(() => {
		async function fetch() {
			const res = await getData();
			setData(res);
		}
		fetch();
	}, []);

	return (
		<div className="w-[100%] md:w-[80%] py-10">
			<div className="text-center text-3xl font-bold mb-5">Список пользователей</div>
			<DataTable columns={columns} data={data} />
		</div>
	);
}
