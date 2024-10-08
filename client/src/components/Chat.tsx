import { ChevronRight, Send } from 'lucide-react';
import { Button } from './ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from './ui/card';
import { Input } from './ui/input';
import { useContext, useEffect, useRef, useState } from 'react';
import socket from '@/socket/socket';
import { Context } from '@/main';

const Chat = ({ roomId, messages, setMessages, color, login }) => {
	const [message, setMessage] = useState('');
	const chatRef = useRef();

	const { store } = useContext(Context);

	useEffect(() => {
		socket.on('message', data => {
			setMessages(prev => [...prev, { ...data }]);
		});
	}, []);

	function getMesClass(mes) {
		if (mes.color === color) {
			return 'ml-6 bg-muted-foreground text-background p-1 pr-3 pl-3 rounded-md self-end mb-1';
		} else {
			return 'bg-secondary p-1 rounded-md mr-6 pr-3 pl-3 self-start mb-1';
		}
	}

	useEffect(() => {
		chatRef.current.scrollTop = chatRef.current.scrollHeight;
	}, [messages]);

	return (
		<Card className="w-[350px] md:w-[370px] h-[500px]">
			<CardHeader className="text-center">
				<CardTitle>Чат</CardTitle>
				<CardDescription>Пожалуйста, будьте вежливы в чате.</CardDescription>
			</CardHeader>
			<CardContent>
				<Card
					ref={chatRef}
					className="h-[300px] md:h-[312px] overflow-y-auto overflow-x-hidden p-5 flex flex-col gap-2 justify-start w-full whitespace-pre-wrap"
				>
					{messages.map((mes, i) => {
						if (mes?.type === 'info') {
							return (
								<div
									key={i}
									className="bg-secondary p-1 rounded-md pr-3 pl-3 self-start mb-1 border border-foreground"
								>
									<div className="text-xs">
										{mes?.login}{' '}
										{new Date(mes?.time)
											.toLocaleTimeString()
											.split(':')
											.slice(0, 2)
											.join(':')}
									</div>
									<div className="text-xs">{mes?.message}</div>
								</div>
							);
						}
						return (
							<div key={i} className={getMesClass(mes)}>
								<div className="text-xs">
									{mes?.login}{' '}
									{new Date(mes?.time)
										.toLocaleTimeString()
										.split(':')
										.slice(0, 2)
										.join(':')}
								</div>
								<div>{mes?.message}</div>
							</div>
						);
					})}
				</Card>
			</CardContent>
			<CardFooter>
				<form
					className="flex justify-self-center items-start gap-4 w-full"
					onSubmit={e => {
						e.preventDefault();
						if (!message) return;
						console.log(message);
						const newMessage = {
							roomId,
							message,
							color,
							login,
							time: Date.now(),
						};
						setMessages(prev => [...prev, newMessage]);
						socket.emit('message', newMessage);
						setMessage('');
					}}
				>
					<Input
						placeholder={
							store?.user?.isChatBlocked
								? 'Чат заблокирован'
								: 'Введите ваше сообщение'
						}
						type="text"
						className="w-full"
						value={message}
						onChange={e => setMessage(e.target.value)}
						disabled={store?.user?.isChatBlocked}
					></Input>
					<Button variant="secondary" size="icon" type="submit" disabled={store?.user?.isChatBlocked}>
						<ChevronRight className="h-4 w-4" />
					</Button>
				</form>
			</CardFooter>
		</Card>
	);
};

export default Chat;
