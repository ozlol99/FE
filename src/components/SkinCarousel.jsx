import { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import {
  Navigation,
  Pagination,
  Keyboard,
  Mousewheel,
  Thumbs,
} from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/thumbs';
import { loadingUrl, splashUrl } from '../data/ddragonUrls';

export default function SkinCarousel({
  id,
  skins,
  name,
  lore,
  skinIndex = 0,
  onChangeIndex,
}) {
  const [thumbs, setThumbs] = useState(null);
  return (
    <div className="w-full">
      <Swiper
        modules={[Navigation, Pagination, Keyboard, Mousewheel, Thumbs]}
        navigation
        pagination={{ clickable: true }}
        keyboard={{ enabled: true }}
        mousewheel={{ forceToAxis: true }}
        thumbs={{ swiper: thumbs }}
        initialSlide={skinIndex}
        onSlideChange={(s) => onChangeIndex?.(s.activeIndex)}
        className="rounded-xl overflow-hidden"
        style={{ height: 700 }}
      >
        {skins.map((s, i) => {
          const isBase = s.num === 0; // 기본 스킨 판별
          return (
            <SwiperSlide key={s.id}>
              <img
                src={splashUrl(id, s.num)}
                alt={s.name || 'skin'}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/30" />

              {isBase ? (
                <>
                  <div className="absolute top-8 left-8 right-8 text-white">
                    <div className="flex items-end justify-between gap-4">
                      <div className="text-5xl md:text-6xl font-extrabold leading-none">
                        {name}
                      </div>
                      <div className="text-xl md:text-2xl font-semibold opacity-90">
                        {id}
                      </div>
                    </div>
                  </div>

                  <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                    <div className="bg-gradient-to-t from-black/70 to-transparent absolute inset-x-0 -top-24 bottom-0 pointer-events-none" />
                    <p className="relative text-sm md:text-base leading-relaxed opacity-90 whitespace-pre-line max-w-[900px]">
                      {lore}
                    </p>
                  </div>
                </>
              ) : (
                //  기본 스킨이 아닐 때: 하단에 스킨 이름만
                <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                  <div className="bg-gradient-to-t from-black/70 to-transparent absolute inset-x-0 -top-16 bottom-0 pointer-events-none" />
                  <div className="relative text-sm md:text-base opacity-90">
                    {s.name || `스킨 ${i + 1}`}
                  </div>
                </div>
              )}
            </SwiperSlide>
          );
        })}
      </Swiper>

      {/* 스킨리스트 */}
      <Swiper
        onSwiper={setThumbs}
        modules={[Thumbs]}
        slidesPerView={6}
        spaceBetween={8}
        watchSlidesProgress
        className="mt-3"
      >
        {skins.map((s) => (
          <SwiperSlide key={`thumb-${s.id}`}>
            <div className="aspect-[3/4] rounded-md overflow-hidden border border-white/10">
              <img
                src={loadingUrl(id, s.num)}
                alt={s.name || 'thumb'}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
