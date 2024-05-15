import React, { useState, useEffect } from "react";
import UserList from "../components/UsersList";
import useDatabase from "../Hooks/useDatabase";
import { Text, View } from "react-native";

export default function HomeScreen() {
  const { users, fetchUsers } = useDatabase();

  useEffect(() => {
    fetchUsers();
  }, []);

  //   return (
  //     <div>
  //       <h1>Lista de usuarios</h1>
  //       <UserList users={users} />
  //     </div>
  //   );
  return (
    <View style={{ flex: 1 }}>
      <Text>Lista de Usuarios</Text>
    </View>
  );
}
