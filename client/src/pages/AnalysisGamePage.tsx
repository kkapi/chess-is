import { AnalysisGameBoard } from '@/components/AnalysisGameBoard';
import DefaultLayout from '@/layouts/DefaultLayout';

const AnalysisGamePage = () => {
	return (
		<div className="min-h-screen min-w-screen flex flex-col justify-between">
			<DefaultLayout>
				<div className="container flex justify-center items-center min-h-[80vh]">
					<AnalysisGameBoard />
				</div>
			</DefaultLayout>
		</div>
	);
};

export default AnalysisGamePage;
