import { useEffect, useState } from 'react';
import { Complaint, columns } from './columns';
import { DataTable } from './data-table';
import { $authApi } from '@/http';


async function getData(): Promise<Complaint[]> {
	// Fetch data from your API here.
	const result = await $authApi.get('complaint/all');
  return result.data;
}

export default function ComplaintsTable() {
	const [data, setData] = useState([] as Complaint[]);

	useEffect(() => {
		async function fetch() {
			const res = await getData();
			setData(res);
		}
		fetch();
	}, []);

	return (
		<div className="container mx-auto py-10">
      <div className="text-center text-3xl font-bold mb-5">Список жалоб</div>
			<DataTable columns={columns} data={data} />
		</div>
	);
}
