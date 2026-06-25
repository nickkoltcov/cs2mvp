function MapPicker({ maps, selectedMap, onSelectMap }) {
  return (
    <section className="map-section" aria-labelledby="map-picker-title">
      <div className="section-heading">
        <p className="eyebrow">Map pool</p>
        <h2 id="map-picker-title">Выбор карты</h2>
      </div>

      <div className="map-layout">
        <article className="map-hero">
          <img src={selectedMap.image} alt="" />
          <div className="map-hero__content">
            <span>Текущая карта</span>
            <strong>{selectedMap.name}</strong>
          </div>
        </article>

        <div className="map-grid" role="list">
          {maps.map((map) => (
            <button
              className={`map-tile ${map.id === selectedMap.id ? 'is-selected' : ''}`}
              key={map.id}
              type="button"
              onClick={() => onSelectMap(map.id)}
            >
              <img src={map.image} alt="" />
              <span>{map.name}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}

export default MapPicker
