import { useEffect, useState } from 'react';
import { User, columns } from './columns';
import { DataTable } from './data-table';
import { $authApi } from '@/http';

async function getData(): Promise<User[]> {
	// Fetch data from your API here.

  const response = await $authApi.get('/user/users');
	return response.data;
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
