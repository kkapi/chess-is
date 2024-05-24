import { Button } from '@/components/ui/button';
import DefaultLayout from '@/layouts/DefaultLayout';
import { Context } from '@/main';
import socket from '@/socket/socket';
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const FindGamePage = () => {
	const navigate = useNavigate();
	const { store } = useContext(Context);
	const [isWating, setIsWating] = useState(false);

	useEffect(() => {
		socket.on('foundGame', data => {
			const { roomId } = data;
			navigate(`/play/${roomId}`);
		});
	}, []);

	return (
		<div className="min-h-screen min-w-screen flex flex-col justify-between">
			<DefaultLayout>
				<div className="container border border-red-500 min-h-[760px] flex justify-center items-center">
					{isWating ? (
						'Ждем...'
					) : (
						<Button
							onClick={() => {
								socket.emit('findGame', {
									userId: store?.user?.id || store?.browserId,
									login: store?.user?.login || 'Аноним',
									time: 5,
									increment: 0,
								});
                setIsWating(true);
							}}
						>
							Find game
						</Button>
					)}
				</div>
			</DefaultLayout>
		</div>
	);
};

export default FindGamePage;
