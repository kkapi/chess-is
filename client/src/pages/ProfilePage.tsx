import ChangeInfoForm from '@/components/ChangeInfo';
import NewPasswordForm from '@/components/NewPasswordForm';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { $api } from '@/http';
import DefaultLayout from '@/layouts/DefaultLayout';
import { Context } from '@/main';

import { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

function formatDateTime(isoString) {
	const date = new Date(isoString);

	const options = {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
		hour: 'numeric',
		minute: 'numeric',
	};

	return date.toLocaleString('ru-RU', options);
}

function getRusRole(role) {
	if (role === 'ADMIN') return 'Администратор';
	if (role === 'MODERATOR') return 'Модератор';
	return 'Пользователь';
}

function getDate(dateString) {
	const date = new Date(dateString);

	const options = {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
	};

	const formattedDate = new Intl.DateTimeFormat('ru-RU', options).format(date);
	return formattedDate;
}

const ProfilePage = () => {
	const { id } = useParams();
	const [user, setUser] = useState({});
	const [games, setGames] = useState([]);

  const navigate = useNavigate();

	useEffect(() => {
		if (id) {
			async function fetchUserData() {
				const response = await $api.get(`/user/info/${id}`);
				const gResponse = await $api.get(`/user/games/${id}`);
				console.log(response.data);
				setUser(response.data.user);
				setGames(gResponse.data);
			}

			fetchUserData();
		}
	}, [id]);

	const { store } = useContext(Context);

	return (
		<div className="min-h-screen min-w-screen flex flex-col justify-between">
			<DefaultLayout>
				<div className="container flex flex-col justify-center items-center mt-5">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-12 min-h-[70vh]">
						<div className="border rounded p-5">
							<Tabs defaultValue="profile" className="w-full h-full">
								<TabsList className="w-full md flex justify-between overflow-auto">
									<TabsTrigger value="profile">Профиль</TabsTrigger>
									<TabsTrigger
										value="edit"
										disabled={
											!(
												store.user?.id === Number(id) ||
												store.user?.role === 'ADMIN'
											)
										}
									>
										Редактирование
									</TabsTrigger>
									<TabsTrigger
										value="password"
										disabled={store.user?.id !== Number(id)}
									>
										Изменение пароля
									</TabsTrigger>
									<TabsTrigger
										disabled={store.user?.id !== Number(id)}
										value="ui"
									>
										Персонализация
									</TabsTrigger>
								</TabsList>
								<TabsContent value="profile">
									<div className="p-3 px-6 flex flex-col gap-4">
										<h1 className="text-4xl font-bold flex justify-start items-center gap-4">
											{user.login}{' '}
											<Badge className="mt-2 text-base">
												{getRusRole(user.role)}
											</Badge>
										</h1>
										<div className="text-lg text-muted-foreground font-semibold">
											{' '}
											Пользуется системой с{' '}
											{user?.info?.createdAt
												? getDate(user?.info?.createdAt)
												: ''}
										</div>
										<div className="text-lg text-muted-foreground font-semibold">
											Рейтинг в системе{' '}
											<Badge className="mt-1 text-base" variant="secondary">
												{user?.info?.elo}
											</Badge>
										</div>

										{(store?.user?.id === Number(id) ||
											store.user?.role === 'ADMIN') && (
											<div className="text-lg text-muted-foreground font-semibold">
												Почта <span className="italic">{user?.email}</span>
											</div>
										)}
										<Separator className="my-2" />
										<div className="text-lg text-foreground font-semibold">
											Имя:{' '}
											{user?.info?.name ? (
												<span className="text-muted-foreground">
													{user?.info?.name}
												</span>
											) : (
												<span className="text-muted-foreground">
													Пользователь не указал имя
												</span>
											)}
										</div>
										<Separator className="my-2" />
										<div className="text-lg text-foreground font-semibold">
											Фамилия:{' '}
											{user?.info?.surname ? (
												<span className="text-muted-foreground">
													{user?.info?.surname}
												</span>
											) : (
												<span className="text-muted-foreground">
													Пользователь не указал фамилию
												</span>
											)}
										</div>
										<Separator className="my-2" />
										<div className="text-lg text-foreground font-semibold">
											О себе:{' '}
											{user?.info?.about ? (
												<span className="text-muted-foreground">
													{user?.info?.about}
												</span>
											) : (
												<span className="text-muted-foreground">
													Пользователь не указал информацию о себе
												</span>
											)}
										</div>
										<Separator className="my-2" />
										<div className="text-lg text-foreground font-semibold">
											Рейтинг Федерации Шахмат России:{' '}
											{user?.info?.rating ? (
												<span className="text-muted-foreground">
													{user?.info?.rating}
												</span>
											) : (
												<span className="text-muted-foreground">
													Пользователь не указал рейтинг ФШР
												</span>
											)}
										</div>

										<Separator className="my-2" />
										<div className="flex flex-col md:flex-row justify-start items-center gap-8">
											<div className="text-lg text-foreground font-semibold">
												Статус:{' '}
												<Badge className="text-base">
													{user?.isBlocked ? 'Заблокирован' : 'Активный'}
												</Badge>
											</div>
											<div className="text-lg text-foreground font-semibold">
												Чат:{' '}
												<Badge className="text-base">
													{user?.isChatBlocked ? 'Заблокирован' : 'Доступен'}
												</Badge>
											</div>
										</div>
									</div>
								</TabsContent>
								<TabsContent value="edit">
									<div className="p-3 px-6 flex flex-col gap-4 items-center">
										<span className="text-center font-semibold text-2xl">
											Редактировать
										</span>
										<ChangeInfoForm
											user={user}
											setUser={setUser}
											userId={Number(id)}
										/>
									</div>
								</TabsContent>
								<TabsContent value="password">
									<div className="p-3 px-6 flex flex-col gap-4">
										<NewPasswordForm />
									</div>
								</TabsContent>
								<TabsContent value="ui">
									<div className="p-3 px-6 flex flex-col gap-4 justify-center items-center">
										<div className="text-2xl font-bold text-center">
											Персонализация
										</div>

										<div className="text-2xl font-bold text-center">Доска</div>
										<div className="flex justify-center items-center gap-5">
											<div
												className="w-[100px] h-[100px] grid grid-cols-2 cursor-pointer"
												onClick={() => {
													const options =
														JSON.parse(localStorage.getItem('options')) || {};
													(options.board = 'brown'),
														localStorage.setItem(
															'options',
															JSON.stringify(options)
														);
												}}
											>
												<div className="w-[50px] h-[50px] bg-[#B48764]"></div>
												<div className="w-[50px] h-[50px] bg-[#F0D8B6]"></div>
												<div className="w-[50px] h-[50px] bg-[#F0D8B6]"></div>
												<div className="w-[50px] h-[50px] bg-[#B48764]"></div>
											</div>
											<div
												className="w-[100px] h-[100px] grid grid-cols-2 cursor-pointer"
												onClick={() => {
													const options =
														JSON.parse(localStorage.getItem('options')) || {};
													(options.board = 'green'),
														localStorage.setItem(
															'options',
															JSON.stringify(options)
														);
												}}
											>
												<div className="w-[50px] h-[50px] bg-[#779952]"></div>
												<div className="w-[50px] h-[50px] bg-[#edeed1]"></div>
												<div className="w-[50px] h-[50px] bg-[#edeed1]"></div>
												<div className="w-[50px] h-[50px] bg-[#779952]"></div>
											</div>
											<div
												className="w-[100px] h-[100px] grid grid-cols-2 cursor-pointer"
												onClick={() => {
													const options =
														JSON.parse(localStorage.getItem('options')) || {};
													(options.board = 'purple'),
														localStorage.setItem(
															'options',
															JSON.stringify(options)
														);
												}}
											>
												<div className="w-[50px] h-[50px] bg-[#8467a5]"></div>
												<div className="w-[50px] h-[50px] bg-[#e4daf1]"></div>
												<div className="w-[50px] h-[50px] bg-[#e4daf1]"></div>
												<div className="w-[50px] h-[50px] bg-[#8467a5]"></div>
											</div>
											<div
												className="w-[100px] h-[100px] grid grid-cols-2 cursor-pointer"
												onClick={() => {
													const options =
														JSON.parse(localStorage.getItem('options')) || {};
													(options.board = 'blue'),
														localStorage.setItem(
															'options',
															JSON.stringify(options)
														);
												}}
											>
												<div className="w-[50px] h-[50px] bg-[#5980b9]"></div>
												<div className="w-[50px] h-[50px] bg-[#cadaf3]"></div>
												<div className="w-[50px] h-[50px] bg-[#cadaf3]"></div>
												<div className="w-[50px] h-[50px] bg-[#5980b9]"></div>
											</div>
										</div>
										<Separator className="my-2" />
										<div className="text-2xl font-bold text-center">Фигуры</div>
										<div
											className="flex justify-center items-center cursor-pointer"
											onClick={() => {
												const options =
													JSON.parse(localStorage.getItem('options')) || {};
												(options.pieces = 'a'),
													localStorage.setItem(
														'options',
														JSON.stringify(options)
													);
											}}
										>
											<div className="w-[70px] h-[70px] bg-[#B48764]">
												<img src="/a-wP.svg" alt="" />
											</div>
											<div className="w-[70px] h-[70px] bg-[#F0D8B6]">
												<img src="/a-wR.svg" alt="" />
											</div>
											<div className="w-[70px] h-[70px] bg-[#B48764]">
												<img src="/a-wN.svg" alt="" />
											</div>
											<div className="w-[70px] h-[70px] bg-[#F0D8B6]">
												<img src="/a-wB.svg" alt="" />
											</div>
											<div className="w-[70px] h-[70px] bg-[#B48764]">
												<img src="/a-wK.svg" alt="" />
											</div>
											<div className="w-[70px] h-[70px] bg-[#F0D8B6]">
												<img src="/a-wQ.svg" alt="" />
											</div>
										</div>
										<div
											className="flex justify-center items-center cursor-pointer"
											onClick={() => {
												const options =
													JSON.parse(localStorage.getItem('options')) || {};
												(options.pieces = 'c'),
													localStorage.setItem(
														'options',
														JSON.stringify(options)
													);
											}}
										>
											<div className="w-[70px] h-[70px] bg-[#B48764]">
												<img src="/c-bP.png" alt="" />
											</div>
											<div className="w-[70px] h-[70px] bg-[#F0D8B6]">
												<img src="/c-bR.png" alt="" />
											</div>
											<div className="w-[70px] h-[70px] bg-[#B48764]">
												<img src="/c-bN.png" alt="" />
											</div>
											<div className="w-[70px] h-[70px] bg-[#F0D8B6]">
												<img src="/c-bB.png" alt="" />
											</div>
											<div className="w-[70px] h-[70px] bg-[#B48764]">
												<img src="/c-bK.png" alt="" />
											</div>
											<div className="w-[70px] h-[70px] bg-[#F0D8B6]">
												<img src="/c-bQ.png" alt="" />
											</div>
										</div>
										<div
											className="flex justify-center items-center cursor-pointer"
											onClick={() => {
												const options =
													JSON.parse(localStorage.getItem('options')) || {};
												(options.pieces = 'n'),
													localStorage.setItem(
														'options',
														JSON.stringify(options)
													);
											}}
										>
											<div className="w-[70px] h-[70px] bg-[#B48764]">
												<img src="/n-wP.svg" alt="" />
											</div>
											<div className="w-[70px] h-[70px] bg-[#F0D8B6]">
												<img src="/n-wR.svg" alt="" />
											</div>
											<div className="w-[70px] h-[70px] bg-[#B48764]">
												<img src="/n-wN.svg" alt="" />
											</div>
											<div className="w-[70px] h-[70px] bg-[#F0D8B6]">
												<img src="/n-wB.svg" alt="" />
											</div>
											<div className="w-[70px] h-[70px] bg-[#B48764]">
												<img src="/n-wK.svg" alt="" />
											</div>
											<div className="w-[70px] h-[70px] bg-[#F0D8B6]">
												<img src="/n-wQ.svg" alt="" />
											</div>
										</div>
									</div>
								</TabsContent>
							</Tabs>
						</div>
						<div className="border rounded p-5">
							<h1 className="text-center font-bold text-3xl mb-5">
								История игр
							</h1>
							<div className="flex flex-col justify-start items-center h-[650px] overflow-y-auto gap-5 pr-4">
								{!games?.length && <div>Нет информации об играх</div>}
								{games?.map(game => (
									<div
										className="border rounded-md p-4 w-full cursor-pointer hover:border-blue-300 hover:bg-muted transition-colors duration-300 ease-in-out"
										onClick={() => {navigate(`/games/${game?.uuid}`)}}
									>
										<div className="flex justify-start gap-4 items-center">
											<span className="text-base font-bold">
												Игра {formatDateTime(game?.createdAt)}
											</span>
										</div>
										<Separator className="my-2" />

										<div className="text-base font-semibold">
											Результат:{' '}
											<span className="text-muted-foreground">
												{game?.resultMessage}
											</span>
										</div>
										<div className="text-base font-semibold">
											Цвет:{' '}
											<span className="text-muted-foreground">
												{id == game?.black ? 'Черные' : 'Белые'}
											</span>
										</div>
									</div>
								))}
								{games?.map(game => (
									<div className="border rounded-md p-4 w-full">
										<div>Дата и время: {formatDateTime(game?.createdAt)}</div>
										<div>Результат: {game?.resultMessage}</div>
										<div>Цвет: {id == game?.black ? 'Черные' : 'Белые'}</div>
									</div>
								))}
								{games?.map(game => (
									<div className="border rounded-md p-4 w-full">
										<div>Дата и время: {formatDateTime(game?.createdAt)}</div>
										<div>Результат: {game?.resultMessage}</div>
										<div>Цвет: {id == game?.black ? 'Черные' : 'Белые'}</div>
									</div>
								))}
								{games?.map(game => (
									<div className="border rounded-md p-4 w-full">
										<div>Дата и время: {formatDateTime(game?.createdAt)}</div>
										<div>Результат: {game?.resultMessage}</div>
										<div>Цвет: {id == game?.black ? 'Черные' : 'Белые'}</div>
									</div>
								))}
								{games?.map(game => (
									<div className="border rounded-md p-4 w-full">
										<div>Дата и время: {formatDateTime(game?.createdAt)}</div>
										<div>Результат: {game?.resultMessage}</div>
										<div>Цвет: {id == game?.black ? 'Черные' : 'Белые'}</div>
									</div>
								))}
								{games?.map(game => (
									<div className="border rounded-md p-4 w-full">
										<div>Дата и время: {formatDateTime(game?.createdAt)}</div>
										<div>Результат: {game?.resultMessage}</div>
										<div>Цвет: {id == game?.black ? 'Черные' : 'Белые'}</div>
									</div>
								))}
								{games?.map(game => (
									<div className="border rounded-md p-4 w-full">
										<div>Дата и время: {formatDateTime(game?.createdAt)}</div>
										<div>Результат: {game?.resultMessage}</div>
										<div>Цвет: {id == game?.black ? 'Черные' : 'Белые'}</div>
									</div>
								))}
								{games?.map(game => (
									<div className="border rounded-md p-4 w-full">
										<div>Дата и время: {formatDateTime(game?.createdAt)}</div>
										<div>Результат: {game?.resultMessage}</div>
										<div>Цвет: {id == game?.black ? 'Черные' : 'Белые'}</div>
									</div>
								))}
								{games?.map(game => (
									<div className="border rounded-md p-4 w-full">
										<div>Дата и время: {formatDateTime(game?.createdAt)}</div>
										<div>Результат: {game?.resultMessage}</div>
										<div>Цвет: {id == game?.black ? 'Черные' : 'Белые'}</div>
									</div>
								))}
							</div>
						</div>
					</div>
				</div>
			</DefaultLayout>
		</div>
	);
};

export default ProfilePage;
