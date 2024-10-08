import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import DefaultLayout from '@/layouts/DefaultLayout';
import { useNavigate } from 'react-router-dom';
import Balance from 'react-wrap-balancer';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
	BookMarked,
	BrainCircuit,
	CircleUserRound,
	Cpu,
	Newspaper,
	ScrollText,
	UserRoundSearch,
	UsersRound,
} from 'lucide-react';
import {
	ANALYSIS_ROUTE,
	COMPUTER_ROUTE,
	FINDGAME_ROUTE,
	LOGIN_ROUTE,
	MATERIALS_ROUTE,
	NEWROOM_ROUTE,
	NEWS_ROUTE,
	REGISTRATION_ROUTE,
} from '@/lib/constants';
import { useContext } from 'react';
import { Context } from '@/main';
import { observer } from 'mobx-react-lite';

const HomePage = () => {
	const navigate = useNavigate();
	const { store } = useContext(Context);

	return (
		<DefaultLayout>
			<div className="container relative">
				<section
					className={cn(
						'mx-auto flex max-w-[980px] flex-col items-center gap-2 py-8 md:py-6 md:pb-8 lg:py-24 lg:pb-20'
					)}
				>
					<h1
						className={cn(
							'text-center text-3xl font-bold leading-tight tracking-tighter md:text-5xl lg:leading-[1.1]'
						)}
					>
						Информационная система «Шахматы»
					</h1>
					<Balance
						className={cn(
							'max-w-[750px] text-center text-lg text-muted-foreground sm:text-xl mt-5'
						)}
					>
						Добро пожаловать в информационную систему «Шахматы»! Мы создали
						уникальное онлайн пространство, где вы можете насладиться любимой
						игрой. Платформа позволяет создавать комнаты для игры с друзьями,
						подбирать соперников и анализировать партии без необходимости
						регистрации. Присоединяйтесь к нам, чтобы открыть еще больше
						возможностей и окунуться в мир стратегий и интеллектуальных вызовов
						прямо сейчас!
					</Balance>
					{!store.isAuth && (
						<div
							className={cn(
								'flex w-full items-center justify-center space-x-4 py-4 md:pb-10 mt-4'
							)}
						>
							<Button
								className="md:text-base"
								onClick={() => {
									navigate(LOGIN_ROUTE);
								}}
							>
								Войти
							</Button>
							<Button
								className="md:text-base"
								variant="outline"
								onClick={() => {
									navigate(REGISTRATION_ROUTE);
								}}
							>
								Зарегистрироваться
							</Button>
						</div>
					)}
				</section>

				<Separator />

				<div className="mt-10 md:mt-16 grid gap-5 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
					<Card
						onClick={() => navigate(FINDGAME_ROUTE)}
						className="hover:cursor-pointer hover:border-blue-300 hover:bg-muted transition-colors duration-300 ease-in-out"
					>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-2xl font-medium">Найти игру</CardTitle>
						</CardHeader>
						<CardContent className="flex items-center justify-center gap-4">
							<p className="text-sm text-muted-foreground w-5/6">
								Найдите соперника для игры в шахматы. Выберете режим и нажмите
								кнопку "Поиск". Когда оппонент найден, оба игрока
								перенаправляются в персональную комнату для игры в шахматы. Для
								авторизованных и неавторизованных пользователей существует две
								разные очереди подбора.
							</p>
							<UserRoundSearch className="w-1/6 h-auto" />
						</CardContent>
					</Card>
					<Card
						onClick={() => navigate(NEWROOM_ROUTE)}
						className="hover:cursor-pointer hover:border-blue-300 hover:bg-muted transition-colors duration-300 ease-in-out"
					>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-2xl font-medium">
								Играть с друзьями
							</CardTitle>
						</CardHeader>
						<CardContent className="flex items-center justify-center gap-4">
							<p className="text-sm text-muted-foreground w-5/6">
								Здесь вы можете создать персональную комнату для игры с вашими
								друзьями. Просто скопируйте уникальный идентификатор комнаты и
								отправьте его вашим друзьям, чтобы начать игру. Приглашайте
								знакомых на увлекательные матчи и наслаждайтесь игрой вместе.
							</p>
							<UsersRound className="w-1/6 h-auto" />
						</CardContent>
					</Card>
					<Card
						onClick={() => navigate(COMPUTER_ROUTE)}
						className="hover:cursor-pointer hover:border-blue-300 hover:bg-muted transition-colors duration-300 ease-in-out"
					>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-2xl font-medium">
								Играть с компьютером
							</CardTitle>
						</CardHeader>
						<CardContent className="flex items-center justify-center gap-4">
							<p className="text-sm text-muted-foreground w-5/6">
								Сыграйте партию в шахматы против умного компьютерного соперника!
								Вы можете выбрать уровень сложности, чтобы подобрать подходящего
								оппонента. Игра против компьютера - отличная возможность
								улучшить свои шахматные навыки, а также просто весело провести
								время.
							</p>
							<Cpu className="w-1/6 h-auto" />
						</CardContent>
					</Card>
					<Card
						onClick={() => navigate(ANALYSIS_ROUTE)}
						className="hover:cursor-pointer hover:border-blue-300 hover:bg-muted transition-colors duration-300 ease-in-out"
					>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-2xl font-medium">
								Анализировать партии
							</CardTitle>
						</CardHeader>
						<CardContent className="flex items-center justify-center gap-4">
							<p className="text-sm text-muted-foreground w-5/6">
								Погрузитесь в мир стратегии и тактики шахмат с возможностью
								анализировать ваши партии. Разбирайте свои ходы, обсуждайте
								улучшайте свою игру. Вы запустить анализ с начальной позиции или
								загрузить партии в форматах PGN и FEN.
							</p>
							<BrainCircuit className="w-1/6 h-auto" />
						</CardContent>
					</Card>
					<Card
						onClick={() => {
              if (store.isAuth) {
                navigate(`/profile/${store.user?.id}`)
              } else {
                navigate(LOGIN_ROUTE)
              }
            }}
						className="hover:cursor-pointer hover:border-blue-300 hover:bg-muted transition-colors duration-300 ease-in-out"
					>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-2xl font-medium">Просмотр партий</CardTitle>
						</CardHeader>
						<CardContent className="flex items-center justify-center gap-4">
							<p className="text-sm text-muted-foreground w-5/6">
								Зарегистрируйтесь в системе чтобы иметь доступ к завершенным
								партиям. Получите возможность отправлять жалобы во время игры,
								наша модерация рассмотрит все подозрительные случаи. Настройте
								цвет доски и формат фигур в разделе персонализация.
							</p>
							<ScrollText className="w-1/6 h-auto" />
						</CardContent>
					</Card>

					<Card
						onClick={() => navigate(MATERIALS_ROUTE)}
						className="hover:cursor-pointer hover:border-blue-300 hover:bg-muted transition-colors duration-300 ease-in-out"
					>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-2xl font-medium">Материалы</CardTitle>
						</CardHeader>
						<CardContent className="flex items-center justify-center gap-4">
							<p className="text-sm text-muted-foreground w-5/6">
								Здесь вы найдете базовую информацию о шахматах, которая поможет
								вам погрузиться в мир этой увлекательной игры. Кроме того, вы
								сможете скачать шаблоны документов, которые могут быть полезны
								при обучении, проведении турниров или организации шахматных
								мероприятий.
							</p>
							<BookMarked className="w-1/6 h-auto" />
						</CardContent>
					</Card>
				</div>
				<Separator className="mt-10 md:mt-16" />

				<div className="grid mt-8 gap-8 grid-cols-1 md:grid-cols-2 md:mt-24 md:mb-12">
					<div className="flex flex-col items-center gap-4">
						<Balance className="text-2xl text-center font-bold leading-tight tracking-tighter md:text-4xl lg:leading-[1.1]">
							Выпускная квалификационная работа бакалавра
						</Balance>
						<Balance
							className={cn(
								'max-w-[750px] text-center text-base text-muted-foreground whitespace-pre-line'
							)}
						>
							Данный проект был реализован в рамках выполнения выпускной
							квалификационной работы. Студент группы 0371 Копылов Кирилл
							Андреевич. Тема: Разработка информационной системы «Шахматы».
						</Balance>
					</div>
					<div className="flex flex-col items-center gap-4 mb-4">
						<Balance className="text-2xl text-center font-bold leading-tight tracking-tighter md:text-4xl lg:leading-[1.1] whitespace-pre-line">
							Университет{'\n'}
							СПбГЭТУ «ЛЭТИ»
						</Balance>
						<Balance
							className={cn(
								'max-w-[750px] text-center text-base text-muted-foreground whitespace-pre-line'
							)}
						>
							«Санкт-Петербургский государственный электротехнический
							университет «ЛЭТИ» им. В.И.Ульянова (Ленина)» (СПбГЭТУ «ЛЭТИ»).
							Направление 09.03.02 - Информационные системы и технологии.
							Профиль - Информационные системы и технологии в бизнесе. Факультет
							компьютерных технологий и информатики. Кафедра автоматики и
							процессов управления.
						</Balance>
					</div>
				</div>
			</div>
		</DefaultLayout>
	);
};

export default observer(HomePage);
