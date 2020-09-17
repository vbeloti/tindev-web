import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import api from '../../services/api';

import './styles.css';
import logo from '../../assets/logo.svg';

function Login() {
  const history = useHistory();

  const [username, setUsername] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    const response = await api.post('devs', {
      username,
    });

    const { _id } = response.data;

    console.log(response);

    history.push(`/dev/${_id}`);
  }

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit}>
        <img src={logo} alt="Tindev" />

        <input
          placeholder="Usuário do Github"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <button type="submit">Enviar</button>
      </form>
    </div>
  );
}

export default Login;
