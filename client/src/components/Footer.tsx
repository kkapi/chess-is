const Footer = () => {
	return (
		<footer className="py-6 md:px-8 md:py-0">
			<div className="container flex items-center justify-center gap-4 md:h-24">
				<p className="text-balance text-center text-sm leading-loose text-muted-foreground md:text-left">
					Разработано
					<a
						href={'https://github.com/kkapi'}
						target="_blank"
						rel="noreferrer"
						className="font-medium underline underline-offset-4"
					>
						{' '}
						kkapi{' '}
					</a>				
					
					. Исходный код доступен на{' '}
					<a
						href={'https://github.com/kkapi/'}
						target="_blank"
						rel="noreferrer"
						className="font-medium underline underline-offset-4"
					>
						GitHub
					</a>
					.
				</p>
			</div>
		</footer>
	);
};

export default Footer;