import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { login } from '@/http/userAPI';
import {
	HOME_ROUTE,
	RECOVERY_ROUTE,
	REGISTRATION_ROUTE,
} from '@/lib/constants';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { z } from 'zod';
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
import { useContext } from 'react';
import { Context } from '@/main';
import { Loader2 } from "lucide-react"

const formSchema = z.object({
	login: z
		.string({
			required_error: 'Введите логин.',
		})
		.min(1, {
			message: 'Введите логин.',
		}),

	password: z
		.string({
			required_error: 'Введите пароль.',
		})
		.min(1, { message: 'Введите логин.' }),
});

export function LoginForm() {
	const { store } = useContext(Context);
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
	});
	const navigate = useNavigate();

	const {
		setError,
		formState: { isSubmitting, errors },
	} = form;

	async function onSubmit(values: z.infer<typeof formSchema>) {
    await new Promise(res => setTimeout(res, 500))
		try {
			const data = await login(values.login, values.password);
			store.isAuth = true;
			store.user = data.user;
      localStorage.setItem('token', data.accessToken);
			navigate(HOME_ROUTE);
		} catch (err) {
      console.log(err);
			let errMes = 'Непредвиденная ошибка';
			if (err?.response?.data?.name === 'ApiError') {
				errMes = err.response.data.message;
			}
			setError('root', { message: errMes });
		}
	}

	return (
		<Card className="mx-auto max-w-sm">
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)}>
					<CardHeader>
						<CardTitle className="text-xl">Вход</CardTitle>
						<CardDescription>Введите ваш логин и пароль</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="grid gap-4">
							<div className="grid gap-2">
								{errors.root && (
									<div className="border bg-red-50 border-red-600 p-1 gap-3 flex justify-start items-center rounded">
										<AlertCircle className="ml-1 h-6 w-6" color="#df1b1b" />
										<Balance className="text-sm">{errors.root.message}</Balance>
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
							</div>
							<div className="grid gap-2">
								<FormField
									control={form.control}
									name="password"
									render={({ field }) => (
										<FormItem>
											<div className="flex">
												<FormLabel>Пароль</FormLabel>
												<Link
													to={RECOVERY_ROUTE}
													className="ml-auto inline-block text-sm underline"
												>
													Забыли пароль?
												</Link>
											</div>

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
							</div>
							<Button disabled={isSubmitting} type="submit" className="w-full">
								{isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin"/>Обработка...</> : 'Войти'}
							</Button>
						</div>
						<div className="mt-4 text-center text-sm">
							Нет аккаунта?{' '}
							<Link to={REGISTRATION_ROUTE} className="underline">
								Зарегистрироваться
							</Link>
						</div>
					</CardContent>
				</form>
			</Form>
		</Card>
	);
}
