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

export default function Post({ match }) {
  const [users, setUsers] = useState([]);
  const [comment, setComment] = useState("");
  const [matchDev, setMatchDev] = useState(null);

  useEffect(() => {
    async function loadUsers() {
      const response = await api.get(
        "/devs/" + match.params.DevId + "/" + match.params.position
      );
      setUsers([response.data]);
    }

    loadUsers();
  }, [match.params.id]);

  async function handleLike(id, commentId) {
    const response = await api.post(`/devs/${id}/likes`, null, {
      headers: { commentId: commentId }
    });

    const response1 = await api.get(
      "/devs/" + match.params.DevId + "/" + match.params.position
    );
    setUsers([response1.data]);
  }

  async function handleDislike(id, commentId) {
    const response = await api.post(`/devs/${id}/dislikes`, null, {
      headers: { commentId: commentId }
    });

    const response1 = await api.get(
      "/devs/" + match.params.DevId + "/" + match.params.position
    );
    setUsers([response1.data]);
  }

  async function handleComments(id) {
    const response = await api.post(`/devs/${id}/comments`, null, {
      headers: { comment: comment }
    });

    const response1 = await api.get(
      "/devs/" + match.params.DevId + "/" + match.params.position
    );
    setUsers([response1.data]);
  }

  async function handleAlert(id, commentId) {
    const response = await api.post(`/devs/${id}/denunciate`, null, {
      headers: { commentId: commentId }
    });

    const response1 = await api.get(
      "/devs/" + match.params.DevId + "/" + match.params.position
    );
    setUsers([response1.data]);
  }

  async function handleMenu(id) {
    const response = await api.post(`/devs/${id}/comments`, null, {
      headers: { comment: comment }
    });

    const response1 = await api.get(
      "/devs/" + match.params.DevId + "/" + match.params.position
    );
    setUsers([response1.data]);
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
        <Link to={"/dev/" + match.params.id}>
          <img src={logo} alt="logo" />
        </Link>
      </div>
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
              <img src={user.avatar} alt={user.name}></img>

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
