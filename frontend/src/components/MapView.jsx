import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

// fix default icon path issues in Vite by using static imports
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
})

function LocationMarker({ position, setPosition }) {
  useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng])
    },
  })

  return position ? <Marker position={position} /> : null
}

export default function MapView({ center = [20.5937, 78.9629], zoom = 5, markers = [], position, setPosition, height = '320px' }) {
  return (
    <div style={{ height }}>
      <MapContainer center={position || center} zoom={zoom} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {markers.map((m) => (
          <Marker key={m.id || `${m.lat}-${m.lng}`} position={[m.lat, m.lng]}>
            <Popup>
              {m.title}
              <br />
              {m.description}
            </Popup>
          </Marker>
        ))}
        {setPosition && <LocationMarker position={position} setPosition={setPosition} />}
      </MapContainer>
    </div>
  )
}
