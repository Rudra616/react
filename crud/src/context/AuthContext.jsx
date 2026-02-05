import { createContext, useContext, useState, useEffect } from "react";
import AES from "crypto-js/aes";
import Utf8 from "crypto-js/enc-utf8";

const AuthContext = createContext();
const secretKey = "my_super_secret_key"; // keep this secret

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUserEncrypted = localStorage.getItem("loggedInUser");
    if (storedUserEncrypted) {
      try {
        const bytes = AES.decrypt(storedUserEncrypted, secretKey);
        const decryptedUser = JSON.parse(bytes.toString(Utf8));
        setUser(decryptedUser);
      } catch (err) {
        console.error("Failed to decrypt logged in user", err);
      }
    }
  }, []);

  const login = (userData) => {
    const encryptedData = AES.encrypt(JSON.stringify(userData), secretKey).toString();
    localStorage.setItem("loggedInUser", encryptedData);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("loggedInUser");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
