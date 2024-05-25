// import { useState, useEffect } from "react";
// import {
//   initializeDatabase,
//   insertUser,
//   getUsers,
//   getValidMember,
// } from "../service_db/Database";

// //Este hook proporciona funciones para interactuar con la base de datos desde otros componentes.

// const useDatabase = () => {
//   const [users, setUsers] = useState([]);
//   const [members, setMembers] = useState([]);

//   // useEffect(() => {
//   //   initializeDatabase();
//   // }, []);

//   //Insertar usuario NO ADMIN
//   const addUser = async (member_code, hashed_pass, salt) => {
//     await insertUser(member_code, hashed_pass, salt);
//     const updatedUsers = await getUsers();
//     setUsers(updatedUsers);
//   };

//   const fetchUsers = async () => {
//     const usersData = await getUsers();
//     setUsers(usersData);
//   };

//   const fetchMember = (member_code) => {
//     const membersData = getValidMember(member_code);
//     membersData.then((algo) => {
//       console.log("OTRO ACAAA", algo);
//     });
//     setMembers(membersData);
//   };

//   return { users, members, addUser, fetchUsers, fetchMember };
// };

// export default useDatabase;
