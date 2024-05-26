import DefaultLayout from '@/layouts/DefaultLayout';
import UsersTable from '@/lib/users-1/page';

const UsersPage = () => {

	return (
		<div className="min-h-screen min-w-screen flex flex-col justify-between">
			<DefaultLayout>
				<div className="container flex justify-center items-center min-h-[80vh]">
					<UsersTable />
				</div>
			</DefaultLayout>
		</div>
	);
};

export default UsersPage;
