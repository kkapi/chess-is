import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LOGIN_ROUTE } from '@/lib/constants';
import { Link } from 'react-router-dom';

export function RegistrationForm() {
	return (
		<Card className="mx-auto max-w-sm">
			<CardHeader>
				<CardTitle className="text-xl">Регистрация</CardTitle>
				<CardDescription>
					<span className='block'>Введите информацию для регистрации аккаунта.</span>
          <span className='block mt-3'>После заполнения формы на указанную почту придет письмо с инструкцией по активации аккаунта.</span>
				</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="grid gap-4">
					<div className="grid gap-2">
						<Label htmlFor="first-name">Логин</Label>
						<Input id="first-name" placeholder="Придумайте уникальный логин" required />
					</div>

					<div className="grid gap-2">
						<Label htmlFor="email">Почта</Label>
						<Input
							id="email"
							type="email"
							placeholder="email@example.com"
							required
						/>
					</div>
					<div className="grid gap-2">
						<Label htmlFor="password">Пароль</Label>
						<Input id="password" type="password" placeholder='Придумайте надежный пароль'/>
					</div>
					<div className="grid gap-2">
						<Label htmlFor="passwordConfirm">Подтверждение пароля</Label>
						<Input id="passwordConfirm" type="password" placeholder='Подтвердите пароль'/>
					</div>
					<Button type="submit" className="w-full">
						Создать аккаунт
					</Button>
				</div>
				<div className="mt-4 text-center text-sm">
					Уже есть аккаунт?{' '}
					<Link to={LOGIN_ROUTE} className="underline">
						Войти
					</Link>
				</div>
			</CardContent>
		</Card>
	);
}
