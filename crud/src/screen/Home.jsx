import React, { useState, useEffect } from "react";
import { Table } from "react-bootstrap";
import { useAuth } from "../context/AuthContext";

const Home = () => {
  const { user } = useAuth();

  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    if (user) {
      const savedTasks =
        JSON.parse(localStorage.getItem(`tasks_${user.email}`)) || [];
      setTasks(savedTasks);
    } else {
      setTasks([]);
    }
  }, [user]);

  const handleChange = (e) => setTask(e.target.value);

  const handleTask = () => {
    if (!task.trim()) return;

    let updatedTasks;

    if (editId) {
      updatedTasks = tasks.map((t) =>
        t.id === editId ? { ...t, text: task } : t
      );
      setEditId(null);
    }
    else {
      const newTask = {
        id: Date.now(),
        text: task,
        date: new Date().toLocaleDateString(),
      };
      updatedTasks = [...tasks, newTask];
    }

    setTasks(updatedTasks);
    localStorage.setItem(
      `tasks_${user.email}`,
      JSON.stringify(updatedTasks)
    );
    setTask("");
  };

  const handleEdit = (task) => {
    setTask(task.text);
    setEditId(task.id);
  };

  const handleDelete = (id) => {
    const updatedTasks = tasks.filter((t) => t.id !== id);
    setTasks(updatedTasks);
    localStorage.setItem(
      `tasks_${user.email}`,
      JSON.stringify(updatedTasks)
    );
  };

  return (
    <div>
      <h1>Welcome, {user ? user.name : "Guest"}!</h1>

      {user && (
        <>
          <input
            type="text"
            value={task}
            onChange={handleChange}
            placeholder="Enter task"
          />
          <button onClick={handleTask}>
            {editId ? "Update Task" : "Submit"}
          </button>
        </>
      )}

      {user && tasks.length > 0 && (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>No.</th>
              <th>Task</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((t, index) => (
              <tr key={t.id}>
                <td>{index + 1}</td>
                <td>{t.text}</td>
                <td>{t.date}</td>
                <td>
                  <button onClick={() => handleEdit(t)}>Edit</button>{" "}
                  <button onClick={() => handleDelete(t.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default Home;
