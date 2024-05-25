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
import { useContext, useState } from 'react';
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
import { $api } from '@/http';
import { Context } from '@/main';

const formSchema = z.object({
	password: z.string({
		required_error: 'Введите старый пароль',
	}),
	newPassword: z
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
	newPasswordConfirm: z
		.string({
			required_error: 'Подтвердите пароль.',
		})
		.min(5, { message: 'Минимум 5 символов' })
		.max(25, { message: 'Максимум 25 символов' }),
});

export default function NewPasswordForm() {
	const { store } = useContext(Context);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
    defaultValues: {
      password: '',
      newPassword: '',
      newPasswordConfirm: '',
    }
	});

	const {
		setError,
		clearErrors,
		reset,
		formState: { isSubmitting, errors },
	} = form;

	async function onSubmit(values: z.infer<typeof formSchema>) {
		if (values.newPassword !== values.newPasswordConfirm) {
			setError('newPasswordConfirm', { message: 'Пароли не совпадают' });
			return;
		}
		console.log(values);

		try {
			const res = await $api.post('/user/changepass', {
				userId: store.user?.id || 'a',
				password: values.password,
				newPassword: values.newPassword,
			});
			reset();
			clearErrors();
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
		<Card>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)}>
					<CardHeader>
						<CardTitle className="text-2xl">Изменение пароля</CardTitle>
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
										<FormLabel className="text-lg">Старый пароль</FormLabel>
										<FormControl>
											<Input
												type="password"
												placeholder="Введите старый пароль"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="newPassword"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="text-lg">Новый пароль</FormLabel>
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
								name="newPasswordConfirm"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="text-lg">
											Подтверждение пароля
										</FormLabel>
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
					</CardContent>
				</form>
			</Form>
		</Card>
	);
}
