// import * as FileSystem from "expo-file-system";
// import * as SQLite from "expo-sqlite";

// //Este archivo contiene la lógica para crear y administrar la base de datos FoodPass.db en SQLite.

// let db;

// export const initializeDatabase = () => {
//   db = SQLite.openDatabase("FoodPass.db");
//   db.transaction((tx) => {
//     // {
//     //   //Se habilita el uso de claves foráneas en SQLite
//     //   tx.executeSql(
//     //     "PRAGMA foreign_keys = ON;",
//     //     [],
//     //     (_, { rows: { _array } }) => {
//     //       console.log(`Enable foreign keys result: ${JSON.stringify(_array)}`);
//     //     },
//     //     ({}, error) => {
//     //       console.log(`Enable foreign keys error: ${error}`);
//     //     }
//     //   );
//     // }
//     {
//       //Creacion de la tabla de parametría type_user
//       tx.executeSql(
//         `CREATE TABLE IF NOT EXISTS type_user (
//           code INTEGER PRIMARY KEY AUTOINCREMENT,
//           name TEXT NOT NULL UNIQUE,
//           create_date TEXT NOT NULL,
//           last_update TEXT NOT NULL,
//           state TEXT DEFAULT 'A')`,
//         [],
//         (tx, results) => {
//           console.log("Tabla type_user creada correctamente", results);
//         },
//         (tx, error) => {
//           console.error("Error al crear la tabla type_user:", error);
//         }
//       );
//     }
//     {
//       //Se insertan datos de parametría en la tabla type_user (Usuario Admin)
//       tx.executeSql(
//         `INSERT OR IGNORE INTO type_user (name, create_date, last_update, state) VALUES ('Admin', ?, ?, 'A')`,
//         [new Date().toString(), new Date().toString()],
//         (tx, results) => {
//           console.log("Insert en type_user correctamente", results);
//         },
//         (tx, error) => {
//           console.error("Error al insertar datos en tabla type_user:", error);
//         }
//       );
//     }
//     {
//       //Se insertan datos de parametría en la tabla type_user (Usuario General o "miembro". El que va a comprar la comprar la comida)
//       tx.executeSql(
//         `INSERT OR IGNORE INTO type_user (name, create_date, last_update, state) VALUES ('general', ?, ?, 'A')`,
//         [new Date().toString(), new Date().toString()],
//         (tx, results) => {
//           console.log("Insert en type_user correctamente", results);
//         },
//         (tx, error) => {
//           console.error(
//             new Date().toString(),
//             "Error al insertar datos en tabla type_user:",
//             error
//           );
//         }
//       );
//     }
//     {
//       // Se crea la tabla valid_member. Esta tabla se utiliza para saber si el usuario que se quiere registrar está "blanqueado" por la empresa para operar con nosotros.
//       tx.executeSql(
//         `CREATE TABLE IF NOT EXISTS valid_member (
//           code TEXT PRIMARY KEY NOT NULL,
//           name TEXT NOT NULL,
//           last_name TEXT NOT NULL,
//           create_date TEXT NOT NULL,
//           last_update TEXT NOT NULL,
//           state TEXT DEFAULT 'A')`,
//         [],
//         (tx, results) => {
//           console.log("Tabla valid_member creada correctamente", results);
//         },
//         (tx, error) => {
//           console.error("Error al crear la tabla usuario:", error);
//         }
//       );
//     }
//     {
//       //Se insertan datos de ejemplo en valid_member. El usuario 34985578-2024 quedaría blanqueado y podría registrarse en la aplicacion.
//       tx.executeSql(
//         `INSERT OR IGNORE INTO valid_member (code, name, last_name, create_date, last_update, state) VALUES ('34985578-2024', 'Fernando', 'Mossier', ?, ?, 'A')`,
//         [new Date().toString(), new Date().toString()],
//         (tx, results) => {
//           console.log("Insert en valid_member correctamente", results);
//         },
//         (tx, error) => {
//           console.error(
//             new Date().toString(),
//             "Error al insertar datos comida principal en tabla valid_member",
//             error
//           );
//         }
//       );
//     }
//     {
//       //Se insertan datos de ejemplo en valid_member. El usuario 12345678-4321 quedaría blanqueado y podría registrarse en la aplicacion.
//       tx.executeSql(
//         `INSERT OR IGNORE INTO valid_member (code, name, last_name, create_date, last_update, state) VALUES ('12345678-4321', 'Ejemplo', 'Olpmeje', ?, ?, 'A')`,
//         [new Date().toString(), new Date().toString()],
//         (tx, results) => {
//           console.log("Insert en valid_member correctamente", results);
//         },
//         (tx, error) => {
//           console.error(
//             new Date().toString(),
//             "Error al insertar datos comida principal en tabla valid_member",
//             error
//           );
//         }
//       );
//     }
//     {
//       // Creación de la tabla user. Contiene información del usuario, ya sea admin o miembro
//       tx.executeSql(
//         ` CREATE TABLE IF NOT EXISTS user (
//           member_code TEXT PRIMARY KEY,
//           type_code INTEGER NOT NULL,
//           hashed_pass TEXT NOT NULL,
//           salt TEXT NOT NULL,
//           create_date TEXT NOT NULL,
//           last_update TEXT NOT NULL,
//           state TEXT DEFAULT 'A'
//           --FOREIGN KEY(type_code) REFERENCES type_user(code)
//         );`,
//         [],
//         (tx, results) => {
//           console.log("USERRRR", "Tabla user creada correctamente", results);
//         },
//         (tx, error) => {
//           console.error("Error al crear la tabla user:", error);
//         }
//       );
//     }
//     {
//       // Creación de la tabla face. Almacena los descriptores de la cara de la persona que se registra para ser utilizado en el login con reconocimiento facial.
//       tx.executeSql(
//         `CREATE TABLE IF NOT EXISTS face (
//           id INTEGER PRIMARY KEY AUTOINCREMENT,
//           user_id TEXT NOT NULL,
//           descriptor TEXT NOT NULL UNIQUE,
//           create_date TEXT NOT NULL,
//           state TEXT DEFAULT 'A'
//           --FOREIGN KEY(user_id) REFERENCES user(member_code)
//         );`,
//         [],
//         (tx, results) => {
//           console.log("Tabla face creada correctamente", results);
//         },
//         (tx, error) => {
//           console.error("Error al crear la tabla face:", error);
//         }
//       );
//     }
//     {
//       //Creacion de la tabla logs_login. Cada vez que un usuario se loguea en la aplicación, queda registrado en esta tabla.
//       tx.executeSql(
//         `CREATE TABLE IF NOT EXISTS logs_login (
//           id INTEGER PRIMARY KEY AUTOINCREMENT,
//           user_id TEXT NOT NULL,
//           create_date TEXT NOT NULL
//           --FOREIGN KEY(user_id) REFERENCES user(member_code)
//         );`,
//         [],
//         (tx, results) => {
//           console.log("Tabla logs_login creada correctamente", results);
//         },
//         (tx, error) => {
//           console.error("Error al crear la tabla logs_login:", error);
//         }
//       );
//     }
//     {
//       //creación de la tabla de parametría type_food
//       tx.executeSql(
//         `CREATE TABLE IF NOT EXISTS type_food (
//           code INTEGER PRIMARY KEY AUTOINCREMENT,
//           name TEXT NOT NULL UNIQUE,
//           description TEXT,
//           create_date TEXT NOT NULL,
//           last_update TEXT NOT NULL,
//           state TEXT DEFAULT 'A' );`,
//         [],
//         (tx, results) => {
//           console.log("Tabla type_food creada correctamente", results);
//         },
//         (tx, error) => {
//           console.error("Error al crear la tabla type_food", error);
//         }
//       );
//     }
//     {
//       //Se insertan datos de parametría en la tabla type_food. (Plato principal)
//       tx.executeSql(
//         `INSERT OR IGNORE INTO type_food (name, description, create_date, last_update, state) VALUES ('Plato Principal', 'Plato Principal', ?, ?, 'A')`,
//         [new Date().toString(), new Date().toString()],
//         (tx, results) => {
//           console.log("Insert en type_food correctamente", results);
//         },
//         (tx, error) => {
//           console.error(
//             new Date().toString(),
//             "Error al insertar datos comida principal en tabla type_food:",
//             error
//           );
//         }
//       );
//     }
//     {
//       //Se insertan datos de parametría en la tabla type_food. (Bebida)
//       tx.executeSql(
//         `INSERT OR IGNORE INTO type_food (name, description, create_date, last_update, state) VALUES ('Bebida', 'Bebida', ?, ?, 'A')`,
//         [new Date().toString(), new Date().toString()],
//         (tx, results) => {
//           console.log("Insert en type_food correctamente", results);
//         },
//         (tx, error) => {
//           console.error(
//             new Date().toString(),
//             "Error al insertar datos de bebida en tabla type_food:",
//             error
//           );
//         }
//       );
//     }
//     {
//       //Se insertan datos de parametría en la tabla type_food. (Postre)
//       tx.executeSql(
//         `INSERT OR IGNORE INTO type_food (name, description, create_date, last_update, state) VALUES ('Postre', 'Postre', ?, ?, 'A')`,
//         [new Date().toString(), new Date().toString()],
//         (tx, results) => {
//           console.log("Insert en type_food correctamente", results);
//         },
//         (tx, error) => {
//           console.error(
//             new Date().toString(),
//             "Error al insertar datos de postre en tabla type_food:",
//             error
//           );
//         }
//       );
//     }
//     {
//       //creación de la tabla de parametría type_food_restriction.
//       tx.executeSql(
//         `CREATE TABLE IF NOT EXISTS type_food_restriction (
//           code INTEGER PRIMARY KEY AUTOINCREMENT,
//           name TEXT NOT NULL UNIQUE,
//           description TEXT,
//           create_date TEXT NOT NULL,
//           last_update TEXT NOT NULL,
//           state TEXT DEFAULT 'A' );`,
//         [],
//         (tx, results) => {
//           console.log(
//             "Tabla type_food_restriction creada correctamente",
//             results
//           );
//         },
//         (tx, error) => {
//           console.error("Error al crear la tabla type_food_restriction", error);
//         }
//       );
//     }
//     {
//       //Se insertan datos de parametría en la tabla type_food_restriction. (Vegetariano)
//       tx.executeSql(
//         `INSERT OR IGNORE INTO type_food_restriction (name, description, create_date, last_update, state) VALUES ('Vegetariano', 'Alimento apto para dieta vegetariana', ?, ?, 'A')`,
//         [new Date().toString(), new Date().toString()],
//         (tx, results) => {
//           console.log("Insert en type_food_restriction correctamente", results);
//         },
//         (tx, error) => {
//           console.error(
//             new Date().toString(),
//             "Error al insertar datos de vegetariano en tabla type_food_restriction",
//             error
//           );
//         }
//       );
//     }
//     {
//       //Se insertan datos de parametría en la tabla type_food_restriction. (Vegano)
//       tx.executeSql(
//         `INSERT OR IGNORE INTO type_food_restriction (name, description, create_date, last_update, state) VALUES ('Vegano', 'Alimento apto para dieta vegana', ?, ?, 'A')`,
//         [new Date().toString(), new Date().toString()],
//         (tx, results) => {
//           console.log("Insert en type_food_restriction correctamente", results);
//         },
//         (tx, error) => {
//           console.error(
//             new Date().toString(),
//             "Error al insertar datos de vegano en tabla type_food_restriction",
//             error
//           );
//         }
//       );
//     }
//     {
//       //Se insertan datos de parametría en la tabla type_food_restriction. (Celiaco)
//       tx.executeSql(
//         `INSERT OR IGNORE INTO type_food_restriction (name, description, create_date, last_update, state) VALUES ('Celiaco', 'Alimento apto para dieta sin TACC', ?, ?, 'A')`,
//         [new Date().toString(), new Date().toString()],
//         (tx, results) => {
//           console.log("Insert en type_food_restriction correctamente", results);
//         },
//         (tx, error) => {
//           console.error(
//             new Date().toString(),
//             "Error al insertar datos de celiaco en tabla type_food_restriction",
//             error
//           );
//         }
//       );
//     }
//     {
//       //Creación de la tabla de parametría order_state. Indica el estado de una orden.
//       tx.executeSql(
//         `CREATE TABLE IF NOT EXISTS order_state (
//           code INTEGER PRIMARY KEY AUTOINCREMENT,
//           description TEXT NOT NULL UNIQUE,
//           create_date TEXT NOT NULL,
//           last_update TEXT NOT NULL,
//           state TEXT DEFAULT 'A' );`,
//         [],
//         (tx, results) => {
//           console.log("Tabla order_state creada correctamente", results);
//         },
//         (tx, error) => {
//           console.error("Error al crear la tabla order_state", error);
//         }
//       );
//     }
//     {
//       //Se insertan datos de parametría en la tabla order_state. (Pendiente)
//       tx.executeSql(
//         `INSERT OR IGNORE INTO order_state (description, create_date, last_update, state) VALUES ('Pendiente', ?, ?, 'A')`,
//         [new Date().toString(), new Date().toString()],
//         (tx, results) => {
//           console.log("Insert en order_state correctamente", results);
//         },
//         (tx, error) => {
//           console.error(
//             new Date().toString(),
//             "Error al insertar datos de Pendiente en tabla order_state",
//             error
//           );
//         }
//       );
//     }
//     {
//       //Se insertan datos de parametría en la tabla order_state. (Retirado)
//       tx.executeSql(
//         `INSERT OR IGNORE INTO order_state (description, create_date, last_update, state) VALUES ('Retirado', ?, ?, 'A')`,
//         [new Date().toString(), new Date().toString()],
//         (tx, results) => {
//           console.log("Insert en order_state correctamente", results);
//         },
//         (tx, error) => {
//           console.error(
//             new Date().toString(),
//             "Error al insertar datos de Retirado en tabla order_state",
//             error
//           );
//         }
//       );
//     }
//     {
//       //Se insertan datos de parametría en la tabla order_state. (Cancelado)
//       tx.executeSql(
//         `INSERT OR IGNORE INTO order_state (description, create_date, last_update, state) VALUES ('Cancelado', ?, ?, 'A')`,
//         [new Date().toString(), new Date().toString()],
//         (tx, results) => {
//           console.log("Insert en order_state correctamente", results);
//         },
//         (tx, error) => {
//           console.error(
//             new Date().toString(),
//             "Error al insertar datos de Cancelado en tabla order_state",
//             error
//           );
//         }
//       );
//     }
//     {
//       //Creación de la tabla menu. Lleva un registro histórico de los menús pedidos
//       tx.executeSql(
//         `CREATE TABLE IF NOT EXISTS menu (
//           id INTEGER PRIMARY KEY AUTOINCREMENT,
//           create_date TEXT NOT NULL);`,
//         [],
//         (tx, results) => {
//           console.log("Tabla menu creada correctamente", results);
//         },
//         (tx, error) => {
//           console.error("Error al crear la tabla menu", error);
//         }
//       );
//     }
//     {
//       //Creación de la tabla order. Lleva un registro de las ordenes por usuario y fecha. Un usuario no puede hacer más de un pedido por día.
//       //se usan comillas para crear la tabla order ("order"), porque order es palabra reservada y si no tiene las comillas tira error al crear la tabla
//       tx.executeSql(
//         `CREATE TABLE IF NOT EXISTS "order" (
//           user_id TEXT NOT NULL,
//           create_date TEXT NOT NULL,
//           order_state_code INTEGER NOT NULL,
//           menu_id INTEGER NOT NULL,
//           --FOREIGN KEY(user_id) REFERENCES user(member_code),
//           --FOREIGN KEY(order_state_code) REFERENCES order_state(code),
//           --FOREIGN KEY(menu_id) REFERENCES menu(id),
//           PRIMARY KEY (user_id, create_date)
//         );`,
//         [],
//         (tx, results) => {
//           console.log("Tabla order creada correctamente", results);
//         },
//         (tx, error) => {
//           console.error("Error al crear la tabla order", error);
//         }
//       );
//     }
//     {
//       //creación de la tabla food.
//       tx.executeSql(
//         `CREATE TABLE IF NOT EXISTS food (
//           id INTEGER PRIMARY KEY AUTOINCREMENT,
//           type_code INTEGER NOT NULL,
//           name TEXT NOT NULL UNIQUE,
//           description TEXT NOT NULL,
//           price REAL DEFAULT 0,
//           stock INTEGER DEFAULT 1000000,
//           create_date TEXT NOT NULL,
//           last_update TEXT NOT NULL,
//           state TEXT DEFAULT 'A'
//           --FOREIGN KEY(type_code) REFERENCES type_food(code)
//         );`,
//         [],
//         (tx, results) => {
//           console.log("Tabla food creada correctamente", results);
//         },
//         (tx, error) => {
//           console.error("Error al crear la tabla food", error);
//         }
//       );
//     }
//     //TO-DO: ACA INSERTAR TODAS LAS COMIDAS QUE CORRESPONDAN EN LA TABLA FOOD
//     {
//       //Creación de la tabla de relación relation_food_menu. Establece un relación 1-1 entre las comidas y los menus.
//       tx.executeSql(
//         `CREATE TABLE IF NOT EXISTS relation_food_menu (
//           id_menu INTEGER NOT NULL,
//           id_food INTEGER NOT NULL,
//           create_date TEXT NOT NULL,
//           last_update TEXT NOT NULL,
//           state TEXT DEFAULT 'A',
//           --FOREIGN KEY(id_food) REFERENCES food(id)
//           --FOREIGN KEY(id_menu) REFERENCES menu(id)
//           PRIMARY KEY (id_menu, id_food)
//         );`,
//         [],
//         (tx, results) => {
//           console.log("Tabla relation_food_menu creada correctamente", results);
//         },
//         (tx, error) => {
//           console.error("Error al crear la tabla relation_food_menu", error);
//         }
//       );
//     }
//     {
//       //Creación de la tabla de relacion relation_restriction_food. Establece un relación 1-1 entre las comidas y sus tipos de restricciónes (vegetariana, vegana o celiaca).
//       tx.executeSql(
//         `CREATE TABLE IF NOT EXISTS relation_restriction_food (
//           id_food INTEGER NOT NULL,
//           code_restriction INTEGER NOT NULL,
//           create_date TEXT NOT NULL,
//           last_update TEXT NOT NULL,
//           state TEXT DEFAULT 'A',
//           --FOREIGN KEY(id_food) REFERENCES food(id)
//           --FOREIGN KEY(code_restriction) REFERENCES type_food_restriction(code)
//           PRIMARY KEY (id_food, code_restriction)
//         );`,
//         [],
//         (tx, results) => {
//           console.log(
//             "Tabla relation_restriction_food creada correctamente",
//             results
//           );
//         },
//         (tx, error) => {
//           console.error(
//             "Error al crear la tabla relation_restriction_food",
//             error
//           );
//         }
//       );
//     }
//     //Chequear inserts
//     {
//       tx.executeSql(`SELECT * FROM type_user;`, [], (_, { rows }) => {
//         console.log(rows._array);
//       });
//     }
//     {
//       tx.executeSql(`SELECT * FROM type_food;`, [], (_, { rows }) => {
//         console.log(rows._array);
//       });
//     }
//     {
//       tx.executeSql(
//         `SELECT * FROM type_food_restriction;`,
//         [],
//         (_, { rows }) => {
//           console.log(rows._array);
//         }
//       );
//     }
//     {
//       tx.executeSql(`SELECT * FROM valid_member;`, [], (_, { rows }) => {
//         console.log(rows._array);
//       });
//     }
//     {
//       tx.executeSql(`SELECT * FROM order_state;`, [], (_, { rows }) => {
//         console.log(rows._array);
//       });
//     }
//   });
// };

