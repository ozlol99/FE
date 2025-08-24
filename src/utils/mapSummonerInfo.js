mapSummonerInfo.jsx;

export function mapSummonerInfo(api) {
  const s = api['(1) summoner_info'] || {};
  const r = api['(2) rank_info'] || {};
  const h = api['(3) highest_rank'] || {};
  const summary = api['(4) match_summary'] || {};
  const matches = api['(5) recent_matches'] || [];

  return {
    profile: {
      puuid: s.puuid ?? '',
      summonerLevel: s.summonerLevel ?? 0,
      profileIconId: s.profileIconId ?? 0,
      name: s.summoner_name || h.summoner_name || '',
      tag: h.tag_line || '',
    },
    ranks: {
      solo: r.solo_rank || null,
      flex: r.flex_rank || null,
    },
    highest: {
      soloTier: h.highest_solo_tier || 'UNRANKED',
      soloRank: h.highest_solo_rank || '',
      soloLp: h.highest_solo_lp ?? 0,
      flexTier: h.highest_flex_tier || 'UNRANKED',
      flexRank: h.highest_flex_rank || '',
      flexLp: h.highest_flex_lp ?? 0,
      updatedAt: h.updated_at || '',
    },
    summary: {
      total: summary['총 매치 수'] ?? 0,
      wins: summary['승리 수'] ?? 0,
      losses: summary['패배 수'] ?? 0,
      winRateText: summary['승률'] || '0%',
      avgKdaText: summary['평균 KDA'] || '',
      mainPosition: summary['주 포지션'] || '',
      byPosition: summary['포지션별 플레이 횟수'] || {},
      byChampion: summary['챔피언별 플레이 횟수'] || {},
    },
    matches: matches.map((m) => ({
      id: m.match_id,
      name: m.summoner_name,
      rankType: m.rank_type,
      win: m.win,
      endAtText: m.game_end_timestamp,
      durationText: m.play_duration,
      kda: m.kda,
      runes: m.runes,
      spells: m.spells,
      items: m.items,
      teamList: m.teammates_and_opponents,
      champion: m.champion_name,
      position: m.position,
    })),
  };
}
