import { formatNumber } from '../stats'

function Leaderboard({ maps, rows, selectedScope, onSelectScope }) {
  const selectedMapName = maps.find((map) => map.id === selectedScope)?.name
  const title = selectedScope === 'all' ? 'Общий рейтинг' : `Рейтинг на ${selectedMapName}`

  return (
    <section className="panel leaderboard-panel" aria-labelledby="leaderboard-title">
      <div className="panel-header leaderboard-header">
        <div>
          <p className="eyebrow">Performance</p>
          <h2 id="leaderboard-title">{title}</h2>
        </div>

        <select
          aria-label="Переключить рейтинг"
          value={selectedScope}
          onChange={(event) => onSelectScope(event.target.value)}
        >
          <option value="all">Все карты</option>
          {maps.map((map) => (
            <option key={map.id} value={map.id}>
              {map.name}
            </option>
          ))}
        </select>
      </div>

      {rows.length > 0 ? (
        <ol className="leaderboard-list">
          {rows.map((player, index) => (
            <li className="leaderboard-card" key={player.name}>
              <div className="leaderboard-card__main">
                <span className="place">{index + 1}</span>
                <strong>{player.name}</strong>
              </div>

              <dl className="metric-grid">
                <div>
                  <dt>Карт</dt>
                  <dd>{player.maps}</dd>
                </div>
                <div>
                  <dt>Kills</dt>
                  <dd>{player.kills}</dd>
                </div>
                <div>
                  <dt>Deaths</dt>
                  <dd>{player.deaths}</dd>
                </div>
                <div>
                  <dt>K/D</dt>
                  <dd>{formatNumber(player.kd)}</dd>
                </div>
                <div>
                  <dt>MVP</dt>
                  <dd>{player.mvp}</dd>
                </div>
                <div className="metric-grid__score">
                  <dt>Баллы</dt>
                  <dd className="points-value">{player.points}</dd>
                </div>
              </dl>
            </li>
          ))}
        </ol>
      ) : (
        <p className="empty-state">Сохрани первую карту, и здесь появится рейтинг.</p>
      )}
    </section>
  )
}

export default Leaderboard
