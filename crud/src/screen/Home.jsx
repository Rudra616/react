import React, { useState, useEffect } from "react";
import { Table, Modal, Button, Form, Badge } from "react-bootstrap";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useTasks } from "../context/TaskContext";
import {
  showSuccess,
  showError,
  showWarning,
  showInfo,
} from "../utility/toast";

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { tasks, saveTasks } = useTasks();

  const [showModal, setShowModal] = useState(false);
  const [task, setTask] = useState("");
  const [reminder, setReminder] = useState("");
  const [finish, setFinish] = useState("");
  const [editId, setEditId] = useState(null);

  const [timeFormat, setTimeFormat] = useState(24);
  const [, forceTick] = useState(0);
  const [statusFilter, setStatusFilter] = useState("all");
  const getNowUTC = () => {
    const now = new Date();
    now.setSeconds(0, 0); // ⬅️ remove seconds & ms
    return now.toISOString();
  };



  // 🔁 Live status update
  useEffect(() => {
    const timer = setInterval(() => forceTick(n => n + 1), 15000);
    return () => clearInterval(timer);
  }, []);

  // ➕ Add Task
  const handleAddClick = () => {
    if (!user) {
      showWarning("Please login to add tasks");
      navigate("/login");
      return;
    }
    setTask("");
    setReminder("");
    setFinish("");
    setEditId(null);
    setShowModal(true);
  };
const formatUTCNow = () => {
  const now = new Date();
  return now.toLocaleString("en-US", {
    timeZone: "UTC",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    year: "numeric",
    month: "short",
    day: "2-digit",
  }) + " UTC";
};

  // 💾 Save Task (UTC ONLY)
const handleSave = () => {
  if (!task.trim()) return showError("Task is required");
  if (!reminder || !finish) return showError("Reminder & Finish required");

  // Treat input as UTC
  const rUTCms = Date.parse(reminder + "Z");
  const fUTCms = Date.parse(finish + "Z");
  const nowUTCms = Date.now();

  if (rUTCms < nowUTCms || fUTCms < nowUTCms) {
    return showError(
      `Selected time is in the past.\nCurrent UTC time: ${formatUTCNow()}`
    );
  }

  if (rUTCms >= fUTCms) {
    return showWarning("Reminder must be before Finish time");
  }

  const rUTC = new Date(rUTCms).toISOString();
  const fUTC = new Date(fUTCms).toISOString();
  const nowUTC = new Date().toISOString();

  const updated = editId
    ? tasks.map(t =>
        t.id === editId
          ? { ...t, text: task, reminder: rUTC, finish: fUTC, updatedAt: nowUTC }
          : t
      )
    : [
        ...tasks,
        {
          id: Date.now(),
          text: task,
          createdAt: nowUTC,
          updatedAt: null,
          reminder: rUTC,
          finish: fUTC,
        },
      ];

  saveTasks(updated);
  setShowModal(false);
};


  // ✏️ Edit
  const handleEdit = (t) => {
    if (!user) {
      showInfo("Login required");
      navigate("/login");
      return;
    }

const toLocalInput = (utc) => {
  const d = new Date(utc);
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 16);
};

    setEditId(t.id);
    setTask(t.text);
    setReminder(toLocalInput(t.reminder));
    setFinish(toLocalInput(t.finish));
    setShowModal(true);
  };

  // 🗑 Delete
  const handleDelete = (id) => {
    if (!user) {
      showInfo("Login required");
      navigate("/login");
      return;
    }
    saveTasks(tasks.filter(t => t.id !== id));
    showSuccess("Task deleted");
  };

  // 🏷 Status (UTC)
  const getStatus = (t) => {
    const now = new Date().toISOString();
    if (t.finish <= now) return <Badge bg="danger">Expired</Badge>;
    if (t.reminder <= now) return <Badge bg="warning">Reminder</Badge>;
    return <Badge bg="success">Upcoming</Badge>;
  };

  // 🕒 UTC formatter (12/24 only affects display)
  const formatUTC = (date) => {
    if (!date) return "-";
    const d = new Date(date);
    return timeFormat === 24
      ? d.toISOString().replace("T", " ").slice(0, 19) + " UTC"
      : d.toLocaleString("en-US", {
        timeZone: "UTC",
        hour12: true,
      }) + " UTC";
  };

  // 🔍 Filter
  const getFilteredTasks = () => {
    const now = new Date().toISOString();

    if (statusFilter === "upcoming")
      return tasks.filter(t => t.reminder > now && t.finish > now);

    if (statusFilter === "reminder")
      return tasks.filter(t => t.reminder <= now && t.finish > now);

    if (statusFilter === "finished")
      return tasks.filter(t => t.finish <= now);

    return tasks;
  };
  const getNowLocal = () => {
    const d = new Date();
    d.setSeconds(0, 0);
    return d;
  };

  const localInputToUTC = (value) => {
    const d = new Date(value); // local → Date
    d.setSeconds(0, 0);
    return d.toISOString();   // store UTC
  };

  const localToLocalTime = (value) => {
    const d = new Date(value);
    d.setSeconds(0, 0);
    return d.getTime();
  };

