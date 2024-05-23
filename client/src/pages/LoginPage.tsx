import { LoginForm } from '@/components/LoginForm';
import DefaultLayout from '@/layouts/DefaultLayout';

const LoginPage = () => {
	return (
		<div className="min-h-screen min-w-screen flex flex-col justify-between gap-[20px]">
			<DefaultLayout>
				<LoginForm />
			</DefaultLayout>
		</div>
	);
};

export default LoginPage;
