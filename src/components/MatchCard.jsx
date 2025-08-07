function MatchCard({ title, subtitle, imageSrc, Icon, color }) {
  return (
    <div className="flex justify-center">
      <div className=" relative w-[380px] h-[240px] overflow-hidden rounded-4xl flex">
        <div
          className={`absolute left-[-16px] top-0 w-1/2 h-full -skew-x-10 origin-left bg-gradient-to-t ${color} z-10`}
        ></div>
        <img
          src={imageSrc}
          alt={title}
          className="absolute right-0 top-0 w-3/5 h-full object-cover"
        />
        <div className=" absolute w-1/3 h-[180px] flex flex-col justify-center items-center left-6 top-8 z-10 text-white p-2">
          <h1 className=" flex flex-2/5 items-center font-extrabold text-4xl tracking-widest">
            {title}
          </h1>
          <div className="flex flex-1/5 justify-end w-full">
            <p className=" font-light text-sm">{subtitle}</p>
          </div>
          <div className="flex flex-3/5 justify-end items-end ">
            {Icon && <Icon className="w-[70px] h-[70px]" />}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MatchCard;
