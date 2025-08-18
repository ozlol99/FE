import { useCallback, useEffect, useRef, useState } from 'react';
import { fetchChampionDetail } from '../api/champions';
import { passiveIconUrl, spellIconUrl } from '../data/ddragonUrls';
import SkinCarousel from './SkinCarousel';

const STATUS = {
  IDLE: 'idle',
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error',
};

function ChampionInfo({ championId }) {
  const [detail, setDetail] = useState(null);
  const [status, setStatus] = useState(STATUS.IDLE);
  const [skinIndex, setSkinIndex] = useState(0);
  const topRef = useRef(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    return () => {
      isMountedRef.current = false; // 언마운트시 false
    };
  }, []);

  const loadDetail = useCallback(async () => {
    if (!championId) {
      setDetail(null);
      setStatus(STATUS.IDLE);
      return;
    }
    if (status === STATUS.SUCCESS && detail?.id === championId) return;
    setStatus(STATUS.LOADING);
    try {
      const data = await fetchChampionDetail(championId);
      if (!isMountedRef.current) return;

      setDetail(data);
      setSkinIndex(0);
      setStatus(STATUS.SUCCESS);
    } catch (error) {
      console.error(error);
      if (!isMountedRef.current) return;
      setStatus(STATUS.ERROR);
    }
  }, [championId]);
  useEffect(() => {
    loadDetail();
  }, [loadDetail]);

  // 스크롤 이벤트
  useEffect(() => {
    if (status === STATUS.SUCCESS && topRef.current) {
      topRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest',
      });
    }
  }, [status]);

  const {
    id,
    name,
    lore = '',
    skins = [],
    passive,
    spells = [],
  } = detail ?? {};

  if (!championId) {
    return (
      <section className="flex-1 p-6 text-center text-gray-400">
        챔피언을 선택해 주세요.
      </section>
    );
  }

  if (status === STATUS.LOADING) {
    return (
      <section className="flex-1 p-6">
        <div className="h-screen rounded-xl bg-white/10 animate-pulse"></div>
      </section>
    );
  }

  if (status === STATUS.ERROR) {
    return (
      <section className="flex-1 p-6 text-center">
        <div className="text-rose-300 mb-3">데이터를 불러오지 못했습니다.</div>
        <button
          className="px-3 py-2 rounded bg-teal-600 text-white"
          onClick={loadDetail}
        >
          다시 시도
        </button>
      </section>
    );
  }

  return (
    <section ref={topRef} className="flex-1 p-6 text-white">
      <SkinCarousel
        id={id}
        skins={skins}
        name={name}
        lore={lore}
        skinIndex={skinIndex}
        onChangeIndex={setSkinIndex}
      />
      <SkillList passive={passive} spells={spells} />
    </section>
  );
}

function SkillList({ spells, passive }) {
  return (
    <div className="flex flex-col gap-4 mt-6 w-full">
      {/* Passive */}
      {passive && (
        <div className="flex items-center gap-4 p-4 w-full rounded-lg bg-white/10">
          <img
            src={passiveIconUrl(passive.image.full)}
            alt={passive.name}
            className="w-12 h-12 rounded"
          />
          <div>
            <h3 className="font-bold text-white">
              기본 지속 효과 - {passive.name}
            </h3>
            <p className="text-sm text-gray-300">
              {clean(passive.description)}
            </p>
          </div>
        </div>
      )}
      {spells.map((spell, i) => (
        <div
          key={spell.id}
          className="flex items-center gap-4 p-4 w-full rounded-lg bg-white/10"
        >
          <img
            src={spellIconUrl(spell.image.full)}
            alt={spell.name}
            className="w-12 h-12 rounded"
          />
          <div>
            <h3 className="font-bold text-white">
              {['Q', 'W', 'E', 'R'][i]} - {spell.name}
            </h3>
            <p className="text-sm text-gray-300">{clean(spell.description)}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
// 설명글 긁어올떄 html 태그 포함되어 있어서 제거
function clean(html) {
  if (!html) return '';
  return String(html)
    .replace(/<\/?br\s*\/?>/gi, '\n') // <br> → 개행
    .replace(/<\/?i>/gi, '') // <i> ~ </i> 제거 (옵션)
    .replace(/<\/?font[^>]*>/gi, ''); // <font> 제거 (옵션)
}
export default ChampionInfo;
