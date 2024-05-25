export function getRusRole(role) {
  if (role === 'ADMIN') return 'Администратор'
  if (role === 'MODERATOR') return 'Модератор'
  return 'Пользователь'
}