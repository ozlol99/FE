import { Plus, Trash2 } from 'lucide-react';
import AddRiotModal from './AddRiotModal';
import useRiotAccounts from '../hooks/useRiotAccounts';

function EmptyState({ text }) {
  return (
    <div className="rounded-2xl border border-dashed border-[#5b5b5b] p-6 text-center">
      <p className="text-sm text-[#bdbdbd]">{text}</p>
    </div>
  );
}

export default function RiotAccountsCard({ user, setUser }) {
  const { addOne, removeOne, isAddOpen, setAddOpen } = useRiotAccounts({
    user,
    setUser,
  });
  const riotList = user?.riot_accounts ?? [];

  return (
    <section className="bg-[#2f2f2f] border border-[#575757] rounded-3xl p-6 md:p-8 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base text-[#a7a7a7]">연결된 계정</h2>
          <h3 className="text-xl text-white font-semibold mt-1">
            라이엇 게임즈
          </h3>
        </div>
        <button
          type="button"
          onClick={() => setAddOpen(true)}
          aria-label="라이엇 계정 추가"
          className="inline-flex items-center gap-2 px-3 py-2 rounded-2xl border border-[#45e0c4]/40 hover:border-[#45e0c4] bg-[#353535] hover:bg-[#3b3b3b] transition"
        >
          <Plus className="w-4 h-4 text-white" /> 추가
        </button>
      </div>

      {riotList.length === 0 ? (
        <EmptyState text="연결된 라이엇 계정이 없습니다." />
      ) : (
        <ul className="divide-y divide-[#4a4a4a]">
          {riotList.map((acct) => (
            <li
              key={acct.id}
              className="flex items-center justify-between py-3"
            >
              <div className="min-w-0">
                <p className="font-medium truncate">
                  {acct.game_name}#{acct.tag_line}
                </p>
                {acct.region && (
                  <p className="text-xs text-[#a7a7a7] mt-0.5">{acct.region}</p>
                )}
              </div>
              <button
                type="button"
                onClick={() => removeOne(acct.id)}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#3A3A3A] border border-[#5b5b5b] hover:bg-[#454545] text-[#eee]"
              >
                <Trash2 className="w-4 h-4" /> 삭제
              </button>
            </li>
          ))}
        </ul>
      )}

      {isAddOpen && (
        <AddRiotModal onClose={() => setAddOpen(false)} onSubmit={addOne} />
      )}
    </section>
  );
}
