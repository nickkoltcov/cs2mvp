import ancientImage from './assets/ancient.jpg'
import cacheImage from './assets/cache.jpg'
import dust2Image from './assets/de_dust2.jpg'
import mirageImage from './assets/de_mirage.jpg'
import nukeImage from './assets/Cs2nuke.webp'
import infernoImage from './assets/inferno.jpg'
import officeImage from './assets/Officecs2.webp'
import overpassImage from './assets/overpass.jpg'
import trainImage from './assets/train.webp'

export const maps = [
  { id: 'mirage', name: 'Mirage', image: mirageImage },
  { id: 'dust2', name: 'Dust II', image: dust2Image },
  { id: 'inferno', name: 'Inferno', image: infernoImage },
  { id: 'nuke', name: 'Nuke', image: nukeImage },
  { id: 'ancient', name: 'Ancient', image: ancientImage },
  { id: 'train', name: 'Train', image: trainImage },
  { id: 'overpass', name: 'Overpass', image: overpassImage },
  { id: 'cache', name: 'Cache', image: cacheImage },
  { id: 'office', name: 'Office', image: officeImage },
]

export const getMapById = (mapId) =>
  maps.find((map) => map.id === mapId) || maps[0]
