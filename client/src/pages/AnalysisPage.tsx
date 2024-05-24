import { AnalysisBoard } from '@/components/AnalysisBoard'
import DefaultLayout from '@/layouts/DefaultLayout'

const AnalysisPage = () => {
  return (
    <div className="min-h-screen min-w-screen flex flex-col justify-between">
			<DefaultLayout>
      <div className='container flex justify-center items-center min-h-[80vh]'>
          <AnalysisBoard />
        </div>
			</DefaultLayout>
		</div>
  )
}

export default AnalysisPage