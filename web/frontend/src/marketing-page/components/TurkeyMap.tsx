import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import cities from '../../assets/iller.json';

// Fix for default markers in React Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Turkey's approximate center coordinates
const TURKEY_CENTER: [number, number] = [39.0, 35.0];
const TURKEY_ZOOM = 6.5;

interface TurkeyMapProps {
  width?: number;
  height?: number;
}

interface City {
  name: string;
  latitude: string;
  longitude: string;
}

const TurkeyMap: React.FC<TurkeyMapProps> = ({ width = 800, height = 400 }) => {
  // Convert city names to proper Turkish format for display
  const formatCityName = (name: string): string => {
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Function to open Google Maps directions
  const openDirections = (cityName: string, lat: number, lng: number) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&destination_place_id=${encodeURIComponent(cityName)}`;
    window.open(url, '_blank');
  };

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <MapContainer
        center={TURKEY_CENTER}
        zoom={TURKEY_ZOOM}
        style={{ width: '100%', height: '100%', borderRadius: '8px' }}
        scrollWheelZoom={false}
        dragging={true}
        touchZoom={true}
        doubleClickZoom={true}
        zoomControl={true}
        zoomDelta={0.5}
        zoomSnap={0.5}
      >
        {/* OpenStreetMap tile layer for political map */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Add markers for all cities */}
        {cities.map((city: City, index: number) => {
          const lat = parseFloat(city.latitude);
          const lng = parseFloat(city.longitude);
          
          // Skip invalid coordinates
          if (isNaN(lat) || isNaN(lng)) return null;
          
          return (
            <Marker
              key={index}
              position={[lat, lng]}
            >
              <Popup>
                <div style={{ textAlign: 'center', minWidth: '150px' }}>
                  <strong>{formatCityName(city.name)}</strong>
                  <br />
                  <small style={{ color: '#666', marginBottom: '8px', display: 'block' }}>
                    {lat.toFixed(4)}, {lng.toFixed(4)}
                  </small>
                  <button
                    onClick={() => openDirections(formatCityName(city.name), lat, lng)}
                    style={{
                      backgroundColor: '#1976d2',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      padding: '6px 12px',
                      fontSize: '12px',
                      cursor: 'pointer',
                      marginTop: '4px'
                    }}
                    onMouseOver={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#1565c0'}
                    onMouseOut={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#1976d2'}
                  >
                    Yol Tarifi Al
                  </button>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default TurkeyMap;