// //Insertar usuario en tabla user. Se utilizará para nuevos registros.
// export const insertUser = (member_code, hashed_pass, salt) => {
//   db.transaction((tx) => {
//     tx.executeSql(
//       "INSERT OR IGNORE INTO user (member_code, type_code, hashed_pass, salt, create_date, last_update, state) VALUES (?, ?, ?, ?, ?, ?, ?)",
//       [
//         member_code,
//         2,
//         hashed_pass,
//         salt,
//         new Date().toString(),
//         new Date().toString(),
//         "A",
//       ],
//       (tx, results) => {
//         console.log("Usuario insertado correctamente", results);
//       },
//       (tx, error) => {
//         console.error("Error al insertar usuario:", error);
//       }
//     );
//   });
// };

// //Pasando el legajo del usuario por parametro (member_code), la función retorna un array de los registros que existan en la tabla valid_member.
// export const getValidMemberById = (member_code) => {
//   return new Promise((resolve, reject) => {
//     db.transaction((tx) => {
//       tx.executeSql(
//         "SELECT * FROM valid_member WHERE code = ?",
//         [member_code],
//         (tx, results) => {
//           const members = results.rows._array;
//           resolve(members);
//         },
//         (tx, error) => {
//           reject(error);
//         }
//       );
//     });
//   });
// };

