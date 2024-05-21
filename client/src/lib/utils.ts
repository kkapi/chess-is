import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function getRole(role: string) {
	if (role === 'ADMIN') return 'Администратор';
	if (role === 'MODERATOR') return 'Модератор';
	return 'Пользователь';
}
