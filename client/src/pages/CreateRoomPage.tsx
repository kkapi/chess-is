import CreateRoomForm from '@/components/CreateRoomForm';
import DefaultLayout from '@/layouts/DefaultLayout';

import socket from '@/socket/socket';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const CreateRoomPage = () => {
	const navigate = useNavigate();

	useEffect(() => {
		socket.on('opponent', data => {
			const { roomId } = data;
			navigate(`/play/${roomId}`);
		});
	}, []);

	return (
		<div className="min-h-screen min-w-screen flex flex-col justify-between">
			<DefaultLayout>
				<div className="container relative">
					<div className="grid grid-cols-1 md:grid-cols-2 items-center">
						<div className="flex flex-col gap-2 md:text-lg indent-12 ">
							<h1 className="text-center text-2xl font-bold md:text-4xl mb-4  mt-8 md:mt-0">
								Создание персональной игровой комнаты
							</h1>
							<p>
								На этой странице вы можете создать свою личную шахматную комнату
								для игры с другом. Задайте настройки комнаты и нажмите кнопку
								"Создать игру". Система сгенерирует уникальную ссылку на вашу
								персональную игровую комнату. Отправьте эту ссылку другу, с
								которым хотите сыграть.
							</p>
							<p>
								По ссылке он перейдет прямо в вашу комнату, а вам автоматически
								перенаправит в игру. Если вы передумали играть, нажмите кнопку
								"Отменить". Это удалит вашу комнату и ссылку, чтобы никто не
								смог к ней присоединиться.
							</p>
							<p>
								Персональные игровые комнаты удобны тем, что вы можете играть с
								другом в любое время в комфортной обстановке. Создавайте
								комнаты, приглашайте друзей и наслаждайтесь партиями!
							</p>
						</div>
						<CreateRoomForm />
					</div>
				</div>
			</DefaultLayout>
		</div>
	);
};

export default CreateRoomPage;
