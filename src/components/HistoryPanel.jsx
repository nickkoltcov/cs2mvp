import { formatNumber } from '../stats'

function HistoryPanel({
  maps,
  matches,
  selectedMapId,
  activeMatch,
  onSelectMap,
  onSelectMatch,
}) {
  return (
    <section className="panel history-panel" aria-labelledby="history-title">
      <div className="panel-header">
        <div>
          <p className="eyebrow">Archive</p>
          <h2 id="history-title">История карт</h2>
        </div>

        <select
          aria-label="Фильтр истории"
          value={selectedMapId}
          onChange={(event) => onSelectMap(event.target.value)}
        >
          <option value="all">Все карты</option>
          {maps.map((map) => (
            <option key={map.id} value={map.id}>
              {map.name}
            </option>
          ))}
        </select>
      </div>

      {matches.length > 0 ? (
        <div className="history-gallery" role="list" aria-label="Сохраненные карты">
          {matches.map((match) => (
            <button
              className={`history-tile ${match.id === activeMatch?.id ? 'is-selected' : ''}`}
              key={match.id}
              type="button"
              onClick={() => onSelectMatch(match.id)}
            >
              <img src={match.mapImage} alt="" />
              <span>{match.playedAt}</span>
              <strong>{match.mapName}</strong>
              <small>
                <span className="mvp-star" aria-hidden="true">
                  *
                </span>
                {match.mvpName}
              </small>
            </button>
          ))}
        </div>
      ) : (
        <p className="empty-state">По выбранному фильтру пока нет сохраненных карт.</p>
      )}

      {activeMatch && (
        <article className="match-details">
          <img src={activeMatch.mapImage} alt="" />
          <div className="match-details__overlay">
            <span>{activeMatch.playedAt}</span>
            <strong>{activeMatch.mapName}</strong>
            <small>
              <span className="mvp-star" aria-hidden="true">
                *
              </span>
              {activeMatch.mvpName}, {activeMatch.mvpPoints} баллов
            </small>
          </div>

          <ol className="match-player-list">
            {activeMatch.players.map((player) => (
              <li key={`${activeMatch.id}-${player.id}`}>
                <strong>{player.name}</strong>
                <span>{player.kills}K</span>
                <span>{player.deaths}D</span>
                <span>{formatNumber(player.kd)} K/D</span>
                <span>{player.mvp} MVP</span>
                <b>{player.points}</b>
              </li>
            ))}
          </ol>
        </article>
      )}
    </section>
  )
}

export default HistoryPanel
