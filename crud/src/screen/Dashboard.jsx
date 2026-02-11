import React, { useEffect, useState } from "react";
import { Card, Row, Col } from "react-bootstrap";
import { useAuth } from "../context/AuthContext";
import { useTasks } from "../context/TaskContext";

import { useNavigate } from "react-router-dom";

const secretKey = "my_super_secret_key";

const Dashboard = () => {
  const { user } = useAuth();
  const { tasks } = useTasks();
  const navigate = useNavigate();

  const [counts, setCounts] = useState({ upcoming: 0, reminder: 0, finished: 0 });
  const [display, setDisplay] = useState({ upcoming: 0, reminder: 0, finished: 0 });

  const updateCounts = () => {
    if (!user) return;

    let u = 0, r = 0, f = 0;
    const now = new Date().toISOString();

    tasks.forEach(t => {
      if (t.finish <= now) f++;
      else if (t.reminder <= now) r++;
      else u++;
    });

    setCounts({ upcoming: u, reminder: r, finished: f });
  };

  // Live update every 15s
useEffect(() => {
  updateCounts();
}, [user, tasks]);


  // Animate count
  useEffect(() => {
    Object.keys(counts).forEach(key => {
      let start = 0;
      const end = counts[key];
      if (end === 0) {
        setDisplay(p => ({ ...p, [key]: 0 }));
        return;
      }
      const interval = setInterval(() => {
        start++;
        setDisplay(p => ({ ...p, [key]: start }));
        if (start >= end) clearInterval(interval);
      }, 25);
    });
  }, [counts]);

  // Navigate to login
  const handleLoginClick = () => {
    navigate("/login");
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">
        Dashboard – <span className="text-primary">{user?.name || "Guest"}</span>
      </h2>

      {!user ? (
        <Card className="shadow text-center border-info mb-4">
          <Card.Body>
            <Card.Title>Welcome, Guest!</Card.Title>
            <p>Please login to view and manage your tasks.</p>
            <span
              onClick={handleLoginClick}
              style={{ color: "blue", textDecoration: "underline", cursor: "pointer" }}
            >
              Login here
            </span>
          </Card.Body>
        </Card>
      ) : (
        <Row className="g-4">
          <Col md={4}>
            <Card className="shadow text-center border-primary">
              <Card.Body>
                <Card.Title className="text-primary">Upcoming Tasks</Card.Title>
                <h1>{display.upcoming}</h1>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="shadow text-center border-warning">
              <Card.Body>
                <Card.Title className="text-warning">Reminder Due</Card.Title>
                <h1>{display.reminder}</h1>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="shadow text-center border-danger">
              <Card.Body>
                <Card.Title className="text-danger">Finished / Expired</Card.Title>
                <h1>{display.finished}</h1>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
    </div>
  );
};

export default Dashboard;
