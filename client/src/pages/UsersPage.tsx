import DefaultLayout from '@/layouts/DefaultLayout';
import UsersTable from '@/lib/users-1/page';
import { Context } from '@/main';
import { useContext } from 'react';
import ErrorPage from './ErrorPage';

const UsersPage = () => {
	const { store } = useContext(Context);

  if (store.user?.role !== 'ADMIN') {
    return <ErrorPage />
  }

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
