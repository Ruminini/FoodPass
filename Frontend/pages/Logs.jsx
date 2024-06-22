import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import MenuList from "../components/MenuList";
import UserItem from "../components/UserItem";
import BackButton from "../components/BackButton";
import { getLoginLogsArr } from "../service_db/DBQuerys";

export default function Logs({ goTo }) {
  const [logs, setLogs] = useState([]);
  useEffect(() => {
    getLoginLogsArr()
    .then((data) => setLogs(data.reverse()));
  }, []);
  return (
    <View style={{ flex: 1, position: "relative" }}>
      <MenuList>
        {logs.length > 0 ?
          logs.map((log, index) => (
            <UserItem
              key={index}
              name={log.user_id}
              id={log.create_date}
            />
          )) :
          <Text style={{ textAlign: "center" }}>Todavia no hay logs</Text>
        }
      </MenuList>
      <BackButton onPress={() => goTo("Admin")} />
    </View>
  );
}
