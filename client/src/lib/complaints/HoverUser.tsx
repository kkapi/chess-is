import {
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
} from '@/components/ui/hover-card';
import { UserInfo } from './columns';
import { StatusBadge, getRusRole } from '../users-1/columns';
import { useNavigate } from 'react-router-dom';

const HoverUser = ({ user }: { user: UserInfo }) => {
  const navigate = useNavigate();
	return (
		<HoverCard openDelay={200}>
			<HoverCardTrigger className="cursor-pointer hover:underline" onClick={() => {
        navigate(`/profile/${user.id}`)
      }}>
				{user.login}
			</HoverCardTrigger>
			<HoverCardContent>
				<div className="flex flex-col text-sm">
					<div>ID: {user.id}</div>
					<div>Логин: {user.login}</div>
					<div>Почта: {user.email}</div>
					<div className="font-medium">Роль: {getRusRole(user.role)}</div>
				</div>
			</HoverCardContent>
		</HoverCard>
	);
};

export default HoverUser;
