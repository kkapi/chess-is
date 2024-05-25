import { PlayVsComputer } from '@/components/PlayVsComputer';

import DefaultLayout from '@/layouts/DefaultLayout';

const ComputerGamePage = () => {
	return (
		<div className="min-h-screen min-w-screen flex flex-col justify-between">
			<DefaultLayout>
				<div className="container flex justify-center items-center min-h-[80vh] gap-5 ">					
					<PlayVsComputer />
				</div>
			</DefaultLayout>
		</div>
	);
};

export default ComputerGamePage;
