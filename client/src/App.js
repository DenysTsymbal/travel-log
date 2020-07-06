import React, { useState, useEffect } from 'react';
import ReactMapGL, { Marker, Popup } from 'react-map-gl';
import { listLogEntries, deleteLogEntry } from './API';
import   LogEntryForm  from './LogEntryForm';


const App = () => {
  const [viewport, setViewport] = useState({
    width: '100vw',
    height: '100vh',
    latitude: 37.7577,
    longitude: -98.4376,
    zoom: 3
  });
  const [logEntries, setLogEntries] = useState([]);
  const [showPopup, setShowPopup] = useState({}); 
  const [addEntryLocation, setAddEntryLocation] = useState(null); 
  
  const getEntries = async () => {
    const entries = await listLogEntries();
    console.log(entries);
    setLogEntries(entries);
  }

  useEffect(() => {
   getEntries();
  },[]);
  
  const DeleteLogEntry = async (data) => 
  {
    const response = await deleteLogEntry(data.title);
    getEntries();
    console.log(response);
  }

  const showAddMarkerPopup = (event) => {
    const [longitude, latitude ] = event.lngLat;
    setAddEntryLocation({
      latitude,
      longitude
    });
  }

  return (
    <ReactMapGL
       onDblClick={showAddMarkerPopup}
      {...viewport}
      mapStyle={"mapbox://styles/denister/ckbje63iu22nf1imny2qmio7u"}
      mapboxApiAccessToken={'pk.eyJ1IjoiZGVuaXN0ZXIiLCJhIjoiY2tjM2d5ZXAxMWYwejJ1bXI0am54OWgzcyJ9.VY6q55D5nl-mOMZrN15eRg'}
      onViewportChange={nextViewport => setViewport(nextViewport)}
      >
      {
        logEntries.map(entry =>
          <React.Fragment  key={entry._id}>
          <Marker latitude={entry.latitude} longitude={entry.longitude} >
            <div
            onClick={() => setShowPopup({
              [entry._id]: true,
            })}
            >
              <img
              style={{
                height: `${6 * viewport.zoom}px`,
                width: `${6 * viewport.zoom}px`,
              }} 
              className="marker" 
              src="https://lh3.googleusercontent.com/proxy/GrA9EEawM5TlhVYIrG9oqOUDYzumctq-1eD9Z-3C89tGvSOxf1YgDNe4QnlCIv3BTunT0H8JOzy1kDe_8ja3SDqyOzaCemKYtZtHAT_nrtdVAIYqOI2Kkj3TxGEItGG-G13pQG04ZrtC" 
              alt="marker" />
              
            </div>
          </Marker>
        
          {
            showPopup[entry._id] ? (
            <Popup
            latitude={entry.latitude} 
            longitude={entry.longitude}
             closeButton={true}
             closeOnClick={false}
             dynamicPosition={true}
             onClose={() => setShowPopup({})}
             anchor="top" >
               
            <div className="popup">
            <h3>{entry.title}</h3>
            <p>{entry.comments}</p>
            <small>Visited on: {new Date(entry.visitDate).toLocaleDateString()}</small>
            {entry.image && <img src={entry.image} alt={entry.title} />}
            <button onClick={() => {
              DeleteLogEntry(entry.title);
            }}>Delete</button>
            </div>
            
            
         </Popup> ) : null
          }
         </React.Fragment>
        )    
      }
    {
      addEntryLocation ? (
        <>
        <Marker 
        latitude={addEntryLocation.latitude} 
        longitude={addEntryLocation.longitude} >
            <div>
              <img
              style={{
                height: `${12 * viewport.zoom}px`,
                width: `${12 * viewport.zoom}px`,
              }} 
              className="marker" 
              src="https://lh3.googleusercontent.com/proxy/OTSxo3TlhxquxIUhekPUZvo2UccOaLrHbbuJJ7Blc-HLAd4wc2_azF8GUJ6reyxnh45VWP1ctcBxAaR99gVIemOSfaCSDMfJNZ2n257NFNR88ebCoruJ_O_yK04" 
              alt="marker" />
              
            </div>
          </Marker>

        <Popup
            latitude={addEntryLocation.latitude} 
            longitude={addEntryLocation.longitude}
             closeButton={true}
             closeOnClick={false}
             dynamicPosition={true}
             onClose={() => setAddEntryLocation(null)}
             anchor="top" >
            <div className="popup">
             <LogEntryForm onClose={() => {
               setAddEntryLocation(null);
               getEntries();
             }} location={addEntryLocation}/>
            </div>
         </Popup>
         </>
      ) : null
    }
   </ReactMapGL>
  );
}

export default App;