import { RecoveryForm } from "@/components/RecoveryFrom"
import ResetPasswordForm from "@/components/ResetPasswordForm"
import DefaultLayout from "@/layouts/DefaultLayout"

const NewPasswordPage = () => {
  return (
    <div className="min-h-screen min-w-screen flex flex-col justify-between">
			<DefaultLayout>
				<ResetPasswordForm />
			</DefaultLayout>
		</div>
  )
}

export default NewPasswordPage