import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardTitle } from './ui/card';
import { HOME_ROUTE, LOGIN_ROUTE } from '@/lib/constants';
import { Link, useNavigate } from 'react-router-dom';

import { AlertCircle, Loader2 } from 'lucide-react';
import Balance from 'react-wrap-balancer';
import { useState } from 'react';
import { registration } from '@/http/userAPI';

const formSchema = z.object({
	login: z
		.string({
			required_error: 'Введите логин.',
		})
		.min(3, {
			message: 'Логин должен состоять минимум из трех символов.',
		}),
	email: z
		.string({
			required_error: 'Введите почту.',
		})
		.email({ message: 'Некорректный email' }),
	password: z
		.string({
			required_error: 'Введите пароль.',
		})
		.min(5, { message: 'Пароль должен состоять минимум из 5 символов' })
		.max(35, { message: 'Максимум 35 символов' }),
	passwordConfirm: z
		.string({
			required_error: 'Подтвердите пароль.',
		})
		.min(5, { message: 'Минимум 5 символов' })
		.max(25, { message: 'Максимум 25 символов' }),
});

export function RegistrationForm() {
	const [registrated, setRegistrated] = useState(false);
	const [email, setEmail] = useState('');
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
	});
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
			const { email } = await registration(
				values.email,
				values.login,
				values.password
			);
			setRegistrated(true);
			setEmail(email);
		} catch (err) {
			let errMes = 'Непредвиденная ошибка';
			if (err?.response?.data?.name === 'ApiError') {
				errMes = err.response.data.message;
			}
			setError('root', { message: errMes });
			console.log(errMes);
		}
	}

	return (
		<>
			<Card className="mx-auto max-w-sm">
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)}>
						<CardContent>
							<CardTitle className="text-xl mt-4">Регистрация</CardTitle>
							{!registrated && (
								<>
									<CardDescription className="mt-2 mb-3">
										<span className="block">
											Введите информацию для регистрации аккаунта.
										</span>
										<span className="block mt-2">
											После заполнения формы на указанную почту придет письмо с
											инструкцией по активации аккаунта.
										</span>
									</CardDescription>
									<div className="grid gap-3">
										{errors.root && (
											<div className="border bg-red-50 border-red-600 p-1 gap-3 flex justify-start items-center rounded">
												<AlertCircle className="ml-1 h-6 w-6" color="#df1b1b" />
												<Balance className="text-sm text-muted-foreground">
													{errors.root.message}
												</Balance>
											</div>
										)}
										<FormField
											control={form.control}
											name="login"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Логин</FormLabel>
													<FormControl>
														<Input
															required={false}
															placeholder="Введите логин"
															{...field}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField
											control={form.control}
											name="email"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Почта</FormLabel>
													<FormControl>
														<Input
															required={false}
															placeholder="example@gmail.com"
															{...field}
														/>
													</FormControl>

													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField
											control={form.control}
											name="password"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Пароль</FormLabel>
													<FormControl>
														<Input
															type="password"
															required={false}
															placeholder="Введите пароль"
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
															required={false}
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
											className="mt-2"
										>
											{isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin"/>Обработка...</> : 'Зарегистрироваться'}
										</Button>
									</div>
									<div className="mt-4 text-center text-sm">
										Уже есть аккаунт?{' '}
										<Link to={LOGIN_ROUTE} className="underline">
											Войти
										</Link>
									</div>
								</>
							)}
							{registrated && (
								<CardDescription className="mt-2 text-base">
									<div>
										На почту{' '}
										<span className="text-bold italic font-medium">
											{email}
										</span>{' '}
										было направлено письмо с инструкцией по активации аккаунта.
									</div>
									<Button onClick={() => navigate(HOME_ROUTE)} className="mt-4">
										На главную
									</Button>
								</CardDescription>
							)}
						</CardContent>
					</form>
				</Form>
			</Card>
		</>
	);
}
