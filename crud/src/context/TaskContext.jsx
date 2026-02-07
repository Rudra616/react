import { createContext, useContext, useEffect, useState } from "react";
import AES from "crypto-js/aes";
import Utf8 from "crypto-js/enc-utf8";
import SHA256 from "crypto-js/sha256";
import { useAuth } from "./AuthContext";

const TaskContext = createContext();
const secretKey = "my_super_secret_key";

export const useTasks = () => useContext(TaskContext);

export const TaskProvider = ({ children }) => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);

  // Generate a safe storage key
  const getStorageKey = (email) => `tasks_${SHA256(email).toString()}`;

  // 🔓 Load tasks when user changes
  useEffect(() => {
    if (!user) {
      setTasks([]);
      return;
    }

    const storageKey = getStorageKey(user.email);
    const encrypted = localStorage.getItem(storageKey);
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
    if (!user) return;
    setTasks(updated);
    const encrypted = AES.encrypt(JSON.stringify(updated), secretKey).toString();
    const storageKey = getStorageKey(user.email);
    localStorage.setItem(storageKey, encrypted);
  };

  return (
    <TaskContext.Provider value={{ tasks, saveTasks }}>
      {children}
    </TaskContext.Provider>
  );
};