// //Obtener listado de usuarios blanqueados (valid members)
// export const getValidMembers = () => {
//   return new Promise((resolve, reject) => {
//     db.transaction((tx) => {
//       tx.executeSql(
//         "SELECT * FROM valid_member",
//         [],
//         (tx, results) => {
//           const members = results.rows._array;
//           resolve(members);
//         },
//         (tx, error) => {
//           reject(error);
//         }
//       );
//     });
//   });
// };

// //Función para insertar miembro en la tabla valid_member (blanquear usuario)
// export const insertValidMember = (code, name, last_name) => {
//   db.transaction((tx) => {
//     tx.executeSql(
//       "INSERT OR IGNORE INTO valid_member (code, name, last_name, create_date, last_update, state) VALUES (?, ?, ?, ?, ?, ?)",
//       [
//         code,
//         name,
//         last_name,
//         new Date().toString(),
//         new Date().toString(),
//         "A",
//       ],
//       (tx, results) => {
//         console.log("Miembro blanqueado correctamente", results);
//       },
//       (tx, error) => {
//         console.error("Error al blanquear miembro:", error);
//       }
//     );
//   });
// };

// //Obtener usuario de la tabla user por id
// export const getUserById = (member_code) => {
//   return new Promise((resolve, reject) => {
//     db.transaction((tx) => {
//       tx.executeSql(
//         "SELECT * FROM user where member_code = ?",
//         [member_code],
//         (tx, results) => {
//           const user = results.rows._array;
//           resolve(user);
//         },
//         (tx, error) => {
//           reject(error);
//         }
//       );
//     });
//   });
// };

