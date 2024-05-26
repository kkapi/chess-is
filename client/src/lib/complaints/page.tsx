import { useEffect, useState } from 'react';
import { Complaint, columns } from './columns';
import { DataTable } from './data-table';


async function getData(): Promise<Complaint[]> {
	// Fetch data from your API here.
	return [
		{
			id: 1,
			gameUuid: 'baa49e33-a096-462c-9f73-a3a5fa5c3559',
			reason: 'insult',
			description: 'sdfgsdfg',
			isReviewed: true,
			isGameEnded: true,
			createdAt: '2024-05-26T11:42:55.386Z',
			review: {
				id: 1,
				result: 'BAN',
				description: 'Нарушение правил сообщества',
				createdAt: '2024-05-26T11:44:35.793Z',
				updatedAt: '2024-05-26T11:44:35.793Z',
				userId: 1,
				complaintId: 1,
			},
			reviewerUser: {
				id: 1,
				email: 'hzg2fik_j8@mail.ru',
				role: 'ADMIN',
				login: 'kkapi',
			},
			applicantUser: {
				id: 1,
				email: 'hzg2fik_j8@mail.ru',
				role: 'ADMIN',
				login: 'kkapi',
			},
			defendantUser: {
				id: 2,
				email: 'shkola593@mail.ru',
				role: 'USER',
				login: 'deku',
			},
		},
		{
			id: 2,
			gameUuid: 'baa49e33-a096-462c-9f73-a3a5fa5c3559',
			reason: 'insult',
			description: 'sdfgsdfg',
			isReviewed: true,
			isGameEnded: true,
			createdAt: '2024-05-26T11:42:55.386Z',
			review: {
				id: 2,
				result: 'BAN',
				description: 'Нарушение правил сообщества',
				createdAt: '2024-05-26T12:21:40.782Z',
				updatedAt: '2024-05-26T12:21:40.782Z',
				userId: 1,
				complaintId: 1,
			},
			reviewerUser: {
				id: 1,
				email: 'hzg2fik_j8@mail.ru',
				role: 'ADMIN',
				login: 'kkapi',
			},
			applicantUser: {
				id: 1,
				email: 'hzg2fik_j8@mail.ru',
				role: 'ADMIN',
				login: 'kkapi',
			},
			defendantUser: {
				id: 2,
				email: 'shkola593@mail.ru',
				role: 'USER',
				login: 'deku',
			},
		},
	];
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
			<DataTable columns={columns} data={data} />
		</div>
	);
}
