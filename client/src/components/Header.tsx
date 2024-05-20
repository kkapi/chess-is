import { Link } from 'react-router-dom';
import { Menu, Crown } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import { Button } from './ui/button';
import { ModeToggle } from './ModeToggle';
import {
	ANALYSIS_ROUTE,
	COMPUTER_ROUTE,
	FINDGAME_ROUTE,
	HOME_ROUTE,
	MATERIALS_ROUTE,
	NEWROOM_ROUTE,
	NEWS_ROUTE,
} from '@/lib/constants';
import { useContext } from 'react';
import { Context } from '@/main';

const Header = () => {
	const { store } = useContext(Context);

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
				<Link
					to={NEWS_ROUTE}
					className="text-muted-foreground transition-colors hover:text-foreground"
				>
					Новости
				</Link>
				<Link
					to={MATERIALS_ROUTE}
					className="text-muted-foreground transition-colors hover:text-foreground"
				>
					Материалы
				</Link>

        {store.isAuth && <div>{store?.user?.login}</div>}

				<ModeToggle />
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
							to={NEWS_ROUTE}
							className="text-muted-foreground hover:text-foreground"
						>
							Новости
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

export default Header;
