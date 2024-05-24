<div className="container border border-red-500 min-h-[760px] flex justify-center items-center">
	{isWating ? (
		'Ждем...'
	) : (
		<Button
			onClick={() => {
				socket.emit('findGame', {
					userId: store?.user?.id || store?.browserId,
					login: store?.user?.login || 'Аноним',
					time: 5,
					increment: 0,
				});
				setIsWating(true);
			}}
		>
			Find game
		</Button>
	)}
</div>;
