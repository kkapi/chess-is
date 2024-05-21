import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { HOME_ROUTE, LOGIN_ROUTE } from '@/lib/constants';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from './ui/form';
import { AlertCircle } from 'lucide-react';
import Balance from 'react-wrap-balancer';
import axios from 'axios';

const formSchema = z.object({
	password: z
		.string({
			required_error: 'Введите пароль.',
		})
		.min(1, {
			message: 'Введите пароль.',
		})
		.min(5, {
			message: 'Пароль должен состоять минимум из 5 символов.',
		})
		.max(25, { message: 'Максимум 25 символов' }),
	passwordConfirm: z
		.string({
			required_error: 'Подтвердите пароль.',
		})
		.min(5, { message: 'Минимум 5 символов' })
		.max(25, { message: 'Максимум 25 символов' }),
});

export default function ResetPasswordForm() {
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
	});
	const [email, setEmail] = useState('');
	const { link } = useParams();
	const navigate = useNavigate();

	const {
		setError,
		formState: { isSubmitting, errors },
	} = form;

	async function onSubmit(values: z.infer<typeof formSchema>) {
		if (values.password !== values.passwordConfirm) {
			setError('passwordConfirm', { message: 'Пароли не совпадают' });
			return;
		}
		console.log(values);

		try {
			const response = await axios.post(
				'http://localhost:5000/user/resetpass',
				{
					password: values.password,
					recoveryLink: link,
				}
			);

			setEmail('done');

			console.log(response);
		} catch (err) {
			let errMes = 'Непредвиденная ошибка';
			if (err?.response?.data?.name === 'ApiError') {
				errMes = err.response.data.message;
			}
			setError('root', { message: errMes });
			console.log(errMes);
		}
	}

	if (email) {
		return (
			<Card className="mx-auto max-w-sm">
				<CardHeader>
					<CardTitle className="text-xl">Сброс пароля</CardTitle>
					<CardDescription>
						<div>Пароль был успешно изменен</div>
						<div className='flex gap-4'>
							<Button variant="secondary" onClick={() => navigate(HOME_ROUTE)} className="mt-4">
								На главную
							</Button>
              <Button onClick={() => navigate(LOGIN_ROUTE)} className="mt-4">
								Войти
							</Button>
						</div>
					</CardDescription>
				</CardHeader>
			</Card>
		);
	}

	return (
		<Card className="mx-auto max-w-sm">
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)}>
					<CardHeader>
						<CardTitle className="text-xl">Сброс пароля</CardTitle>
						<CardDescription>
							<span className="block mt-2">
								Заполните форму для сброса пароля
							</span>
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="grid gap-4">
							{errors.root && (
								<div className="border bg-red-50 border-red-600 p-1 gap-3 flex justify-start items-center rounded">
									<AlertCircle className="ml-1 h-6 w-6" color="#df1b1b" />
									<Balance className="text-sm">{errors.root.message}</Balance>
								</div>
							)}
							<FormField
								control={form.control}
								name="password"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Новый пароль</FormLabel>
										<FormControl>
											<Input
												type="password"
												placeholder="Введите новый пароль"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="passwordConfirm"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Подтверждение пароля</FormLabel>
										<FormControl>
											<Input
												type="password"
												placeholder="Подтвердите пароль"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<Button
								disabled={isSubmitting}
								type="submit"
								className="w-full mt-2"
							>
								{isSubmitting ? 'Обработка...' : 'Изменить пароль'}
							</Button>
						</div>
						<div className="mt-4 text-center text-sm">
							Вспомнили пароль?{' '}
							<Link to={LOGIN_ROUTE} className="underline">
								Войти
							</Link>
						</div>
					</CardContent>
				</form>
			</Form>
		</Card>
	);
}
