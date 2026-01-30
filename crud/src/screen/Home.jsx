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
        t.id === editId
          ? { ...t, text: task, updatedAt: new Date().toLocaleString() } // update timestamp
          : t
      );
      setEditId(null);
    } else {
      // new task
      const newTask = {
        id: Date.now(),
        text: task,
        date: new Date().toLocaleDateString(),
        updatedAt: null,
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
    <div className="container mt-5" style={{ maxWidth: "900px" }}>

      {/* Header */}
      <h1 className="text-center mb-4">
        Welcome,{" "}
        <span className="text-primary fw-bold">
          {user ? user.name : "Guest"}
        </span>
        !
      </h1>

      {/* Task Input */}
      {user && (
        <div className="card p-4 mb-4 shadow-sm">
          <div className="row g-2">
            <div className="col-md-9">
              <input
                type="text"
                value={task}
                onChange={handleChange}
                placeholder="Enter task"
                className="form-control"
              />
            </div>

            <div className="col-md-3 d-grid">
              <button
                onClick={handleTask}
                className={`btn ${editId ? "btn-warning" : "btn-success"}`}
              >
                {editId ? "Update Task" : "Add Task"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Task Table */}
      {user && tasks.length > 0 && (
        <div className="card shadow-sm">
          <div className="table-responsive">
            <Table striped bordered hover className="mb-0 align-middle">
              <thead className="table-dark">
                <tr>
                  <th>#</th>
                  <th>Task</th>
                  <th>Date</th>
                  <th>Updated</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>

              <tbody>
                {tasks.map((t, index) => (
                  <tr key={t.id}>
                    <td>{index + 1}</td>
                    <td>{t.text}</td>
                    <td>{t.date}</td>
                    <td>{t.updatedAt || "-"}</td>
                    <td className="text-center">
                      <button
                        onClick={() => handleEdit(t)}
                        className="btn btn-sm btn-outline-primary me-2"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(t.id)}
                        className="btn btn-sm btn-outline-danger"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </div>
      )}
    </div>
  );


};

export default Home;
