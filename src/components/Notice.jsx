const NoticeBox = ({ title }) => {
  return (
    <div className="w-3/7">
      <div className="flex justify-between items-center p-3">
        <h1 className="font-bold text-white">{title}</h1>
        <p className="text-sm font-medium text-white"> 더보기 {'>'}</p>
      </div>
      <div className="flex w-full h-full border-2 border-stone-500 rounded-2xl"></div>
    </div>
  );
};

function Notice() {
  return (
    <div className="flex justify-between w-4/5 h-[150px] flex-wrap ">
      <NoticeBox title={'라이엇 공지사항'} />
      <NoticeBox title={'LOL99 공지사항'} />
    </div>
  );
}

export default Notice;
