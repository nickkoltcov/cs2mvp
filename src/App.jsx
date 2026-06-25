import { useMemo, useState } from 'react'
import HistoryPanel from './components/HistoryPanel'
import Leaderboard from './components/Leaderboard'
import MapPicker from './components/MapPicker'
import MatchForm from './components/MatchForm'
import { getMapById, maps } from './maps'
import { buildLeaderboard, buildMatchRows, getMatchMvp } from './stats'
import './App.css'

const STORAGE_KEY = 'cs2-mvp-tracker'

const defaultPlayers = [
  { id: 1, name: 'Player 1', kills: '', deaths: '', mvp: '' },
  { id: 2, name: 'Player 2', kills: '', deaths: '', mvp: '' },
  { id: 3, name: 'Player 3', kills: '', deaths: '', mvp: '' },
  { id: 4, name: 'Player 4', kills: '', deaths: '', mvp: '' },
  { id: 5, name: 'Player 5', kills: '', deaths: '', mvp: '' },
]

const tabs = [
  ['match', 'Ввод'],
  ['rating', 'Итоги'],
  ['maps', 'Карты'],
  ['history', 'История'],
]

const normalizePlayers = (players) =>
  players.map((player, index) => ({
    id: player.id || index + 1,
    name: player.name || `Player ${index + 1}`,
    kills: player.kills ? player.kills : '',
    deaths: player.deaths ? player.deaths : '',
    mvp: player.mvp ? player.mvp : '',
  }))

const normalizeHistory = (history) =>
  history
    .filter((match) => maps.some((map) => map.id === match.mapId))
    .map((match) => {
      const map = getMapById(match.mapId)

      return {
        ...match,
        mapName: map.name,
        mapImage: map.image,
        players: (match.players || []).map((player) => ({
          ...player,
          kd:
            player.kd ??
            (player.deaths === 0 ? player.kills : player.kills / player.deaths),
        })),
      }
    })

const readSavedState = () => {
  const savedState = localStorage.getItem(STORAGE_KEY)

  if (!savedState) {
    return {
      players: defaultPlayers,
      history: [],
      selectedMapId: maps[0].id,
    }
  }

  try {
    const parsedState = JSON.parse(savedState)
    const selectedMapExists = maps.some(
      (map) => map.id === parsedState.selectedMapId,
    )

    return {
      players:
        parsedState.players?.length === 5
          ? normalizePlayers(parsedState.players)
          : defaultPlayers,
      history: normalizeHistory(parsedState.history || []),
      selectedMapId: selectedMapExists ? parsedState.selectedMapId : maps[0].id,
    }
  } catch {
    return {
      players: defaultPlayers,
      history: [],
      selectedMapId: maps[0].id,
    }
  }
}

const saveState = (nextState) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(nextState))
}

