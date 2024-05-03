import { useEffect, useState } from "react";
import io from "socket.io-client";
import { v4 as uuidv4 } from "uuid";

function Signin() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [crudData, setCrudData] = useState([]);
  const [isEdit, setIsEdit] = useState(false);

  const socket = io("localhost:3000");

  const handleInput = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = () => {
    // console.log("formData", formData);
    socket.emit("data", { ...formData, id: uuidv4() });

    socket.on("crudData", (crudData) => {
      setCrudData(crudData);
    });

    setFormData({
      username: "",
      email: "",
      password: "",
    });
  };

  const getEditData = (data) => {
    setFormData(data);
    setIsEdit(true);
  };

  const handleEdit = () => {
    socket.emit("editData", formData);
    setIsEdit(false);
    setFormData({
      username: "",
      email: "",
      password: "",
    });
  };

  const handleDelete = (id) => {
    socket.emit("deleteData", id);
  };

  useEffect(() => {
    socket.on("crudData", (data) => {
      setCrudData(data);
    });
  }, []);

  return (
    <>
      <h1>Hello Testing</h1>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <input
          type="text"
          name="username"
          placeholder="Enter your username"
          value={formData.username}
          onChange={handleInput}
        />
        <input
          type="text"
          name="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={handleInput}
        />
        <input
          type="password"
          name="password"
          placeholder="Enter your password"
          value={formData.password}
          onChange={handleInput}
        />
      </div>
      <button onClick={isEdit ? handleEdit : handleSubmit}>
        {isEdit ? "Edit Data" : "Add Data"}
      </button>

      <h1>data</h1>
      <div>
        {crudData.map((data, index) => (
          <div key={index}>
            <span>Id: {data.id} </span> ||
            <span>Name: {data.username} </span> ||
            <span>Email: {data.email}</span>
            <button onClick={() => getEditData(data)}>Edit</button>
            <button onClick={() => handleDelete(data?.id)}>Delete</button>
          </div>
        ))}
      </div>
    </>
  );
}

export default Signin;
