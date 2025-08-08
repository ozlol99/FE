import { useEffect } from 'react';
import UserProfile from '../components/UserProfile';

function MatchHistorych() {
  // const { userId } = useParams();
  // const [name, tag] = userId.split('-');

  const name = '동근';
  const tag = '123';

  useEffect(() => {
    // axios로 나중에 api 호출할 자리
    console.log(`${name}#${tag}`);
  }, []);

  return (
    <div>
      <UserProfile />
    </div>
  );
}
export default MatchHistorych;
