import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import DefaultLayout from '@/layouts/DefaultLayout';
import { Context } from '@/main';
import socket from '@/socket/socket';
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
} from '@/components/ui/form';
import { Slider } from '@/components/ui/slider';
import {
	AlertDialog,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogHeader,
} from '@/components/ui/alert-dialog';
import { Loader2 } from 'lucide-react';

const FormSchema = z.object({
	time: z.number(),
	increment: z.number(),
});

const FindGamePage = () => {
	const navigate = useNavigate();
	const { store } = useContext(Context);
	const [isWating, setIsWating] = useState(false);

	const [chosenTime, setChosenTime] = useState(15);
	const [chosenIncrement, setChosenIncrement] = useState(15);

	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
		defaultValues: {
			time: 15,
			increment: 15,
		},
	});

	useEffect(() => {
		socket.on('foundGame', data => {
			const { roomId } = data;
			navigate(`/play/${roomId}`);
		});
	}, []);

  function startQueue(time, increment) {
    setChosenTime(time);
		setChosenIncrement(increment);
    socket.emit('findGame', {
      userId: store?.user?.id || store?.browserId,
      login: store?.user?.login || 'Аноним',
      time: time,
      increment: increment,
    });
    setIsWating(true);
  }

	function onSubmit(data: z.infer<typeof FormSchema>) {
    startQueue(data.time, data.increment);
	}

	return (
		<DefaultLayout>
			<div className="container relative flex flex-col md:flex-row justify-center items-center min-h-[80vh] gap-16">
				<div className="flex flex-col gap-2 md:text-lg  w-full md:w-1/2">
					<h1 className="text-center text-2xl font-bold md:text-4xl mb-4  mt-8 md:mt-0">
						Поиск игры
					</h1>
					<p className="indent-12">
						На этой странице вы можете запустить подбор игры с другими
						пользователями. Вы можете стартовать быструю игру, нажав на карточку
						с желаемым режимом игры, или настроить параметры подбора.
					</p>
					<p className="indent-12">
						После успешного подбора соперника вы будете автоматически
						перенаправлены в партию.
					</p>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)}>
							<Card className="border-2 py-3 pb-5 md:mt-8 flex flex-col justify-between items-center gap-6">
								<div className="text-center text-xl font-bold md:text-2xl">
									Параметры подбора
								</div>
								<div className="flex flex-col md:flex-row gap-10 justify-center items-center mt-3 w-10/12">
									<FormField
										control={form.control}
										name="time"
										render={({ field }) => (
											<FormItem className="w-4/5">
												<FormLabel className="md:text-lg">Время</FormLabel>
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
											<FormItem className="w-4/5">
												<FormLabel className="md:text-lg">Добавление</FormLabel>
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
								</div>
								<Button className="text-xl" size="lg" type="submit">
									Найти игру
								</Button>
							</Card>
						</form>
					</Form>
				</div>
				<div className="grid grid-cols-1 md:grid-cols-3 md:w-2/5 gap-4 w-full md:h-[500px]">
					<Card
						className="hover:cursor-pointer border-2 hover:border-blue-300 py-5 md:py-0 hover:bg-muted transition-colors duration-300 ease-in-out"
						onClick={() => {
              startQueue(1, 0);
						}}
					>
						<div className="flex flex-col justify-center items-center h-full gap-1">
							<div className="font-bold text-xl text-muted-foreground">
								ПУЛЯ
							</div>
							<div className="font-bold text-4xl">1 + 0</div>
						</div>
					</Card>
					<Card
						className="hover:cursor-pointer border-2 hover:border-blue-300 py-5 md:py-0 hover:bg-muted transition-colors duration-300 ease-in-out"
						onClick={() => {
							startQueue(1, 1);
						}}
					>
						<div className="flex flex-col justify-center items-center h-full gap-1">
							<div className="font-bold text-xl text-muted-foreground">
								ПУЛЯ
							</div>
							<div className="font-bold text-4xl">1 + 1</div>
						</div>
					</Card>
					<Card
						className="hover:cursor-pointer border-2 hover:border-blue-300 py-5 md:py-0 hover:bg-muted transition-colors duration-300 ease-in-out "
						onClick={() => {
							startQueue(2, 0);
						}}
					>
						<div className="flex flex-col justify-center items-center h-full gap-1">
							<div className="font-bold text-xl text-muted-foreground">
								ПУЛЯ
							</div>
							<div className="font-bold text-4xl">2 + 0</div>
						</div>
					</Card>
					<Card
						className="hover:cursor-pointer border-2 hover:border-blue-300 py-5 md:py-0 hover:bg-muted transition-colors duration-300 ease-in-out  "
						onClick={() => {
							startQueue(3, 0);
						}}
					>
						<div className="flex flex-col justify-center items-center h-full gap-1">
							<div className="font-bold text-xl text-muted-foreground">
								БЛИЦ
							</div>
							<div className="font-bold text-4xl">3 + 0</div>
						</div>
					</Card>
					<Card
						className="hover:cursor-pointer border-2 hover:border-blue-300 py-5 md:py-0 hover:bg-muted transition-colors duration-300 ease-in-out  "
						onClick={() => {
							startQueue(3, 2);
						}}
					>
						<div className="flex flex-col justify-center items-center h-full gap-1">
							<div className="font-bold text-xl text-muted-foreground">
								БЛИЦ
							</div>
							<div className="font-bold text-4xl">3 + 2</div>
						</div>
					</Card>
					<Card
						className="hover:cursor-pointer border-2 hover:border-blue-300 py-5 md:py-0 hover:bg-muted transition-colors duration-300 ease-in-out  "
						onClick={() => {
							startQueue(5, 0);
						}}
					>
						<div className="flex flex-col justify-center items-center h-full gap-1">
							<div className="font-bold text-xl text-muted-foreground">
								БЛИЦ
							</div>
							<div className="font-bold text-4xl">5 + 0</div>
						</div>
					</Card>
					<Card
						className="hover:cursor-pointer border-2 hover:border-blue-300 py-5 md:py-0 hover:bg-muted transition-colors duration-300 ease-in-out  "
						onClick={() => {
							startQueue(10, 0);
						}}
					>
						<div className="flex flex-col justify-center items-center h-full gap-1">
							<div className="font-bold text-xl text-muted-foreground">
								БЫСТРЫЕ
							</div>
							<div className="font-bold text-4xl">10 + 0</div>
						</div>
					</Card>
					<Card
						className="hover:cursor-pointer border-2 hover:border-blue-300 py-5 md:py-0 hover:bg-muted transition-colors duration-300 ease-in-out  "
						onClick={() => {
							startQueue(10, 5);
						}}
					>
						<div className="flex flex-col justify-center items-center h-full gap-1">
							<div className="font-bold text-xl text-muted-foreground">
								БЫСТРЫЕ
							</div>
							<div className="font-bold text-4xl">10 + 5</div>
						</div>
					</Card>
					<Card
						className="hover:cursor-pointer border-2 hover:border-blue-300 py-5 md:py-0 hover:bg-muted transition-colors duration-300 ease-in-out  "
						onClick={() => {
							startQueue(15, 0);
						}}
					>
						<div className="flex flex-col justify-center items-center h-full gap-1">
							<div className="font-bold text-xl text-muted-foreground">
								БЫСТРЫЕ
							</div>
							<div className="font-bold text-4xl">15 + 0</div>
						</div>
					</Card>
				</div>
				<AlertDialog
					open={isWating}
					onOpenChange={() => {
						setIsWating(prev => !prev);
					}}
				>
					<AlertDialogContent className="w-[400px] md:w-[500px]">
						<AlertDialogHeader>
							<AlertDialogDescription>
								<div className="flex flex-col justify-center items-center gap-4">
									<div className="mt-6 md:mt-0 text-xl md:text-2xl text-foreground font-bold flex justify-center items-center">
										Подбор оппонента
									</div>
									<div className="flex justify-center items-center gap-5 text-base">
										<span>Минут на партию: {chosenTime} мин.</span>{' '}
										<span>Добавление: {chosenIncrement} с.</span>
									</div>
									<Loader2 className="ml-4 h-8 w-8 animate-spin" />
									<Button onClick={() => {
                    socket.emit('cancelFind');
                    setIsWating(false)
                    }} className="w-3/5 text-lg">
										Отмена
									</Button>
								</div>
							</AlertDialogDescription>
						</AlertDialogHeader>
					</AlertDialogContent>
				</AlertDialog>
			</div>
		</DefaultLayout>
	);
};

export default FindGamePage;
