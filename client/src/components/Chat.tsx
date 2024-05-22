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
import { useEffect, useRef, useState } from 'react';
import socket from '@/socket/socket';

const Chat = ({
	roomId,
	messages,
	setMessages,
	color,
	login,
}) => {
	const [message, setMessage] = useState('');
	const chatRef = useRef();

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
		<Card className="w-[350px] md:w-[400px]">
			<CardHeader className="text-center">
				<CardTitle>Чат</CardTitle>
				<CardDescription>Пожалуйста, будьте вежливы в чате.</CardDescription>
			</CardHeader>
			<CardContent>
				<Card
					ref={chatRef}
					className="h-[200px] md:h-[312px] overflow-y-auto overflow-x-hidden p-5 flex flex-col gap-2 justify-start w-full whitespace-pre-wrap"
				>
					{messages.map((mes, i) => (
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
					))}
				</Card>
			</CardContent>
			<CardFooter>
				<form className="flex justify-self-center items-start gap-4 w-full"
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
						placeholder="Введите ваше сообщение"
						type="text"
						className="w-full"
						value={message}
						onChange={e => setMessage(e.target.value)}
					></Input>
					<Button variant="secondary" size="icon" type="submit">
						<ChevronRight className="h-4 w-4" />
					</Button>
				</form>
			</CardFooter>
		</Card>
	);
};

export default Chat;
