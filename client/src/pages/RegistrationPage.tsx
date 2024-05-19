import { RegistrationForm } from '@/components/RegistrationForm';
import DefaultLayout from '@/layouts/DefaultLayout';

const RegistrationPage = () => {
	return (
		<div className="min-h-screen min-w-screen flex flex-col justify-between">
			<DefaultLayout>
				<RegistrationForm />
			</DefaultLayout>
		</div>
	);
};

export default RegistrationPage;
