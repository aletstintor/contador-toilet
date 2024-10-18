import './App.css';
import axios from 'axios';
import { useState, useEffect } from 'react';

const API_URL = 'http://localhost:5000';

function App() {
  const [name, setName] = useState('');
  const [isNameSubmitted, setIsNameSubmitted] = useState(false);
  const [count, setCount] = useState(0);
  const [isCounterEnabled, setIsCounterEnabled] = useState(false);
  const [isCounterDisabled, setIsCounterDisabled] = useState(false);
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    if (isNameSubmitted) {
      // Traer el usuario existente o crearlo
      axios.post(`${API_URL}/users`, { name })
        .then(response => {
          setCount(response.data.score);
        })
        .catch(error => console.log(error));
    }
  }, [isNameSubmitted]);

  useEffect(() => {
    // Cargar la tabla de clasificación
    axios.get(`${API_URL}/users`)
      .then(response => {
        setLeaderboard(response.data);
      })
      .catch(error => console.log(error));
  }, []);

  const handleNameSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      setIsNameSubmitted(true);
    }
  };

  const handleCount = () => {
    axios.put(`${API_URL}/users/${name}/increment`)
      .then(response => {
        setCount(response.data.score);
        updateLeaderboard();
      })
      .catch(error => console.log(error));
  };

  const updateLeaderboard = () => {
    axios.get(`${API_URL}/users`)
      .then(response => {
        setLeaderboard(response.data);
      })
      .catch(error => console.log(error));
  };

  return (
    <div className="container">
      {!isNameSubmitted ? (
        <form onSubmit={handleNameSubmit} className="user-form">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ingresa tu nombre"
          />
          <button type="submit">Comenzar</button>
        </form>
      ) : (
        <>
          <h1 className="welcome-message">Bienvenido al mejor contador de idas al baño, {name}!</h1>
          {!isCounterEnabled && <p>El contador se habilitará en 5 segundos...</p>}
          {isCounterEnabled && (
            <div className="counter-buttons">
              <p>Contador: {count}</p>
              <button onClick={handleCount} disabled={isCounterDisabled}>Incrementar</button>
            </div>
          )}
          <h2>Tabla de clasificación</h2>
          <table>
            <thead>
              <tr>
                <th>Posición</th>
                <th>Nombre</th>
                <th>Puntuación</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((player, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{player.name}</td>
                  <td>{player.score}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      <footer className="footer">
        <p>Creado por Elon Musk en GAFI © {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
}

export default App
