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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Textarea } from './ui/textarea';
import { useContext } from 'react';
import { Context } from '@/main';
import { $authApi } from '@/http';

const FormSchema = z.object({
	reason: z.string({
		required_error: 'Пожалуйста выберете причину.',
	}),
	description: z
		.string({
			required_error: 'Пожалуйста добавьте описание.',
		})
		.min(5, {
			message: 'Пожалуйста расширьте описание.',
		}),
});

const ComplainForm = ({ setOpen, roomInfo, playerType }) => {
	const { store } = useContext(Context);
	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
	});

	function onSubmit(data: z.infer<typeof FormSchema>) {
		console.log({ data, roomInfo, playerType, user: store.user && {
      email: store.user.email,
      id: store.user.id,
      login: store.user.login,
      role: store.user.role,
    } });

    const response = $authApi.post('/complaint/new', {
      gameUuid: roomInfo?.id,
      applicant: store?.user?.id,
      defendant: roomInfo?.white?.userId === store?.user?.id ? roomInfo?.black?.userId : roomInfo?.white?.userId,
      reason: data.reason,
      description: data.description
    });

		setOpen(false);
	}

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="w-2/3 space-y-6 text-left"
			>
				<FormField
					control={form.control}
					name="reason"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Причина</FormLabel>
							<Select onValueChange={field.onChange} defaultValue={field.value}>
								<FormControl>
									<SelectTrigger>
										<SelectValue placeholder="Выберете причину жалобы" />
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									<SelectItem value="cheat">Жульничество</SelectItem>
									<SelectItem value="insult">Оскорбление</SelectItem>
									<SelectItem value="stall">Затягивание игры</SelectItem>
									<SelectItem value="other">Другое</SelectItem>
								</SelectContent>
							</Select>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="description"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Описание</FormLabel>

							<FormControl>
								<Textarea
									placeholder="Пожалуйста опишите проблему"
									className="resize-none"
									{...field}
								/>
							</FormControl>

							<FormMessage />
						</FormItem>
					)}
				/>
				<Button type="submit" className="mt-5">
					Пожаловаться
				</Button>
			</form>
		</Form>
	);
};

export default ComplainForm;
