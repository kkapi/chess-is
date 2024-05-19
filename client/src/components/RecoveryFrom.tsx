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

export function RecoveryForm() {
	return (
		<Card className="mx-auto max-w-sm">
			<CardHeader>
				<CardTitle className="text-xl">Восстановление пароля</CardTitle>
				<CardDescription>
					<span className='block'>Укажите почту, на которую зарегистрирован аккаунт</span>
          <span className='block mt-3'>После заполнения формы на указанную почту придет письмо с инструкцией по восстановлению пароля.</span>
				</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="grid gap-4">
					

					<div className="grid gap-2">
						<Label htmlFor="email">Почта</Label>
						<Input
							id="email"
							type="email"
							placeholder="email@example.com"
							required
						/>
					</div>
					
					<Button type="submit" className="w-full">
						Отправить письмо
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
