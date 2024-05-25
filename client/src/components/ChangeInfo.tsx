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

import { Textarea } from './ui/textarea';

import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';
import { useContext } from 'react';
import { Context } from '@/main';
import { Switch } from './ui/switch';
import { $api } from '@/http';
import { Select, SelectContent, SelectItem, SelectTrigger } from './ui/select';

const FormSchema = z.object({
	name: z.string(),
	surname: z.string(),
	about: z.string(),
	rating: z.string(),
  isPrivate: z.boolean(),
  isBlocked: z.boolean(),
  isChatBlocked: z.boolean(),
  role: z.string(),
});

function getRusRole(role) {
  if (role === 'ADMIN') return 'Администратор';
  if (role === 'MODERATOR') return 'Модератор';
  return 'Пользователь';
}

const ChangeInfoForm = ({ user, userId, setUser }) => {
	const { store } = useContext(Context);

	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
		defaultValues: {
			name: user?.info?.name || '',
			surname: user?.info?.surname || '',
			about: user?.info?.about || '',
			rating: user?.info?.rating || '',
			isPrivate: user?.isPrivate || false,
			isBlocked: user?.isBlocked || false,
			isChatBlocked: user?.isChatBlocked || false,
      role: user?.role || 'USER',
		},
	});

	async function onSubmit(data: z.infer<typeof FormSchema>) {
    await new Promise(res => setTimeout(res, 500));

    const response = await $api.post('/user/changeInfo', {
      userId,
      name: data.name,
      surname: data.surname,
      about: data.about,
      rating: Number(data.rating),
      isBlocked: data.isBlocked,
      isChatBlocked: data.isChatBlocked,
      isPrivate: data.isPrivate
    })

		console.log(response.data)
    setUser(response.data)
	}

	const {
		setError,
		formState: { isSubmitting, errors },
	} = form;

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="w-2/3 space-y-6 text-left"
			>
				<FormField
					control={form.control}
					name="name"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Имя</FormLabel>
							<FormControl>
								<Input type="text" placeholder="Добавьте имя" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="surname"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Фамилия</FormLabel>
							<FormControl>
								<Input placeholder="Добавьте фамилию" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="about"
					render={({ field }) => (
						<FormItem>
							<FormLabel>О себе</FormLabel>
							<FormControl>
								<Textarea placeholder="О себе" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
        <FormField
					control={form.control}
					name="rating"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Рейтинг ФШР</FormLabel>
							<FormControl>
								<Input placeholder="Рейтинг ФШР" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="isPrivate"
					render={({ field }) => (
						<FormItem className="flex flex-row items-center justify-start gap-6">
							<div className="space-y-0.5">
								<FormLabel>Приватный профиль</FormLabel>
							</div>
							<FormControl>
								<Switch
									checked={field.value}
									onCheckedChange={field.onChange}
								/>
							</FormControl>
						</FormItem>
					)}
				/>

				{store.user?.role === 'ADMIN' && (
					<>
						<FormField
							control={form.control}
							name="isBlocked"
							render={({ field }) => (
								<FormItem className="flex flex-row items-center justify-start gap-6">
									<div className="space-y-0.5">
										<FormLabel>Заблокировать пользователя</FormLabel>
									</div>
									<FormControl>
										<Switch
											checked={field.value}
											onCheckedChange={field.onChange}
										/>
									</FormControl>
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="isChatBlocked"
							render={({ field }) => (
								<FormItem className="flex flex-row items-center justify-start gap-6">
									<div className="space-y-0.5">
										<FormLabel>Отключить чат</FormLabel>
									</div>
									<FormControl>
										<Switch
											checked={field.value}
											onCheckedChange={field.onChange}
										/>
									</FormControl>
								</FormItem>
							)}
						/>
            <FormField
									control={form.control}
									name="role"
									render={({ field }) => (
										<FormItem className="">
											<FormLabel className="text-base md:text-lg">Роль</FormLabel>
											<Select
												onValueChange={field.onChange}
												value={field.value}
											>
												<FormControl>
													<SelectTrigger>
														<div>{getRusRole(field.value)}</div>
													</SelectTrigger>
												</FormControl>
												<SelectContent >
													<SelectItem value="USER">Пользователь</SelectItem>
													<SelectItem value="MODERATOR">Модератор</SelectItem>
													<SelectItem value="ADMIN">Администратор</SelectItem>
												</SelectContent>
											</Select>
										</FormItem>
									)}
								/>
					</>
          
				)}

				<Button disabled={isSubmitting} type="submit" className="w-full" onClick={() => console.log('click')}>
					{isSubmitting ? (
						<>
							<Loader2 className="mr-2 h-4 w-4 animate-spin" />
							Обработка...
						</>
					) : (
						'Сохранить изменения'
					)}
				</Button>
			</form>
		</Form>
	);
};

export default ChangeInfoForm;
