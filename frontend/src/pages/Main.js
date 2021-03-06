import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Main.css";
import { uniqueId } from "lodash";
import filesize from "filesize";

import api from "../services/api";

import logo from "../assets/idiot.svg";
import dislike from "../assets/dislike.svg";
import like from "../assets/like.svg";
import report from "../assets/report.svg";
import share from "../assets/share.svg";

import Upload from "../components/Upload";

export default function Main({ match }) {
  const [users, setUsers] = useState([]);
  const [comment, setComment] = useState("");
  const [matchDev, setMatchDev] = useState(null);

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
    const response = await api.post(`/devs/${id}/likes`, null, {
      headers: { commentId: commentId }
    });

    setUsers(response.data);
  }

  async function handleDislike(id, commentId) {
    const response = await api.post(`/devs/${id}/dislikes`, null, {
      headers: { commentId: commentId }
    });

    setUsers(response.data);
  }

  async function handleComments(id) {
    const response = await api.post(`/devs/${id}/comments`, null, {
      headers: { comment: comment }
    });

    setUsers(response.data);
  }

  async function handleAlert(id, commentId) {
    const response = await api.post(`/devs/${id}/denunciate`, null, {
      headers: { commentId: commentId }
    });

    setUsers(response.data);
  }

  async function handleMenu(id) {
    const response = await api.post(`/devs/${id}/comments`, null, {
      headers: { comment: comment }
    });

    setUsers(response.data);
  }

  async function handleProfile(id, files) {
    const data = new FormData();
    const uploadedFiles = files.map(file => ({
      file,
      id: uniqueId(),
      name: file.name,
      readableSize: filesize(file.size),
      preview: URL.createObjectURL(file),
      progress: 0,
      uploaded: false,
      error: false,
      url: null
    }));

    data.append("file", uploadedFiles[0].file, uploadedFiles[0].name);
    const response = await api.post(`/devs/${id}/posts`, data);

    const response1 = await api.get("/devs", {
      headers: {
        user: match.params.id
      }
    });

    setUsers(response1.data);
  }

  return (
    <div className="main-container">
      <div className="search-container">
        <Link to="/">
          <img src={logo} alt="logo" />
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
                <div className="buttons">
                  <button type="button" onClick={() => setMatchDev(user)}>
                    <img src={share} alt="report" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAlert(user._id, user.comments._id)}
                  >
                    <img src={report} alt="report" />
                  </button>
                </div>
                <Upload onUpload={e => handleProfile(user._id, e)}></Upload>
                <Link
                  to={
                    "/" +
                    match.params.id +
                    "/" +
                    user._id +
                    "/" +
                    user.comments._id
                  }
                >
                  <img src={user.avatar} alt={user.name}></img>
                </Link>
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

      {matchDev && (
        <div className="match-container">
          <img className="avatar" src={matchDev.avatar} alt="" />
          <strong>{matchDev.name}</strong>
          <p>{matchDev.bio}</p>
          <Link
            to={
              "/" +
              match.params.id +
              "/" +
              matchDev._id +
              "/" +
              matchDev.comments._id
            }
          >
            <strong>
              {"http://localhost:3000" +
                "/" +
                match.params.id +
                "/" +
                matchDev._id +
                "/" +
                matchDev.comments._id}
            </strong>
          </Link>
          <button type="button" onClick={() => setMatchDev(null)}>
            FECHAR
          </button>
        </div>
      )}
    </div>
  );
}
