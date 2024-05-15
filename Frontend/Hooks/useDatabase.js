import { useState, useEffect } from "react";
import { initializeDatabase, insertUser, getUsers } from "../Services/Database";

//Este hook proporciona funciones para interactuar con la base de datos desde otros componentes.

const useDatabase = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    initializeDatabase();
  }, []);

  const addUser = async (nombre, apellido) => {
    await insertUser(nombre, apellido);
    const updatedUsers = await getUsers();
    setUsers(updatedUsers);
  };

  const fetchUsers = async () => {
    const usersData = await getUsers();
    setUsers(usersData);
  };

  return { users, addUser, fetchUsers };
};

export default useDatabase;
