import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import DefaultLayout from '@/layouts/DefaultLayout';
import { CLIENT_URL } from '@/lib/constants';
import { Context } from '@/main';
import socket from '@/socket/socket';
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CreateRoomPage = () => {
	const { store } = useContext(Context);
	const navigate = useNavigate();
	const [link, setLink] = useState('');
	const [isWating, setIsWating] = useState(false);

	useEffect(() => {
		socket.on('opponent', data => {
			const { roomId } = data;
      navigate(`/play/${roomId}`)
		});
	}, []);

	return (
		<div className="min-h-screen min-w-screen flex flex-col justify-between">
			<DefaultLayout>
				<div className="container relative flex flex-col items-center">
					<h1 className="text-center text-2xl font-bold md:text-4xl">
						Создание персональной игровой комнаты
					</h1>
					<p className="mt-3 md:text-lg indent-12">
						На этой странице вы можете создать свою личную шахматную комнату для
						игры с другом. Вот как это работает: Выберите режим игры из
						выпадающего меню. Доступны варианты: классические шахматы,
						шахматы960, шахматы с ограничением времени и другие. Нажмите кнопку
						"Создать комнату". Система сгенерирует уникальную ссылку на вашу
						персональную игровую комнату. Отправьте эту ссылку другу, с которым
						хотите сыграть. По ссылке он перейдет прямо в вашу комнату. Как
						только друг присоединится, игра начнется автоматически. Вы можете
						начать партию белыми или черными фигурами. Если вы передумали
						играть, нажмите кнопку "Отменить". Это удалит вашу комнату и ссылку,
						чтобы никто не смог к ней присоединиться. Персональные игровые
						комнаты удобны тем, что вы можете играть с другом в любое время в
						комфортной обстановке. Создавайте комнаты, приглашайте друзей и
						наслаждайтесь партиями!
					</p>
					<Card className="p-10">
						<h1>Header</h1>
						<ToggleGroup type="single" variant="outline">
							<ToggleGroupItem value="bold" aria-label="Toggle bold">
								Белые
							</ToggleGroupItem>
							<ToggleGroupItem value="italic" aria-label="Toggle italic">
								Случайно
							</ToggleGroupItem>
							<ToggleGroupItem value="underline" aria-label="Toggle underline">
								Черные
							</ToggleGroupItem>
						</ToggleGroup>
						<Slider min={1} max={15} step={1} value={[3]} />
						<Slider min={1} max={15} step={1} value={[3]} className="mt-4" />
						<Button size="lg" className="text-lg mt-4 w-full">
							Создать игру
						</Button>
					</Card>
					<Button
						onClick={() => {
							socket.emit(
								'create_room',
								{
									userId: store.user?.id || store?.browserId,
									login: store.user?.login || 'Аноним',
								},
								response => {
									if (response?.err) return;
									setIsWating(true);
									setLink(`/play/${response.data.room.id}`);
								}
							);
						}}
					>
						СОЗДАТЬ КОМНАТУ
					</Button>
					{link && <div>{`${CLIENT_URL}${link}`}</div>}
					{isWating && <div>Ожидание соперника...</div>}
				</div>
			</DefaultLayout>
		</div>
	);
};

export default CreateRoomPage;
