function ChampionInfo() {
  return (
    <section className=" w-full md:flex-1 flex-1 bg-red-800">
      <div className="w-full  bg-emerald-600">
        <div className="w-full bg-indigo-400 h-[600px]">
          챔피언 정보
          <div>갈리오 이미지 안에 택스트 넣기</div>
          <div>
            아스라한 빛의 도시 데마시아의 성문 밖, 거대한 석상 갈리오가 경계의
            눈을 늦추지 않고 서 있다. 마법사의 공격으로부터 데마시아를 수호하기
            위해 만들어진 갈리오는 강력한 마법의 힘이 그를 깨울 때까지 수십 년,
            때로는 수백 년 동안 한자리에 미동도 없이 서있다. 일단 깨어나면
            전투의 아찔한 스릴과 데마시아인들을 구한다는 자부심을 음미하며 1분
            1초도 허투루 쓰는 법이 없다. 그러나 그가 쟁취한 승리의 향기는 결코
            달콤하지만은 않다. 아이러니하게도 그가 물리친 마법의 힘이 그에게
            생명을 준 원천이기에 전쟁을 승리로 장식한 후에는 다시 깊은 잠으로
            빠져든다.
          </div>
        </div>
      </div>
      <div className="w-full h-[500px] lex gap-8 flex-col justify-center bg-emerald-600">
        <div className="flex gap-9 justify-center">
          <div className="w-20 h-20 bg-amber-300"></div>
          <div className="w-20 h-20 bg-amber-300"></div>
          <div className="w-20 h-20 bg-amber-300"></div>
          <div className="w-20 h-20 bg-amber-300"></div>
        </div>
        <div className="flex">
          <div className="flex w-1/2 h-[300px] bg-sky-500"></div>
          <div className="flex w-1/2 h-[300px] bg-sky-900"></div>
        </div>
      </div>
    </section>
  );
}

export default ChampionInfo;