function App() {
  const [savedData, setSavedData] = useState(readSavedState)
  const [players, setPlayers] = useState(savedData.players)
  const [selectedMapId, setSelectedMapId] = useState(savedData.selectedMapId)
  const [ratingScope, setRatingScope] = useState('all')
  const [historyMapId, setHistoryMapId] = useState('all')
  const [activeMatchId, setActiveMatchId] = useState(null)
  const [activeView, setActiveView] = useState('match')

  const selectedMap = getMapById(selectedMapId)
  const matchRows = useMemo(() => buildMatchRows(players), [players])
  const matchMvp = useMemo(() => getMatchMvp(matchRows), [matchRows])
  const ratingRows = useMemo(
    () => buildLeaderboard(savedData.history, ratingScope),
    [ratingScope, savedData.history],
  )
  const filteredHistory = useMemo(
    () =>
      historyMapId === 'all'
        ? savedData.history
        : savedData.history.filter((match) => match.mapId === historyMapId),
    [historyMapId, savedData.history],
  )
  const activeMatch = useMemo(
    () => filteredHistory.find((match) => match.id === activeMatchId) || null,
    [activeMatchId, filteredHistory],
  )

  const persistState = (nextState) => {
    setSavedData(nextState)
    saveState(nextState)
  }

  const updatePlayer = (id, field, value) => {
    setPlayers((currentPlayers) =>
      currentPlayers.map((player) => {
        if (player.id !== id) {
          return player
        }

        const nextValue =
          field === 'name' ? value : value === '' ? '' : Math.max(0, Number(value))

        return { ...player, [field]: nextValue }
      }),
    )
  }

  const selectMap = (mapId) => {
    setSelectedMapId(mapId)
    persistState({ ...savedData, selectedMapId: mapId, players })
  }

  const saveNicknames = () => {
    persistState({ ...savedData, selectedMapId, players })
  }

  const saveMatch = () => {
    const playedAt = new Date().toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
    const matchPlayers = matchRows.map((player) => ({
      id: player.id,
      name: player.name.trim() || `Player ${player.id}`,
      kills: player.killsTotal,
      deaths: player.deathsTotal,
      mvp: player.mvpTotal,
      kd: player.kd,
      points: player.points,
    }))
    const nextMatch = {
      id: crypto.randomUUID(),
      mapId: selectedMap.id,
      mapName: selectedMap.name,
      mapImage: selectedMap.image,
      playedAt,
      mvpName: matchMvp.name || 'Без имени',
      mvpPoints: matchMvp.points,
      players: matchPlayers,
    }
    const nextPlayers = players.map((player) => ({
      ...player,
      name: player.name.trim() || `Player ${player.id}`,
      kills: '',
      deaths: '',
      mvp: '',
    }))
    const nextState = {
      players: nextPlayers,
      history: [nextMatch, ...savedData.history].slice(0, 60),
      selectedMapId,
    }

    setPlayers(nextPlayers)
    setRatingScope(selectedMap.id)
    setHistoryMapId(selectedMap.id)
    setActiveMatchId(nextMatch.id)
    setActiveView('rating')
    persistState(nextState)
  }

  const resetCurrentMatch = () => {
    const nextPlayers = players.map((player) => ({
      ...player,
      kills: '',
      deaths: '',
      mvp: '',
    }))

    setPlayers(nextPlayers)
    persistState({ ...savedData, selectedMapId, players: nextPlayers })
  }

  const clearAll = () => {
    if (!window.confirm('Удалить всю историю и накопленную статистику?')) {
      return
    }

    const nextState = {
      players: defaultPlayers,
      history: [],
      selectedMapId: maps[0].id,
    }

    setPlayers(defaultPlayers)
    setSelectedMapId(maps[0].id)
    setRatingScope('all')
    setHistoryMapId('all')
    setActiveMatchId(null)
    setActiveView('match')
    persistState(nextState)
  }

  return (
    <main className="app-shell">
      <section className="hero-section" aria-labelledby="app-title">
        <div>
          <p className="eyebrow">CS2 Squad Tracker</p>
          <h1 id="app-title">Статистика команды после каждой карты</h1>
          <p>
            Выбираешь карту, вводишь итоговые kills, deaths и MVP-звезды,
            приложение считает баллы и сохраняет форму игроков по картам.
          </p>
        </div>

        <dl className="summary-strip">
          <div>
            <dt>Карт</dt>
            <dd>{savedData.history.length}</dd>
          </div>
          <div>
            <dt>Игроков</dt>
            <dd>5</dd>
          </div>
          <div>
            <dt>Формула</dt>
            <dd>K x2 + K/D x10 + MVP x5</dd>
          </div>
        </dl>
      </section>

      <nav className="mobile-tabs" aria-label="Разделы приложения">
        {tabs.map(([view, label]) => (
          <button
            className={activeView === view ? 'is-active' : ''}
            key={view}
            type="button"
            onClick={() => setActiveView(view)}
          >
            {label}
          </button>
        ))}
      </nav>

      <section className="spa-workspace">
        <div className={`view-panel ${activeView === 'match' ? 'is-active' : ''}`}>
          <MatchForm
            maps={maps}
            selectedMap={selectedMap}
            players={matchRows}
            matchMvp={matchMvp}
            onSelectMap={selectMap}
            onUpdatePlayer={updatePlayer}
            onSaveNicknames={saveNicknames}
            onSaveMatch={saveMatch}
            onResetMatch={resetCurrentMatch}
            onClearAll={clearAll}
          />
        </div>

        <div className={`view-panel ${activeView === 'rating' ? 'is-active' : ''}`}>
          <Leaderboard
            maps={maps}
            rows={ratingRows}
            selectedScope={ratingScope}
            onSelectScope={setRatingScope}
          />
        </div>

        <div className={`view-panel ${activeView === 'maps' ? 'is-active' : ''}`}>
          <MapPicker maps={maps} selectedMap={selectedMap} onSelectMap={selectMap} />
        </div>

        <div className={`view-panel ${activeView === 'history' ? 'is-active' : ''}`}>
          <HistoryPanel
            maps={maps}
            matches={filteredHistory}
            selectedMapId={historyMapId}
            activeMatch={activeMatch}
            onSelectMap={(mapId) => {
              setHistoryMapId(mapId)
              setActiveMatchId(null)
            }}
            onSelectMatch={setActiveMatchId}
          />
        </div>
      </section>
    </main>
  )
}

export default App
