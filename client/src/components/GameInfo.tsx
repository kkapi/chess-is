
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './ui/card';
import { Separator } from './ui/separator';

const GameInfo = ({roomInfo, orientation}) => {
  return (
    <Card className="w-[350px] md:w-[400px] h-[200px] md:h-[500px] mt-9 md:mt-0">			
			{/* <CardContent>
        {orientation === 'black' ? JSON.stringify(roomInfo?.white) : JSON.stringify(roomInfo?.black)}
        <Separator className='mt-10' />
        {orientation === 'white' ? JSON.stringify(roomInfo?.white) : JSON.stringify(roomInfo?.black)}
        <Separator className='mt-10'/>
				{JSON.stringify(orientation)}
			</CardContent> */}
      <CardContent>
        <div>            
            <h3 className="text-lg font-semibold">Белые:</h3>
            {roomInfo?.white ? (
                <div>
                    <p>Идентификатор пользователя: {roomInfo?.white?.userId}</p>
                    <p>Логин: {roomInfo?.white?.login}</p>
                </div>
            ) : (
                <p>Ожидание присоединения белых...</p>
            )}
            <Separator className='mt-4' />
            <h3 className="text-lg font-semibold">Черные:</h3>
            {roomInfo?.black ? (
                <div>
                    <p>Идентификатор пользователя: {roomInfo.black.userId}</p>
                    <p>Логин: {roomInfo.black.login}</p>
                </div>
            ) : (
                <p>Ожидание присоединения черных...</p>
            )}
            <Separator className='mt-4' />
            <p>Игра начата: {roomInfo?.started ? 'Да' : 'Нет'}</p>
            <p>PGN: {roomInfo.pgn}</p>
            <p>Время: {roomInfo.time} мс</p>
            <p>Белые подключены: {roomInfo.whiteConnected ? 'Да' : 'Нет'}</p>
            <p>Черные подключены: {roomInfo.blackConnected ? 'Да' : 'Нет'}</p>
            <p>Количество подключений белых: {roomInfo.countConnectedWhite}</p>
            <p>Количество подключений черных: {roomInfo.countConnectedBlack}</p>
            <p>Приватная игра: {roomInfo.private ? 'Да' : 'Нет'}</p>
        </div>
    </CardContent>
			<CardFooter>
				
			</CardFooter>
		</Card>
  )
}

export default GameInfo