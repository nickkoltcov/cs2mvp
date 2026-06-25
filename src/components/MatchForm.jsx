import { formatNumber } from '../stats'

const fields = [
  { key: 'kills', label: 'Kills' },
  { key: 'deaths', label: 'Deaths' },
  { key: 'mvp', label: 'MVP', icon: '*' },
]

function MatchForm({
  maps,
  selectedMap,
  players,
  matchMvp,
  onSelectMap,
  onUpdatePlayer,
  onSaveNicknames,
  onSaveMatch,
  onResetMatch,
  onClearAll,
}) {
  return (
    <section className="panel match-panel" aria-labelledby="match-form-title">
      <div className="match-topbar">
        <div>
          <p className="eyebrow">Match entry</p>
          <h2 id="match-form-title">Статистика после карты</h2>
        </div>

        <label className="map-select">
          <span>Карта</span>
          <select
            aria-label="Карта матча"
            value={selectedMap.id}
            onChange={(event) => onSelectMap(event.target.value)}
          >
            {maps.map((map) => (
              <option key={map.id} value={map.id}>
                {map.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="match-summary">
        <article className="match-map-card">
          <img src={selectedMap.image} alt="" />
          <div>
            <span>Выбрана карта</span>
            <strong>{selectedMap.name}</strong>
          </div>
        </article>

        <article className="mvp-card" aria-label="Лучший игрок текущей карты">
          <span>Лучший сейчас</span>
          <strong>
            <span className="mvp-star" aria-hidden="true">
              *
            </span>
            {matchMvp.name || 'Без имени'}
          </strong>
          <small>{matchMvp.points} баллов</small>
        </article>
      </div>

      <div className="player-list" role="list">
        {players.map((player, index) => (
          <article
            className={`player-row ${player.id === matchMvp.id ? 'is-mvp' : ''}`}
            key={player.id}
            role="listitem"
          >
            <div className="player-row__identity">
              <span className="player-rank">{index + 1}</span>
              <label>
                <span>Ник</span>
                <input
                  aria-label={`Ник игрока ${player.id}`}
                  type="text"
                  value={player.name}
                  onBlur={onSaveNicknames}
                  onChange={(event) =>
                    onUpdatePlayer(player.id, 'name', event.target.value)
                  }
                />
              </label>
            </div>

            <div className="player-row__inputs">
              {fields.map((field) => (
                <label key={field.key}>
                  <span>
                    {field.icon && (
                      <span className="mvp-star" aria-hidden="true">
                        {field.icon}
                      </span>
                    )}
                    {field.label}
                  </span>
                  <input
                    inputMode="numeric"
                    min="0"
                    placeholder="0"
                    type="number"
                    value={player[field.key]}
                    onChange={(event) =>
                      onUpdatePlayer(player.id, field.key, event.target.value)
                    }
                  />
                </label>
              ))}
            </div>

            <dl className="player-row__result">
              <div>
                <dt>K/D</dt>
                <dd>{formatNumber(player.kd)}</dd>
              </div>
              <div>
                <dt>Баллы</dt>
                <dd className="points-value">{player.points}</dd>
              </div>
            </dl>
          </article>
        ))}
      </div>

      <div className="actions">
        <button className="primary-button" type="button" onClick={onSaveMatch}>
          Сохранить карту
        </button>
        <button type="button" onClick={onResetMatch}>
          Очистить текущую
        </button>
        <button type="button" onClick={onClearAll}>
          Сбросить все
        </button>
      </div>
    </section>
  )
}

export default MatchForm
