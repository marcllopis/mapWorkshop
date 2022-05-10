import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

import "./App.css";

// let ticketAPI = "8phrYGyEWNPhFyppQN5b1E6vzWDD0fwV";
// let cordsAPI = "4c28746bdba2dff0e79219c825e7039a";

function App() {
  let [city, setCity] = useState("");
  let [cords, setCords] = useState({ lat: "", lon: "" });
  let [apiLoaded, setApiLoaded] = useState(false);
  let [events, setEvents] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch(
      `http://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${cordsAPI}`
    )
      .then((res) => res.json())
      .then((data) => {
        setCords({
          lat: data[0].lat,
          lon: data[0].lon,
        });
        fetch(
          `https://app.ticketmaster.com/discovery/v2/events.json?city=${city}&apikey=${ticketAPI}`
        )
          .then((res) => res.json())
          .then((eventsData) => {
            setEvents(eventsData["_embedded"].events);
            setApiLoaded(true);
          });
      });
    setCity("");
  };

  return (
    <div className="App">
      <h1>Events around you!</h1>
      <form onSubmit={handleSubmit}>
        <input
          value={city}
          placeholder={"write a city..."}
          onChange={(e) => setCity(e.target.value)}
        />
        <button>GO</button>
      </form>
      {apiLoaded && (
        <MapContainer
          center={[cords.lat, cords.lon]}
          zoom={12}
          scrollWheelZoom={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {events.map((event, i) => (
            <Marker
              position={[
                event["_embedded"].venues[0].location.latitude,
                event["_embedded"].venues[0].location.longitude,
              ]}
              key={i}
            >
              <Popup>
                <h3>{event.name}</h3>
                <p>at: {event["_embedded"].venues[0].name} venue</p>
                <p>
                  link:
                  <a target="_blank" href={event.url}>
                    here
                  </a>
                </p>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      )}
    </div>
  );
}

export default App;
