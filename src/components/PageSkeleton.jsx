export default function PageSkeleton() {
  return (
    <main className="w-full">
      <div className="mx-auto max-w-4xl px-4 md:px-6 py-8 md:py-12">
        <header className="mb-8 space-y-2">
          <div className="h-7 w-40 bg-[#3a3a3a] rounded-md animate-pulse" />
          <div className="h-4 w-60 bg-[#333] rounded-md animate-pulse" />
        </header>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {[0, 1].map((i) => (
            <div
              key={i}
              className="bg-[#2f2f2f] border border-[#575757] rounded-3xl p-6 md:p-8 space-y-4"
            >
              <div className="h-5 w-24 bg-[#3a3a3a] rounded-md animate-pulse" />
              <div className="h-10 w-full bg-[#3a3a3a] rounded-xl animate-pulse" />
              <div className="h-10 w-full bg-[#3a3a3a] rounded-xl animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
