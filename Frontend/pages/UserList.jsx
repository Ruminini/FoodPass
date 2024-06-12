import { StyleSheet, Text, TextInput, View } from "react-native";
import React, { useEffect, useState } from "react";
import MenuList from "../components/MenuList";
import BackButton from "../components/BackButton";
import { getGuests, getValidMembers } from "../service_db/DBQuerys";
import UserItem from "../components/UserItem";
import Add from "../assets/svg/add.svg";
import TabIcon from "../components/TabIcon";

export default function UserList({ data, goTo }) {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [filter, setFilter] = useState('');
  useEffect(() => {
    const fetchUsers = async () => {
      let allUsers = await (data.guests ?
        getGuests() :
        getValidMembers());
      allUsers = allUsers.filter(user => !user.code?.endsWith('0000'));
      if (data.guests) {
        allUsers.sort((a, b) => a.member_code > b.member_code ? 1 : -1);
      } else {
        allUsers.sort((a, b) => a.last_name.localeCompare(b.last_name, 'en', { sensitivity: 'base' }));
        allUsers.sort((a, b) => a.name.localeCompare(b.name, 'en', { sensitivity: 'base' }));
      }
      allUsers.sort((a, b) => a.state > b.state ? 1 : a.state == b.state ? 0 : -1);
      setUsers(allUsers);
    }
    fetchUsers();
  }, []);

  useEffect(() => {
    setFilteredUsers(users.filter(user => {
      const lowFilter = filter.toLowerCase()
      return (
        data.guests ?
          user.member_code.includes(lowFilter) :
          user.code.includes(lowFilter) || 
          user.name.toLowerCase().includes(lowFilter) || 
          user.last_name.toLowerCase().includes(lowFilter)
      )
    }))
  }, [users, filter]);

  return (
    <View style={{flex: 1, position: "relative"}}>
      <TextInput
          style={{ height: 75, backgroundColor: 'white', elevation: 2, padding: 10, marginHorizontal: 75, paddingHorizontal: 20, borderRadius: 25, fontSize: 20, marginTop: 20 }}
          onChangeText={setFilter}
          value={filter}
          placeholder="Buscar..."
        />
      <MenuList>
        {filteredUsers.length === 0 ? <Text>No hay usuarios</Text> : filteredUsers.map((user, index) => (
          data.guests ?
          <UserItem key={index} name={user.member_code.slice(0, 8)} id={"Valido hasta: "+user.expiration_date} inactive={user.state != "A"} onPress={() => goTo("ManageGuests", {user}, () => goTo("UserList", data))} /> :
          <UserItem key={index} name={user.name + " " + user.last_name} id={user.code} onPress={() => goTo("ManageMembers", {user}, () => {goTo("UserList")})} inactive={user.state != "A"}/>
        ))}
      </MenuList>
      <BackButton onPress={() => goTo("Admin")} />
      <TabIcon
        svg={<Add fill="#007bff" />}
        onPress={() => goTo(data.guests ? "ManageGuests" : "ManageMembers", {}, () => {goTo("UserList", data)})}
        style={ {padding: 10, height:  "10%", position: "absolute", right: 10, bottom: 10} }
      />
    </View>
  );
}

// const styles = StyleSheet.create({});
