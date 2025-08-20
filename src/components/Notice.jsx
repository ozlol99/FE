const NoticeBox = ({ title, link }) => {
  return (
    <div className="basis-[48%] min-w-[420px] max-w-[560px] flex-shrink-0">
      <div className="flex justify-between items-center p-3">
        <h1 className="font-bold text-white">{title}</h1>
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline text-white text-sm"
        >
          더보기 {'>'}
        </a>
      </div>
      <div className="flex w-full h-full border-2 border-stone-500 rounded-2xl"></div>
    </div>
  );
};

function Notice() {
  return (
    <div className="flex justify-between w-4/5 h-[150px]">
      <NoticeBox
        title={'라이엇 공지사항'}
        link={'https://www.leagueoflegends.com/ko-kr/news/tags/patch-notes/'}
      />
      <NoticeBox title={'LOL99 공지사항'} link={''} />
    </div>
  );
}

export default Notice;
