import { RecoveryForm } from '@/components/RecoveryFrom';
import DefaultLayout from '@/layouts/DefaultLayout';

const RecoveryPage = () => {
	return (
		<div className="min-h-screen min-w-screen flex flex-col justify-between">
			<DefaultLayout>
				<RecoveryForm />
			</DefaultLayout>
		</div>
	);
};

export default RecoveryPage;
