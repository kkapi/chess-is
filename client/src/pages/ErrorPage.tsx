import DefaultLayout from "@/layouts/DefaultLayout"
import { HOME_ROUTE } from "@/lib/constants"
import { Link } from "react-router-dom"

const ErrorPage = () => {
  return (
    <DefaultLayout>
				<section className="flex items-center h-[84vh] md:h-[79vh] p-16 bg-background">
					<div className="container flex flex-col items-center justify-center px-5 mx-auto my-8">
						<div className="max-w-md text-center">
							<h2 className="mb-8 font-extrabold text-5xl text-foreground">
								404
							</h2>
							<p className="text-2xl font-semibold md:text-3xl">Данной страницы не существует</p>
							<p className="mt-4 mb-8 text-muted-foreground">
								Не переживайте, вы можете найти множество других вещей на нашей
								главной странице.
							</p>
							<Link
								to={HOME_ROUTE}
								className="px-8 py-3 font-semibold rounded text-foreground"
							>
								Вернуться на главную
							</Link>
						</div>
					</div>
				</section>
			</DefaultLayout>
  )
}

export default ErrorPage