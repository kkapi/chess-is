import {
	Circle,
	CircleOff,
	Eye,
	Flag,
	Handshake,
	Repeat2,
	Clipboard,
	MessageSquareWarning,
	ClipboardCheck,
} from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Separator } from './ui/separator';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { useContext, useState } from 'react';
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from './ui/tooltip';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from './ui/dialog';
import ComplainForm from './ComplainForm';
import { Context } from '@/main';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';
import socket from '@/socket/socket';

const GameInfo = ({
	roomInfo,
	orientation,
	setOrientation,
	playerType,
	resultMessage,
  setRoomInfo
}) => {
	const { store } = useContext(Context);
	const [copy, setCopy] = useState(false);
	const [open, setOpen] = useState(false);

	const WhiteInfo = () => {
		return (
			<div className="ml-3 self-start">
				{roomInfo?.white ? (
					<div className="flex gap-2 justify-start items-center">
						<div>
							{roomInfo.whiteConnected ? (
								<Circle className="w-6 h-6" color="green" />
							) : (
								<CircleOff className="w-6 h-6" color="red" />
							)}
						</div>
						{/* <p>Идентификатор пользователя: {roomInfo?.white?.userId}</p> */}
						<p className="text-xl font-medium"> {roomInfo?.white?.login}</p>
					</div>
				) : (
					<p className="text-xl font-medium text-center">Ожидание присоединения белых...</p>
				)}
			</div>
		);
	};

	const BlackInfo = () => {
		return (
			<div className="ml-3 self-start">
				{roomInfo?.black ? (
					<div className="flex gap-2 justify-start items-center">
						<div>
							{roomInfo.blackConnected ? (
								<Circle className="w-6 h-6" color="green" />
							) : (
								<CircleOff className="w-6 h-6" color="red" />
							)}
						</div>
						{/* <p>Идентификатор пользователя: {roomInfo?.white?.userId}</p> */}
						<p className="text-xl font-medium"> {roomInfo?.black?.login}</p>
					</div>
				) : (
					<p className="text-xl font-medium text-center">Ожидание присоединения черных...</p>
				)}
			</div>
		);
	};

	return (
		<Card className="w-[350px] md:w-[400px] border h-[500px]">
			<CardContent className="h-full flex flex-col gap-6 justify-center items-center">
				<div className="font-bold text-2xl mt-4">
					{roomInfo?.resultMessage ? (
						<span>{roomInfo?.resultMessage}</span>
					) : (
						<span>Игра</span>
					)}
					{/* <Dialog>
						<DialogTrigger asChild>
							<Button variant="outline">Информация</Button>
						</DialogTrigger>
						<DialogContent className="sm:max-w-[425px]">
							{JSON.stringify(roomInfo, null, '  ')}
						</DialogContent>
					</Dialog> */}
				</div>
				{orientation === 'black' ? <WhiteInfo /> : <BlackInfo />}
				<Separator />
				<div className="h-[200px] flex flex-col gap-5">
					{/* <p>Игра начата: {roomInfo?.started ? 'Да' : 'Нет'}</p> */}
					<div className="flex gap-1">
						<ScrollArea
							type="auto"
							className="text-lg bg-secondary p-3 rounded-md h-[140px] w-5/6"
						>
							{roomInfo?.pgn ? (
								<span>{roomInfo?.pgn}</span>
							) : (
								<div className="flex justify-center items-center">
									Ожидание первого хода
								</div>
							)}
						</ScrollArea>
						<div className="w-1/6 flex flex-col justify-center items-center gap-2">
							<TooltipProvider delayDuration={200}>
								<Tooltip>
									<TooltipTrigger>
										<Button
											variant="outline"
											size="icon"
											className="p-1"
											onClick={() => {
												setOrientation(prev =>
													prev === 'white' ? 'black' : 'white'
												);
											}}
										>
											<Repeat2 className="h-5 w-5" />
										</Button>
									</TooltipTrigger>
									<TooltipContent side="left">
										<p>Перевернуть доску</p>
									</TooltipContent>
								</Tooltip>
							</TooltipProvider>
							<TooltipProvider delayDuration={200}>
								<Tooltip>
									<TooltipTrigger>
										<Button
											disabled={!roomInfo.pgn}
											variant="outline"
											size="icon"
											className="p-1"
											onClick={() => {
												navigator.clipboard.writeText(roomInfo?.pgn);
												setCopy(true);
											}}
										>
											{!copy ? (
												<Clipboard className="h-5 w-5" />
											) : (
												<ClipboardCheck className="h-5 w-5" />
											)}
										</Button>
									</TooltipTrigger>
									<TooltipContent side="left">
										<p>Копировать PGN</p>
									</TooltipContent>
								</Tooltip>
							</TooltipProvider>
							<TooltipProvider delayDuration={200}>
								<Tooltip>
									<TooltipTrigger>
										<Dialog open={store.user && open} onOpenChange={setOpen}>
											<DialogTrigger>
												<Button
													variant="outline"
													size="icon"
													className="p-1"
													disabled={!store.user || !roomInfo?.started}
												>
													<MessageSquareWarning className="h-5 w-5" />
												</Button>
											</DialogTrigger>
											<DialogContent className="w-[400px] md:w-[600px]">
												<DialogHeader>
													<DialogTitle className="text-xl">
														Пожаловаться
													</DialogTitle>
													<DialogDescription>
														<div className="text-base mb-5 text-left">
															Пожалуйста выберете причину жалобы и добавьте
															описание. Наша модерация рассмотрит вашу жалобу и
															примет решение в ближайшее время.
														</div>
														<ComplainForm
															setOpen={setOpen}
															roomInfo={roomInfo}
															playerType={playerType}
														/>
													</DialogDescription>
												</DialogHeader>
											</DialogContent>
										</Dialog>
									</TooltipTrigger>
									<TooltipContent side="left">
										{store.user && roomInfo?.started ? (
											<p>Пожаловаться</p>
										) : (
											<p>
												Отправлять жалобы могут только зарегистрированные
												пользователи после начала игры
											</p>
										)}
									</TooltipContent>
								</Tooltip>
							</TooltipProvider>
						</div>
					</div>

					{/* <p>Время: {roomInfo.time} мс</p>
					<p>Белые подключены: {roomInfo.whiteConnected ? 'Да' : 'Нет'}</p>
					<p>Черные подключены: {roomInfo.blackConnected ? 'Да' : 'Нет'}</p> */}
					{/* <p>Количество подключений белых: {roomInfo.countConnectedWhite}</p>
					<p>Количество подключений черных: {roomInfo.countConnectedBlack}</p> */}
					{/* <p>Приватная игра: {roomInfo.private ? 'Да' : 'Нет'}</p> */}
					{playerType === 'w' || playerType === 'b' ? (
						<div className="flex gap-4 justify-center items-center flex-wrap mt-auto md:justify-between">
							<Button
								variant="outline"
								className="flex gap-2 justify-center items-center w-full md:w-auto border-2 border-foreground-muted"
								disabled={!roomInfo?.pgn || roomInfo?.ended}
							>
								<Handshake /> Предложить ничью
							</Button>
							<AlertDialog>
								<AlertDialogTrigger asChild>
									<Button
                  variant="outline"
                  className="flex gap-2 justify-center items-center w-full md:w-auto border-2 border-foreground-muted"
                  disabled={!roomInfo?.pgn || roomInfo?.ended}
                >
                  <Flag />
                  Сдаться
                </Button>
								</AlertDialogTrigger>
								<AlertDialogContent className='w-[400px] flex flex-col justify-center items-center'>
									<AlertDialogHeader>
										<AlertDialogTitle>
											Вы уверены, что хотите сдаться?
										</AlertDialogTitle>
										
									</AlertDialogHeader>
									<AlertDialogFooter>
										<AlertDialogCancel>Отмена</AlertDialogCancel>
										<AlertDialogAction onClick={() => {
                      if (roomInfo?.end) return;
                      socket.emit('resign', {roomId: roomInfo?.id, userId: store?.user?.id || store?.browserId});
                      setRoomInfo(prev => {
                        return {
                          ...prev,
                          ended: true,
                          resultMessage: playerType === 'w' ? 'Белые сдались, победа черных!' : 'Черные сдались, победа белых!'
                        }
                      })
                    }}>Сдаться</AlertDialogAction>
									</AlertDialogFooter>
								</AlertDialogContent>
							</AlertDialog>
							
						</div>
					) : (
						<div className="flex justify-center items-center gap-3 text-lg font-medium">
							<Eye className="h-8 w-8" />
							Вы являетесь наблюдателем
						</div>
					)}
				</div>
				<Separator className="mt-14 md:mt-0" />
				{orientation === 'white' ? <WhiteInfo /> : <BlackInfo />}
			</CardContent>
		</Card>
	);
};

export default GameInfo;
