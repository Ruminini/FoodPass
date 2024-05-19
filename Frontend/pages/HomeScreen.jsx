import React, { useState } from "react";
import { Button } from "react-native";
import useDatabase from "../hooks/useDatabase";

const HomeScreen = () => {
  const { addUser, fetchUsers } = useDatabase();
  const [memberCode, setMemberCode] = useState("");
  const [pass, setPass] = useState("");

  const handleAddUser = async () => {
    if (memberCode && pass) {
      await addUser(memberCode, pass, "test");
      fetchUsers(); // Actualizar la lista de usuarios
      setMemberCode(""); // Limpiar los campos de entrada
      setPass("");
    } else {
      alert("Por favor, ingrese el nombre y apellido del usuario");
    }
    return (
      <div>
        <h1>Lista de usuarios</h1>
        <UserList users={users} />
        <div>
          <input
            type="text"
            value={code}
            onChange={(e) => setMemberCode(e.target.value)}
            placeholder="Legajo"
          />
          <input
            type="text"
            value={apellido}
            onChange={(e) => setPass(e.target.value)}
            placeholder="Password"
          />
          <Button title="Agregar usuario" onPress={handleAddUser} />
        </div>
      </div>
    );
  };
};

export default HomeScreen;
