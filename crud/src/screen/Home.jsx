import React, { useState, useEffect } from "react";
import { Table, Modal, Button, Form, Badge, ButtonGroup } from "react-bootstrap";
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

  // const [tasks, setTasks] = useState([]);
  const { tasks, saveTasks } = useTasks();

  const [showModal, setShowModal] = useState(false);

  const [task, setTask] = useState("");
  const [reminder, setReminder] = useState("");
  const [finish, setFinish] = useState("");
  const [editId, setEditId] = useState(null);

  const [timeFormat, setTimeFormat] = useState(24);
  const [, forceTick] = useState(0); // 🔁 Live update
  const [statusFilter, setStatusFilter] = useState("all");

  // 🔁 Auto re-render every 15 seconds to update status
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

  // 💾 Save Task
  const handleSave = () => {
    if (!task.trim()) return showError("Task is required");
    if (!reminder || !finish) return showError("Reminder & Finish required");

    const rUTC = new Date(reminder + "Z").toISOString();
    const fUTC = new Date(finish + "Z").toISOString();
    const now = new Date().toISOString();

    if (rUTC < now || fUTC < now)
      return showError("Date & time cannot be in the past");
    if (rUTC >= fUTC)
      return showWarning("Reminder must be before Finish time");

    let updated;
    if (editId) {
      updated = tasks.map(t =>
        t.id === editId ? { ...t, text: task, reminder: rUTC, finish: fUTC, updatedAt: now } : t
      );
      showSuccess("Task updated");
    } else {
      updated = [
        ...tasks,
        { id: Date.now(), text: task, createdAt: now, updatedAt: null, reminder: rUTC, finish: fUTC }
      ];
      showSuccess("Task added");
    }

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
    setEditId(t.id);
    setTask(t.text);
    setReminder(t.reminder.slice(0, 16));
    setFinish(t.finish.slice(0, 16));
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

  // 🏷 Status (LIVE)
  const getStatus = (t) => {
    const now = new Date().toISOString();
    if (t.finish <= now) return <Badge bg="danger">Expired</Badge>;
    if (t.reminder <= now) return <Badge bg="warning">Reminder</Badge>;
    return <Badge bg="success">Upcoming</Badge>;
  }; const nowUTC = new Date().toISOString().slice(0, 16); // YYYY-MM-DDTHH:mm


  // 🕒 UTC formatter
  const formatUTC = (date) => {
    if (!date) return "-";
    const d = new Date(date);
    return timeFormat === 24
      ? d.toUTCString()
      : d.toLocaleString("en-US", { timeZone: "UTC", hour12: true }) + " UTC";
  };

  // Filter 
  const getFilteredTasks = () => {
    const now = new Date().toISOString();

    if (statusFilter === "upcoming") {
      return tasks.filter(
        t => t.reminder > now && t.finish > now
      );
    }

    if (statusFilter === "reminder") {
      return tasks.filter(
        t => t.reminder <= now && t.finish > now
      );
    }

    if (statusFilter === "finished") {
      return tasks.filter(
        t => t.finish <= now
      );
    }

    return tasks; // all
  };


  return (
    <div className="container mt-5">
      <div className="card shadow-sm mb-4 border-0">
        <div className="card-body text-center">
          <h2 className="mb-0">
            Welcome, <span className="text-primary">{user?.name || "Guest"}</span>
          </h2>
        </div>
      </div>
      {user && (

        <div className="card shadow-sm border-0 mb-4">
<div className="card-body d-flex justify-content-between align-items-center flex-wrap gap-3">
          {/* LEFT: Add Task */}
          <Button onClick={handleAddClick}>
            ➕ Add Task
          </Button>

          {/* CENTER: Status Filter Dropdown */}
          <div className="d-flex align-items-center gap-2">
            <span className="text-muted small">Status:</span>

            <Form.Select
              size="sm"
              value={statusFilter}
              style={{ width: "140px" }}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All</option>
              <option value="upcoming">Upcoming</option>
              <option value="reminder">Reminder</option>
              <option value="finished">Finished</option>
            </Form.Select>
          </div>

          {/* RIGHT: Time Format Switch */}
          <Form.Check
            type="switch"
            id="time-format-switch"
            label={timeFormat === 24 ? "24 Hour" : "12 Hour"}
            checked={timeFormat === 24}
            onChange={() => setTimeFormat(prev => (prev === 24 ? 12 : 24))}
          />
</div>
        </div>

      )}




      {tasks.length > 0 ? (
        <Table striped bordered hover responsive>
<thead className="table-primary text-center">            <tr>
              <th>#</th>
              <th>Task</th>
              <th>Created (UTC)</th>
              <th>Updated (UTC)</th>
              <th>Reminder (UTC)</th>
              <th>Finish (UTC)</th>
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
<td className="text-center">{getStatus(t)}</td>                <td>
                  <Button size="sm" variant="primary" className="me-2" onClick={() => handleEdit(t)}>Edit</Button>
                  <Button size="sm" variant="danger" onClick={() => handleDelete(t.id)}>Delete</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <div className="text-center text-muted mt-5">
          <h5>No tasks yet</h5>
          <p>
            {user
              ? "Click 'Add Task' to create your first task"
              : "Login to create and manage tasks"}
          </p>
        </div>
      )}
      {getFilteredTasks().length === 0 && tasks.length > 0 && (
        <div
          className="d-flex flex-column justify-content-center align-items-center text-muted"
          style={{ minHeight: "200px" }}
        >
          <h6 className="mb-1">No tasks found</h6>
          <small>Try changing the status filter</small>
        </div>
      )}
      {/* 🔒 Modal locked */}
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        backdrop="static"
        keyboard={false}
        centered
      >        <Modal.Header closeButton>
          <Modal.Title>{editId ? "Edit Task" : "Add Task"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Task</Form.Label>
              <Form.Control value={task} onChange={(e) => setTask(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Reminder (UTC)</Form.Label>
              <Form.Control type="datetime-local" value={reminder} min={nowUTC} onChange={(e) => setReminder(e.target.value)} onKeyDown={(e) => e.preventDefault()}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Finish (UTC)</Form.Label>
              <Form.Control type="datetime-local" value={finish} min={reminder || nowUTC} onChange={(e) => setFinish(e.target.value)} onKeyDown={(e) => e.preventDefault()}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleSave}>OK</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Home;
