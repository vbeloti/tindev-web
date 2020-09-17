import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import io from 'socket.io-client';
import { useParams } from 'react-router-dom';
import api from '../../services/api';

import logo from '../../assets/logo.svg';
import likeIcon from '../../assets/like.svg';
import dislikeIcon from '../../assets/dislike.svg';
import itsamatch from '../../assets/itsamatch.png';

import './styles.css';

function Main({ match }) {
  const [devs, setDevs] = useState([]);
  const [matchDev, setMatchDev] = useState(null);

  let { id: devFrom } = useParams();

  useEffect(() => {
    async function loadUsers() {
      const response = await api.get('devs', {
        headers: { devFrom },
      });

      setDevs(response.data);
    }

    loadUsers();
  }, [devFrom]);

  useEffect(() => {
    const socket = io('http://localhost:3333', {
      query: { devFrom }
    });

    socket.on('match', dev => {
      setMatchDev(dev);
    });

  }, [devFrom]);

  async function handleLike(id) {
    await api.post(`/devs/${id}/likes`, null, {
      headers: { devFrom },
    });
    setDevs(devs.filter((dev) => dev._id !== id));
  }
  async function handleDislike(id) {
    await api.post(`/devs/${id}/dislikes`, null, {
      headers: { devFrom },
    });

    setDevs(devs.filter((dev) => dev._id !== id));
  }

  return (
    <div className="main-container">
      <Link to="/">
        <img src={logo} alt="Tindev" />
      </Link>
      {devs.length > 0 ? (
        <ul>
          {devs.map((dev) => (
            <li key={dev._id}>
              <img src={dev.avatar} alt={dev.name} />
              <footer>
                <strong>{dev.name}</strong>
                <p>{dev.bio}</p>
              </footer>

              <div className="buttons">
                <button
                  stype="button"
                  onClick={() => {
                    handleDislike(dev._id);
                  }}
                >
                  <img src={dislikeIcon} alt="Dislike" />
                </button>

                <button
                  stype="button"
                  onClick={() => {
                    handleLike(dev._id);
                  }}
                >
                  <img src={likeIcon} alt="Like" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="empty">Acabou :(</div>
      )}

      {matchDev && (
        <div className="match-container">
          <img src={itsamatch} alt={matchDev.name}/>
          <img className="avatar" src={matchDev.avatar} alt="It's a match"/>
          <strong>{matchDev.name}</strong>
          <p>{matchDev.bio}</p>

          <button type="submit" onClick={() => setMatchDev(null)}>Fechar</button>
        </div>
      )}
    </div>
  );
}

export default Main;
