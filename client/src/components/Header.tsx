import { Link, useNavigate } from 'react-router-dom';
import { Menu, Crown } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import { Button } from './ui/button';
import { ModeToggle } from './ModeToggle';
import {
	ANALYSIS_ROUTE,
	COMPUTER_ROUTE,
	FINDGAME_ROUTE,
	HOME_ROUTE,
	LOGIN_ROUTE,
	MATERIALS_ROUTE,
	NEWROOM_ROUTE,
	NEWS_ROUTE,
	REGISTRATION_ROUTE,
} from '@/lib/constants';
import { useContext } from 'react';
import { Context } from '@/main';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Separator } from './ui/separator';
import { observer } from 'mobx-react-lite';
import socket from '@/socket/socket';

const Header = () => {
	const { store } = useContext(Context);
	const navigate = useNavigate();

	return (
		<header className="sticky top-0 z-50 w-full flex justify-between h-16 md:h-20 items-center md:justify-center gap-4 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 md:px-6">
			<nav className="container hidden flex-col gap-6 font-medium md:flex md:flex-row md:items-center md:justify-between w-full md:gap-5 md:text-lg lg:gap-6">
				<Link
					to={HOME_ROUTE}
					className="flex items-center gap-2 font-semibold md:text-xl"
				>
					<Crown className="w-8 h-8 mr-1" />
					<span>Шахматы</span>
				</Link>
        {/* <Button onClick={() => {
          socket.emit('print_rooms')
        }}>
          PRINT ROOMS
        </Button> */}
				<Link
					to={FINDGAME_ROUTE}
					className="text-muted-foreground transition-colors hover:text-foreground"
				>
					Найти игру
				</Link>
				<Link
					to={NEWROOM_ROUTE}
					className="text-muted-foreground transition-colors hover:text-foreground"
				>
					Играть с друзьями
				</Link>
				<Link
					to={COMPUTER_ROUTE}
					className="text-muted-foreground transition-colors hover:text-foreground"
				>
					Играть с компьютером
				</Link>

				<Link
					to={ANALYSIS_ROUTE}
					className="text-muted-foreground transition-colors hover:text-foreground"
				>
					Анализ
				</Link>
				{/* <Link
					to={NEWS_ROUTE}
					className="text-muted-foreground transition-colors hover:text-foreground"
				>
					Новости
				</Link> */}
				<Link
					to={MATERIALS_ROUTE}
					className="text-muted-foreground transition-colors hover:text-foreground"
				>
					Материалы
				</Link>
				<div className="flex items-center gap-4">
					<ModeToggle />
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							{store.isAuth ? (
								<Avatar className="cursor-pointer">
									<AvatarImage
										src="http://localhost:5000/124599.jpg"
										alt="avatar"
									/>
									<AvatarFallback>
										{store.user?.login.slice(0, 2)}
									</AvatarFallback>
								</Avatar>
							) : (
								<Button
									variant="outline"
									size="icon"
									className="overflow-hidden rounded-full"
								>
									<img
										src="/placeholder-user.jpg"
										width={36}
										height={36}
										alt="Avatar"
										className="overflow-hidden rounded-full"
									/>
								</Button>
							)}
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end" sideOffset={10}>
							{store.isAuth ? (
								<>
									<DropdownMenuLabel>{store.user?.login}</DropdownMenuLabel>
									<DropdownMenuSeparator />
									<DropdownMenuItem
										onClick={() => navigate(`/profile/${store.user?.id}`)}
									>
										Профиль
									</DropdownMenuItem>
								</>
							) : (
								<DropdownMenuLabel>Посетитель</DropdownMenuLabel>
							)}							

							<DropdownMenuSeparator />
							{store.isAuth ? (
								<DropdownMenuItem
									onClick={async () => {
										try {
											const response = await fetch(
												'http://localhost:5000/user/logout',
												{
													method: 'POST',
													headers: {
														'Content-Type': 'application/json',
													},
													credentials: 'include',
													body: JSON.stringify({ hi: 1 }),
												}
											);

											const result = await response.json();

											store.isAuth = false;
											store.user = null;
                      navigate(HOME_ROUTE);
											console.log(result);
										} catch (error) {
											console.error('Ошибка при отправке POST-запроса:', error);
										}
									}}
								>
									Выйти
								</DropdownMenuItem>
							) : (
								<>
									<DropdownMenuItem
										onClick={() => {
											navigate(LOGIN_ROUTE);
										}}
									>
										Вход
									</DropdownMenuItem>
									<DropdownMenuItem
										onClick={() => {
											navigate(REGISTRATION_ROUTE);
										}}
									>
										Регистрация
									</DropdownMenuItem>
								</>
							)}
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</nav>
			<Sheet>
				<SheetTrigger asChild>
					<Button variant="outline" size="icon" className="shrink-0 md:hidden">
						<Menu className="h-5 w-5" />
						<span className="sr-only">Меню навигации</span>
					</Button>
				</SheetTrigger>
				<SheetContent side="left">
					<nav className="grid gap-6 text-lg font-medium">
						<Link
							to={HOME_ROUTE}
							className="flex items-center gap-2 text-xl font-semibold"
						>
							<Crown className="w-8 h-8 mr-1" />
							<span>Шахматы</span>
						</Link>
						{store.isAuth ? (
							<>
								<div
									className="flex items-center gap-3"
									onClick={() => {
										navigate(`/profile/${store.user?.id}`);
									}}
								>
									<Avatar className="cursor-pointer">
										<AvatarImage
											src="http://localhost:5000/124599.jpg"
											alt="avatar"
										/>
										<AvatarFallback>
											{store.user?.login.slice(0, 2)}
										</AvatarFallback>
									</Avatar>
									{store.user?.login}
								</div>
								<div className="flex gap-4">
									<Link
										to={`/profile/${store.user?.id}`}
										className="inline-block text-base underline"
									>
										Профиль
									</Link>
									<span
                    className='text-base underline'
										onClick={async () => {
											try {
												const response = await fetch(
													'http://localhost:5000/user/logout',
													{
														method: 'POST',
														headers: {
															'Content-Type': 'application/json',
														},
														credentials: 'include',
														body: JSON.stringify({ hi: 1 }),
													}
												);

												const result = await response.json();

												store.isAuth = false;
												store.user = null;
												
											} catch (error) {
												console.error(
													'Ошибка при отправке POST-запроса:',
													error
												);
											}
										}}
									>
										Выйти
									</span>
								</div>
							</>
						) : (
							<>
								Посетитель
								<div className="flex gap-5">
									<Link
										to={LOGIN_ROUTE}
										className="inline-block text-base underline"
									>
										Войти
									</Link>
									<Link to={REGISTRATION_ROUTE} className="text-base underline">
										Зарегистрироваться
									</Link>
								</div>
								<Separator />
							</>
						)}

						<Link
							to={FINDGAME_ROUTE}
							className="text-muted-foreground hover:text-foreground"
						>
							Найти игру
						</Link>
						<Link
							to={NEWROOM_ROUTE}
							className="text-muted-foreground hover:text-foreground"
						>
							Играть с друзьями
						</Link>
						<Link
							to={COMPUTER_ROUTE}
							className="text-muted-foreground hover:text-foreground"
						>
							Играть с компьютером
						</Link>
						<Link
							to={ANALYSIS_ROUTE}
							className="text-muted-foreground hover:text-foreground"
						>
							Анализ
						</Link>					

						<Link
							to={MATERIALS_ROUTE}
							className="text-muted-foreground hover:text-foreground"
						>
							Материалы
						</Link>
					</nav>
				</SheetContent>
			</Sheet>
			<Link
				to={HOME_ROUTE}
				className="flex items-center gap-2 font-semibold md:hidden text-xl"
			>
				<Crown className="w-8 h-8 mr-1" />
				<span>Шахматы</span>
			</Link>
			<span className="md:hidden">
				<ModeToggle />
			</span>
		</header>
	);
};

export default observer(Header);
