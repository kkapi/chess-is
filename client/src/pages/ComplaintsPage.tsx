import DefaultLayout from '@/layouts/DefaultLayout';
import { Context } from '@/main';
import { useContext } from 'react';
import ErrorPage from './ErrorPage';
import ComplaintsTable from '@/lib/complaints/page';

const ComplaintsPage = () => {
  const { store } = useContext(Context);

  if (store.user?.role !== 'ADMIN' && store.user?.role !== 'MODERATOR') {
    return <ErrorPage />
  }

	return (
		<div className="min-h-screen min-w-screen flex flex-col justify-between">
			<DefaultLayout>
				<div className="container flex justify-center items-center min-h-[80vh]">
          <ComplaintsTable />
				</div>
			</DefaultLayout>
		</div>
	);
}

export default ComplaintsPage