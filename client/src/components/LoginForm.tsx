
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RECOVERY_ROUTE, REGISTRATION_ROUTE } from "@/lib/constants"
import { Link } from "react-router-dom"

export function LoginForm() {
  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-xl">Вход</CardTitle>
        <CardDescription>
          Введите ваш логин и пароль
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="login">Логин</Label>
            <Input
              id="login"
              type="text"
              placeholder="Введите логин..."
              required
            />
          </div>
          <div className="grid gap-2">
            <div className="flex items-center">
              <Label htmlFor="password">Пароль</Label>
              <Link to={RECOVERY_ROUTE} className="ml-auto inline-block text-sm underline">
                Забыли пароль?
              </Link>
            </div>
            <Input id="password" type="password" required placeholder="Введите пароль..."/>
          </div>
          <Button type="submit" className="w-full">
            Войти
          </Button>
        </div>
        <div className="mt-4 text-center text-sm">
          Нет аккаунта?{" "}
          <Link to={REGISTRATION_ROUTE} className="underline">
            Зарегистрироваться
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}