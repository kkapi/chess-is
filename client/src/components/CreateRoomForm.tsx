import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
} from './ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger } from './ui/select';
import { Button } from './ui/button';
import { Switch } from './ui/switch';
import { Slider } from './ui/slider';
import { useContext, useState } from 'react';
import socket from '@/socket/socket';
import { Context } from '@/main';
import { CLIENT_URL } from '@/lib/constants';
import { Loader2, Clipboard, ClipboardCheck } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

const FormSchema = z.object({
	color: z.string(),
	variant: z.string(),
	timeControl: z.boolean(),
	private: z.boolean(),
	time: z.number(),
	increment: z.number(),
});

const CreateRoomForm = () => {
	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
		defaultValues: {
			color: 'Случайный',
			variant: 'Стандарт',
			timeControl: false,
			private: false,
			time: 15,
			increment: 15,
		},
	});

	const { store } = useContext(Context);

	const [isWating, setIsWating] = useState(false);
	const [link, setLink] = useState('');
	const [copy, setCopy] = useState(false);

	function onSubmit(data: z.infer<typeof FormSchema>) {
		console.log(data);
		socket.emit(
			'create_room',
			{
				userId: store.user?.id || store?.browserId,
				login: store.user?.login || 'Аноним',
				color: data.color,
				variant: data.variant,
				timeControl: data.timeControl,
				private: data.private,
				time: data.time,
				increment: data.increment,
			},
			response => {
				if (response?.err) return;
				setIsWating(true);
				setLink(`/play/${response.data.room.id}`);
			}
		);
	}

	return (
		<div className="flex justify-center">
			<div className="my-6 md:my-0">
				{isWating ? (
					<div className="flex flex-col text-center items-center gap-2 md:gap-4">
						<div className="mt-6 md:mt-0 text-xl md:text-2xl font-bold flex justify-center items-center">
							Ожидание присоединения оппонента
							<Loader2 className="ml-4 h-8 w-8 animate-spin" />
						</div>
						<div className="md:text-lg">
							С вами сыграет первый, кто перейдет по этой ссылке
						</div>
						<div className="bg-secondary p-3 rounded-lg border-secondary border flex gap-2 w-fit items-center justify-center text-muted-foreground">
							{`${CLIENT_URL}${link}`}{' '}
							<Button
								size="icon"
								variant="outline"
								onClick={() => {
									navigator.clipboard.writeText(`${CLIENT_URL}${link}`);
									setCopy(true);
									setTimeout(() => {
										setCopy(false);
									}, 2000);
								}}
							>
								{!copy ? (
									<Clipboard className="h-5 w-5" />
								) : (
									<ClipboardCheck className="h-5 w-5" />
								)}
							</Button>
						</div>
						<div className="flex gap-2">
							<div className="w-1/2 text-center flex justify-center items-center">
								Ваш соперник также может отсканировать этот QR-код
							</div>
							<QRCodeSVG value={`${CLIENT_URL}${link}`} />
						</div>
					</div>
				) : (
					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(onSubmit)}
							className="w-full space-y-6 p-8 flex flex-col justify-start items-center border-2 bordre-buted-background rounded-lg"
						>
              <div className='text-center text-xl font-bold'>Настройка комнаты</div>
							<div className="flex flex-row items-center justify-center w-full gap-8">
								<FormField
									control={form.control}
									name="variant"
									render={({ field }) => (
										<FormItem className="text-center">
											<FormLabel className="text-base">Вариант</FormLabel>
											<Select
												onValueChange={field.onChange}
												value={field.value}
											>
												<FormControl>
													<SelectTrigger>
														<div>{field.value}</div>
													</SelectTrigger>
												</FormControl>
												<SelectContent>
													<SelectItem value="Стандарт">Стандарт</SelectItem>
													<SelectItem value="Шахматы 960">
														Шахматы 960
													</SelectItem>
												</SelectContent>
											</Select>
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="color"
									render={({ field }) => (
										<FormItem className="text-center">
											<FormLabel className="text-base">Цвет</FormLabel>
											<Select
												onValueChange={field.onChange}
												value={field.value}
											>
												<FormControl>
													<SelectTrigger>
														<div>{field.value}</div>
													</SelectTrigger>
												</FormControl>
												<SelectContent>
													<SelectItem value="Случайно">Случайно</SelectItem>
													<SelectItem value="Белые">Белые</SelectItem>
													<SelectItem value="Черные">Черные</SelectItem>
												</SelectContent>
											</Select>
										</FormItem>
									)}
								/>
							</div>

							<FormField
								control={form.control}
								name="timeControl"
								render={({ field }) => (
									<FormItem className="flex flex-row items-center justify-start gap-6">
										<div className="space-y-0.5">
											<FormLabel className="text-base">
												Контроль времени
											</FormLabel>
											<FormDescription>Ограничение по времени</FormDescription>
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
								name="private"
								render={({ field }) => (
									<FormItem className="flex flex-row items-center justify-start gap-6">
										<div className="space-y-0.5">
											<FormLabel className="text-base">
												Приватная комната
											</FormLabel>
											<FormDescription>
												Запретить просмотр партии
											</FormDescription>
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

							{form.watch('timeControl') && (
								<>
									<FormField
										control={form.control}
										name="time"
										render={({ field }) => (
											<FormItem className='w-4/5'>
												<FormLabel>Время</FormLabel>
												<FormControl>
													<Slider
														onValueChange={value => field.onChange(value[0])}
														defaultValue={[field.value]}
														min={1}
														max={30}
													/>
												</FormControl>
												<FormDescription>
													Минут на партию: {field.value} мин.
												</FormDescription>
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="increment"
										render={({ field }) => (
											<FormItem className='w-4/5'>
												<FormLabel>Добавление</FormLabel>
												<FormControl>
													<Slider
														onValueChange={value => field.onChange(value[0])}
														defaultValue={[field.value]}
														min={0}
														max={30}
													/>
												</FormControl>
												<FormDescription>
													Добавление секунд на ход: {field.value} сек.
												</FormDescription>
											</FormItem>
										)}
									/>
								</>
							)}

							<Button type="submit" className="w-80">
								Создать комнату
							</Button>
						</form>
					</Form>
				)}
			</div>
		</div>
	);
};

export default CreateRoomForm;
