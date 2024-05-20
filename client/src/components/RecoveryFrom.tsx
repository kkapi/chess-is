import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { LOGIN_ROUTE } from '@/lib/constants';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
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
import { $api } from '@/http';

const formSchema = z.object({
	email: z
		.string({
			required_error: 'Введите почту.',
		})
		.min(1, {
			message: 'Введите почту.',
		})
		.email({ message: 'Некорректный email' }),
});

export function RecoveryForm() {
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
	});
	const [email, setEmail] = useState('');
	const navigate = useNavigate();

	const {
		setError,
		formState: { isSubmitting, errors },
	} = form;

	async function onSubmit(values: z.infer<typeof formSchema>) {
		console.log(values);

		try {
			const response = await $api.post('/user/recoverpass', { email: values.email.toLowerCase() });
			setEmail(response.data.email);
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
		return <div></div>;
	}

	return (
		<Card className="mx-auto max-w-sm">
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)}>
					<CardHeader>
						<CardTitle className="text-xl">Восстановление пароля</CardTitle>
						<CardDescription>
							<span className="block">
								Укажите почту, на которую зарегистрирован аккаунт
							</span>
							<span className="block mt-3">
								После заполнения формы на указанную почту придет письмо с
								инструкцией по восстановлению пароля.
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
								name="email"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Почта</FormLabel>
										<FormControl>
											<Input
												required={false}
												placeholder="Введите почту, указанную при регистрации"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<Button disabled={isSubmitting} type="submit" className="w-full">
								{isSubmitting ? 'Обработка...' : 'Отправить письмо'}
							</Button>
						</div>
						<div className="mt-4 text-center text-sm">
							Уже есть аккаунт?{' '}
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
