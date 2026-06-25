const emptyTotals = {
  maps: 0,
  kills: 0,
  deaths: 0,
  mvp: 0,
  points: 0,
}

export const toNumber = (value) => Number(value) || 0

export const getKd = (kills, deaths) => {
  const killsNumber = toNumber(kills)
  const deathsNumber = toNumber(deaths)

  if (deathsNumber === 0) {
    return killsNumber
  }

  return killsNumber / deathsNumber
}

export const calculatePoints = ({ kills, deaths, mvp }) =>
  Math.round(toNumber(kills) * 2 + getKd(kills, deaths) * 10 + toNumber(mvp) * 5)

export const formatNumber = (value) =>
  new Intl.NumberFormat('ru-RU', {
    maximumFractionDigits: 2,
  }).format(value)

export const buildMatchRows = (players) =>
  players.map((player) => ({
    ...player,
    killsTotal: toNumber(player.kills),
    deathsTotal: toNumber(player.deaths),
    mvpTotal: toNumber(player.mvp),
    kd: getKd(player.kills, player.deaths),
    points: calculatePoints(player),
  }))

export const getMatchMvp = (players) =>
  players.reduce((leader, player) =>
    player.points > leader.points ? player : leader,
  )

export const buildLeaderboard = (history, mapId = 'all') => {
  const totals = history
    .filter((match) => mapId === 'all' || match.mapId === mapId)
    .flatMap((match) => match.players || [])
    .reduce((acc, player) => {
      const name = player.name?.trim() || `Player ${player.id}`
      const currentStats = acc[name] || emptyTotals

      return {
        ...acc,
        [name]: {
          maps: currentStats.maps + 1,
          kills: currentStats.kills + toNumber(player.kills),
          deaths: currentStats.deaths + toNumber(player.deaths),
          mvp: currentStats.mvp + toNumber(player.mvp),
          points: currentStats.points + toNumber(player.points),
        },
      }
    }, {})

  return Object.entries(totals)
    .map(([name, stats]) => ({
      name,
      ...stats,
      kd: getKd(stats.kills, stats.deaths),
    }))
    .sort((a, b) => b.points - a.points)
}