const getNowLocalInput = () => {
  const d = new Date();
  d.setSeconds(0, 0);
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 16);
};
  const nowLocalInput = getNowLocalInput();


  return (
    <div className="container mt-5">
      <div className="card shadow-sm mb-4 border-0">
        <div className="card-body text-center">
          <h2>
            Welcome, <span className="text-primary">{user?.name || "Guest"}</span>
          </h2>
        </div>
      </div>

      {user && (
        <div className="card shadow-sm border-0 mb-4">
          <div className="card-body d-flex justify-content-between flex-wrap gap-3">
            <Button onClick={handleAddClick}>➕ Add Task</Button>

            <Form.Select
              size="sm"
              style={{ width: 150 }}
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
            >
              <option value="all">All</option>
              <option value="upcoming">Upcoming</option>
              <option value="reminder">Reminder</option>
              <option value="finished">Finished</option>
            </Form.Select>

            <Form.Check
              type="switch"
              label={timeFormat === 24 ? "24 Hour" : "12 Hour"}
              checked={timeFormat === 24}
              onChange={() => setTimeFormat(p => (p === 24 ? 12 : 24))}
            />
          </div>
        </div>
      )}

      {tasks.length > 0 && (
        <Table striped bordered hover responsive>
          <thead className="table-primary text-center">
            <tr>
              <th>#</th>
              <th>Task</th>
              <th>Created</th>
              <th>Updated</th>
              <th>Reminder</th>
              <th>Finish</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {getFilteredTasks().map((t, i) => (
              <tr key={t.id}>
                <td>{i + 1}</td>
                <td>{t.text}</td>
                <td>{formatUTC(t.createdAt)}</td>
                <td>{formatUTC(t.updatedAt)}</td>
                <td>{formatUTC(t.reminder)}</td>
                <td>{formatUTC(t.finish)}</td>
                <td className="text-center">{getStatus(t)}</td>
                <td>
                  <Button size="sm" onClick={() => handleEdit(t)}>Edit</Button>{" "}
                  <Button size="sm" variant="danger" onClick={() => handleDelete(t.id)}>Delete</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      <Modal show={showModal} centered backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>{editId ? "Edit Task" : "Add Task"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Control className="mb-3" value={task} onChange={e => setTask(e.target.value)} />

<Form.Control
  type="datetime-local"
  value={reminder}
  onChange={e => setReminder(e.target.value)}
/>


            <Form.Control
              type="datetime-local"
              min={reminder || nowLocalInput}
              value={finish}
              onChange={e => setFinish(e.target.value)}
            />



          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => setShowModal(false)}>Cancel</Button>
          <Button onClick={handleSave}>OK</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Home;
