import React, { useState, useEffect } from "react";
import { Table, Modal, Button, Form, Badge } from "react-bootstrap";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useTasks } from "../context/TaskContext";
import { Dropdown } from "react-bootstrap";
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

  const TASK_REGEX = /^[a-zA-Z0-9_, ]+$/;

  // ===============================
  // ✅ UTC HELPERS (FINAL & SAFE)
  // ===============================

  // UTC ISO → datetime-local value (NO local conversion)
  const utcToInputUTC = (utc) => (utc ? utc.slice(0, 16) : "");

  // datetime-local → UTC ISO
  const inputUTCToISO = (value) => {
    const d = new Date(value + ":00Z");
    return d.toISOString();
  };

  const formatUTCNow = () =>
    new Date().toISOString().replace("T", " ").slice(0, 19) + " UTC";

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

  // 💾 Save Task (PURE UTC)
  const handleSave = () => {
    if (!task.trim()) return showError("Task is required");
    if (!TASK_REGEX.test(task))
      return showError("Invalid task format. Use letters, numbers, _ , only");
    if (!reminder || !finish)
      return showError("Reminder & Finish required");

    const rUTC = inputUTCToISO(reminder);
    const fUTC = inputUTCToISO(finish);

    const rUTCms = Date.parse(rUTC);
    const fUTCms = Date.parse(fUTC);
    const nowUTCms = Date.now();
    const nowUTC = new Date().toISOString();

    if (rUTCms < nowUTCms || fUTCms < nowUTCms) {
      return showError(
        `Selected time is in the past.\nCurrent UTC time: ${formatUTCNow()}`
      );
    }

    if (rUTCms >= fUTCms)
      return showWarning("Reminder must be before Finish time");

    let updatedTasks;

    if (editId) {
      updatedTasks = tasks.map(t =>
        t.id === editId
          ? { ...t, text: task, reminder: rUTC, finish: fUTC, updatedAt: nowUTC }
          : t
      );
      showSuccess("Task updated successfully");
    } else {
      updatedTasks = [
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
      showSuccess("Task added successfully");
    }

    saveTasks(updatedTasks);
    setShowModal(false);
  };

  // ✏️ Edit (UTC SAFE)
  const handleEdit = (t) => {
    if (!user) {
      showInfo("Login required");
      navigate("/login");
      return;
    }

    setEditId(t.id);
    setTask(t.text);
    setReminder(utcToInputUTC(t.reminder));
    setFinish(utcToInputUTC(t.finish));
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

  // 🕒 UTC formatter
  const formatUTC = (date) => {
    if (!date) return "-";
    const d = new Date(date);
    return timeFormat === 24
      ? d.toISOString().replace("T", " ").slice(0, 19) + " UTC"
      : d.toLocaleString("en-US", { timeZone: "UTC", hour12: true }) + " UTC";
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
            <Button onClick={handleAddClick}>Add Task</Button>

            <Dropdown className="w-100 w-md-auto">
              <Dropdown.Toggle variant="outline-primary" className="w-100">
                {statusFilter === "all" && "All"}
                {statusFilter === "upcoming" && "Upcoming"}
                {statusFilter === "reminder" && "Reminder"}
                {statusFilter === "finished" && "Finished"}
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item onClick={() => setStatusFilter("all")}>
                  All
                </Dropdown.Item>
                <Dropdown.Item onClick={() => setStatusFilter("upcoming")}>
                  Upcoming
                </Dropdown.Item>
                <Dropdown.Item onClick={() => setStatusFilter("reminder")}>
                  Reminder
                </Dropdown.Item>
                <Dropdown.Item onClick={() => setStatusFilter("finished")}>
                  Finished
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            <Form.Check
              type="switch"
              label={timeFormat === 24 ? "24 Hour" : "12 Hour"}
              checked={timeFormat === 24}
              onChange={() => setTimeFormat(p => (p === 24 ? 12 : 24))}
            />
          </div>
        </div>
      )}
      {getFilteredTasks().length === 0 ? (
        <div className="text-center py-4">
          <h6 className="text-muted">
            No {statusFilter !== "all" ? statusFilter : ""} tasks found
          </h6>
        </div>
      ) : (
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

      <Modal
        show={showModal}
        centered
        backdrop="static"
        onHide={() => setShowModal(false)}
      >        <Modal.Header closeButton>
          <Modal.Title>{editId ? "Edit Task" : "Add Task"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Task Name</Form.Label>
              <Form.Control
                value={task}
                onChange={e => TASK_REGEX.test(e.target.value) && setTask(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Reminder Date & Time (UTC)</Form.Label>
              <Form.Control
                type="datetime-local"
                value={reminder}
                onChange={e => setReminder(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Finish Date & Time (UTC)</Form.Label>
              <Form.Control
                type="datetime-local"
                min={reminder}
                value={finish}
                onChange={e => setFinish(e.target.value)}
              />
            </Form.Group>
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
