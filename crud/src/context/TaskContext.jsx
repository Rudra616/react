import { createContext, useContext, useEffect, useState } from "react";
import AES from "crypto-js/aes";
import Utf8 from "crypto-js/enc-utf8";
import { useAuth } from "./AuthContext";

const TaskContext = createContext();
const secretKey = "my_super_secret_key";

export const useTasks = () => useContext(TaskContext);

export const TaskProvider = ({ children }) => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);

  // 🔓 Load tasks when user changes
  useEffect(() => {
    if (!user) {
      setTasks([]);
      return;
    }

    const encrypted = localStorage.getItem(`tasks_${user.email}`);
    if (!encrypted) {
      setTasks([]);
      return;
    }

    try {
      const bytes = AES.decrypt(encrypted, secretKey);
      setTasks(JSON.parse(bytes.toString(Utf8)));
    } catch {
      setTasks([]);
    }
  }, [user]);

  // Save tasks
  const saveTasks = (updated) => {
    setTasks(updated);
    const encrypted = AES.encrypt(
      JSON.stringify(updated),
      secretKey
    ).toString();
    localStorage.setItem(`tasks_${user.email}`, encrypted);
  };

  return (
    <TaskContext.Provider value={{ tasks, saveTasks }}>
      {children}
    </TaskContext.Provider>
  );
};
