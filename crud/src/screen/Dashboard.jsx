import React, { useEffect, useState } from "react";
import { Card, Row, Col } from "react-bootstrap";
import { useAuth } from "../context/AuthContext";
import { useTasks } from "../context/TaskContext";
import AES from "crypto-js/aes";
import Utf8 from "crypto-js/enc-utf8";

const secretKey = "my_super_secret_key";

const Dashboard = () => {
  const { user } = useAuth();
  const { tasks } = useTasks();

  const [counts, setCounts] = useState({ upcoming: 0, reminder: 0, finished: 0 });
  const [display, setDisplay] = useState({ upcoming: 0, reminder: 0, finished: 0 });

  const updateCounts = () => {
    if (!user) return;
    const encrypted = localStorage.getItem(`tasks_${user.email}`);
    if (!encrypted) return;

    try {
      const bytes = AES.decrypt(encrypted, secretKey);
      const tasks = JSON.parse(bytes.toString(Utf8));

      let u = 0, r = 0, f = 0;
      const now = new Date().toISOString();

      tasks.forEach(t => {
        if (t.finish <= now) f++;
        else if (t.reminder <= now) r++;
        else u++;
      });

      setCounts({ upcoming: u, reminder: r, finished: f });
    } catch { }
  };

  // Live update every 15s
  useEffect(() => {
    updateCounts();
    const timer = setInterval(updateCounts, 15000);
    return () => clearInterval(timer);
  }, [user]);

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

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Dashboard – <span className="text-primary">{user?.name}</span></h2>
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
    </div>
  );
};

export default Dashboard;
