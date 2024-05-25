import ChangeInfoForm from '@/components/ChangeInfo';
import NewPasswordForm from '@/components/NewPasswordForm';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { $api } from '@/http';
import DefaultLayout from '@/layouts/DefaultLayout';
import { Context } from '@/main';

import { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const ProfilePage = () => {
	const { id } = useParams();
	const [user, setUser] = useState({});

	useEffect(() => {
		if (id) {
			async function fetchUserData() {
				const response = await $api.get(`/user/info/1`);
				console.log(response.data);
				setUser(response.data.user);
			}

			fetchUserData();
		}
	}, [id]);

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

		const formattedDate = new Intl.DateTimeFormat('ru-RU', options).format(
			date
		);
		return formattedDate;
	}

	const { store } = useContext(Context);

	return (
		<div className="min-h-screen min-w-screen flex flex-col justify-between">
			<DefaultLayout>
				<div className="container flex flex-col justify-center items-center mt-5">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-12 min-h-[80vh]">
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
										<ChangeInfoForm user={user} setUser={setUser} userId={Number(id)} />
									</div>
								</TabsContent>
								<TabsContent value="password">
									<div className="p-3 px-6 flex flex-col gap-4">
                    <NewPasswordForm />
                  </div>
								</TabsContent>
								<TabsContent value="ui">
									<div className="p-3 px-6 flex flex-col gap-4">
										Персонализация
                    <button onClick={() => {
                      const options = JSON.parse(localStorage.getItem('options'))
                      console.log(options);
                    }}>click</button>
                     <button onClick={() => {
                      const options = JSON.parse(localStorage.getItem('options')) || {};
                      options.board = 'brown',
                      localStorage.setItem("options", JSON.stringify(options));
                    }}>click</button>
									</div>
								</TabsContent>
							</Tabs>
						</div>
						<div className="border rounded p-5">
							<h1 className="text-center font-bold text-3xl">История игр</h1>
							ProfilePage {id} {JSON.stringify(user, null, 2)}
						</div>
					</div>
				</div>
			</DefaultLayout>
		</div>
	);
};

export default ProfilePage;