// //Obtener listado de todos los usuarios de la tabla user
// export const getUsers = () => {
//   return new Promise((resolve, reject) => {
//     db.transaction((tx) => {
//       tx.executeSql(
//         "SELECT * FROM user",
//         [],
//         (tx, results) => {
//           const users = results.rows._array;
//           resolve(users);
//         },
//         (tx, error) => {
//           reject(error);
//         }
//       );
//     });
//   });
// };

// //Insertar descriptores para un usuario en la tabla face
// export const insertFaceData = (user_id, descriptor) => {
//   db.transaction((tx) => {
//     tx.executeSql(
//       "INSERT OR IGNORE INTO face (user_id, descriptor, create_date, state) VALUES (?, ?, ?, ?)",
//       [user_id, descriptor, new Date().toString(), "A"],
//       (tx, results) => {
//         console.log(
//           "Descriptor del usuario ",
//           user_id,
//           " insertado correctamente ",
//           results
//         );
//       },
//       (tx, error) => {
//         console.error(
//           "Error al insertar el descriptor del usuario ",
//           user_id,
//           error
//         );
//       }
//     );
//   });
// };

// //Obtener un listado de todos los descriptores de la tabla face
// export const getAllDescriptors = () => {
//   return new Promise((resolve, reject) => {
//     db.transaction((tx) => {
//       tx.executeSql(
//         "SELECT * FROM face",
//         [],
//         (tx, results) => {
//           const users = results.rows._array;
//           resolve(users);
//         },
//         (tx, error) => {
//           reject(error);
//         }
//       );
//     });
//   });
// };

// //Obtener todos los descriptores de un usuario por id de usuario
// export const getDescriptorsById = (user_id) => {
//   return new Promise((resolve, reject) => {
//     db.transaction((tx) => {
//       tx.executeSql(
//         "SELECT * FROM face WHERE user_id = ?",
//         [user_id],
//         (tx, results) => {
//           const users = results.rows._array;
//           resolve(users);
//         },
//         (tx, error) => {
//           reject(error);
//         }
//       );
//     });
//   });
// };
