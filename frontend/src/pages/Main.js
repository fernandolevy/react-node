import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Main.css";

import api from "../services/api";

import logo from "../assets/idiot.svg";
import dislike from "../assets/dislike.svg";
import like from "../assets/like.svg";

export default function Main({ match }) {
  const [users, setUsers] = useState([]);
  const [comment, setComment] = useState("");

  useEffect(() => {
    async function loadUsers() {
      const response = await api.get("/devs", {
        headers: {
          user: match.params.id
        }
      });

      setUsers(response.data);
    }

    loadUsers();
  }, [match.params.id]);

  async function handleLike(id, commentId) {
    await api.post(`/devs/${id}/likes`, null, {
      headers: { commentId: commentId }
    });

    const response = await api.get("/devs", {
      headers: {
        user: match.params.id
      }
    });

    setUsers(response.data);
  }

  async function handleDislike(id, commentId) {
    await api.post(`/devs/${id}/dislikes`, null, {
      headers: { commentId: commentId }
    });

    const response = await api.get("/devs", {
      headers: {
        user: match.params.id
      }
    });

    setUsers(response.data);
  }

  async function handleComments(id) {
    await api.post(`/devs/${id}/comments`, null, {
      headers: { comment: comment }
    });

    const response = await api.get("/devs", {
      headers: {
        user: match.params.id
      }
    });

    setUsers(response.data);
  }

  return (
    <div className="main-container">
      <div className="search-container">
        <Link to="/">
          <img src={logo} alt="Tindev" />
        </Link>
        <form onSubmit={() => handleComments(match.params.id)}>
          <input
            placeholder="Não existe pergunta idiota"
            value={comment}
            onChange={e => setComment(e.target.value)}
          />
          <button type="submit">Seja feliz</button>
        </form>
      </div>
      {users.length > 0 ? (
        <ul>
          {users.map(user => (
            <ul>
              <li key={user._id}>
                <img src={user.avatar} alt={user.name} />
                <footer>
                  <strong>{user.name}</strong> <span>{user.user}</span>
                  <p>{user.comments.comment}</p>
                </footer>
                <div className="buttons">
                  <button
                    type="button"
                    onClick={() => handleDislike(user._id, user.comments._id)}
                  >
                    <img src={dislike} alt="Dislike" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleLike(user._id, user.comments._id)}
                  >
                    <img src={like} alt="Like" />
                  </button>
                </div>
                <div className="comments"></div>
              </li>
            </ul>
          ))}
        </ul>
      ) : (
        <div className="empty">Faça uma pergunta :)</div>
      )}
    </div>
  );
}
