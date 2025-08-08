import { useEffect } from 'react';

function MatchHistorych() {
  // const { userId } = useParams();
  // const [name, tag] = userId.split('-');

  const name = '동근';
  const tag = '123';

  useEffect(() => {
    // axios로 나중에 api 호출할 자리
    console.log(`${name}#${tag}`);
  }, []);

  return <>히스토리 페이지 입니다.</>;
}
export default MatchHistorych;
