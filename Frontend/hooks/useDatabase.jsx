import { useState, useEffect } from "react";
import { initializeDatabase, insertUser, getUsers } from "../services/Database";

//Este hook proporciona funciones para interactuar con la base de datos desde otros componentes.

const useDatabase = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    initializeDatabase();
  }, []);

  //Insertar usuario NO ADMIN
  const addUser = async (member_code, hashed_pass, salt) => {
    await insertUser(member_code, hashed_pass, salt);
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
