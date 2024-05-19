import * as FileSystem from "expo-file-system";
import * as SQLite from "expo-sqlite";

//Este archivo contiene la lógica para crear y administrar la base de datos SQLite.

const db = SQLite.openDatabase("FoodPass.db");
const dbPath = `${FileSystem.documentDirectory}SQLite/FoodPass.db`;

console.log("Database Path:", dbPath);
export const initializeDatabase = () => {
  db.transaction((tx) => {
    {
      tx.executeSql(
        "PRAGMA foreign_keys = ON;",
        [],
        (_, { rows: { _array } }) => {
          console.log(`Enable foreign keys result: ${JSON.stringify(_array)}`);
        },
        ({}, error) => {
          console.log(`Enable foreign keys error: ${error}`);
        }
      );
    }
    {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS type_user (
          code INTEGER PRIMARY KEY AUTOINCREMENT, 
          name TEXT NOT NULL UNIQUE,  
          create_date TEXT NOT NULL, 
          last_update TEXT NOT NULL, 
          state TEXT DEFAULT 'A')`,
        [],
        (tx, results) => {
          console.log("Tabla type_user creada correctamente", results);
        },
        (tx, error) => {
          console.error("Error al crear la tabla type_user:", error);
        }
      );
    }
    {
      tx.executeSql(
        `INSERT OR IGNORE INTO type_user (name, create_date, last_update, state) VALUES ('Admin', ?, ?, 'A')`,
        [new Date().toDateString(), new Date().toDateString()],
        (tx, results) => {
          console.log("Insert en type_user correctamente", results);
        },
        (tx, error) => {
          console.error("Error al insertar datos en tabla type_user:", error);
        }
      );
    }
    {
      tx.executeSql(
        `INSERT OR IGNORE INTO type_user (name, create_date, last_update, state) VALUES ('general', ?, ?, 'A')`,
        [new Date().toDateString(), new Date().toDateString()],
        (tx, results) => {
          console.log("Insert en type_user correctamente", results);
        },
        (tx, error) => {
          console.error(
            new Date().toDateString(),
            "Error al insertar datos en tabla type_user:",
            error
          );
        }
      );
    }
    {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS valid_member (
          code TEXT PRIMARY KEY NOT NULL, 
          name TEXT NOT NULL, 
          last_name TEXT NOT NULL, 
          create_date TEXT NOT NULL, 
          last_update TEXT NOT NULL, 
          state TEXT DEFAULT 'A')`,
        [],
        (tx, results) => {
          console.log("Tabla valid_member creada correctamente", results);
        },
        (tx, error) => {
          console.error("Error al crear la tabla usuario:", error);
        }
      );
    }
    {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS user (
          member_code TEXT PRIMARY KEY NOT NULL, 
          type_code INTEGER NOT NULL,
          hashed_pass TEXT NOT NULL, 
          salt TEXT NOT NULL, 
          state TEXT DEFAULT 'A',
          FOREIGN KEY(type_code) REFERENCES type_user(code));`,
        [],
        (tx, results) => {
          console.log("Tabla user creada correctamente", results);
        },
        (tx, error) => {
          console.error("Error al crear la tabla user:", error);
        }
      );
    }
    {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS face (
          id INTEGER PRIMARY KEY AUTOINCREMENT, 
          user_id TEXT NOT NULL,
          descriptor TEXT NOT NULL,
          create_date TEXT NOT NULL, 
          state TEXT DEFAULT 'A',
          FOREIGN KEY(user_id) REFERENCES user(member_code));`,
        [],
        (tx, results) => {
          console.log("Tabla face creada correctamente", results);
        },
        (tx, error) => {
          console.error("Error al crear la tabla face:", error);
        }
      );
    }
    {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS logs_login (
          id INTEGER PRIMARY KEY AUTOINCREMENT, 
          user_id TEXT NOT NULL,
          create_date TEXT NOT NULL, 
          FOREIGN KEY(user_id) REFERENCES user(member_code));`,
        [],
        (tx, results) => {
          console.log("Tabla logs_login creada correctamente", results);
        },
        (tx, error) => {
          console.error("Error al crear la tabla logs_login:", error);
        }
      );
    }
    {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS type_food (
          code INTEGER PRIMARY KEY AUTOINCREMENT, 
          name TEXT NOT NULL UNIQUE,
          description TEXT,
          create_date TEXT NOT NULL,
          last_update TEXT NOT NULL, 
          state TEXT DEFAULT 'A' );`,
        [],
        (tx, results) => {
          console.log("Tabla type_food creada correctamente", results);
        },
        (tx, error) => {
          console.error("Error al crear la tabla type_food", error);
        }
      );
    }
    {
      tx.executeSql(
        `INSERT OR IGNORE INTO type_food (name, description, create_date, last_update, state) VALUES ('Plato Principal', 'Plato Principal', ?, ?, 'A')`,
        [new Date().toDateString(), new Date().toDateString()],
        (tx, results) => {
          console.log("Insert en type_food correctamente", results);
        },
        (tx, error) => {
          console.error(
            new Date().toDateString(),
            "Error al insertar datos comida principal en tabla type_food:",
            error
          );
        }
      );
    }
    {
      tx.executeSql(
        `INSERT OR IGNORE INTO type_food (name, description, create_date, last_update, state) VALUES ('Bebida', 'Bebida', ?, ?, 'A')`,
        [new Date().toDateString(), new Date().toDateString()],
        (tx, results) => {
          console.log("Insert en type_food correctamente", results);
        },
        (tx, error) => {
          console.error(
            new Date().toDateString(),
            "Error al insertar datos de bebida en tabla type_food:",
            error
          );
        }
      );
    }
    {
      tx.executeSql(
        `INSERT OR IGNORE INTO type_food (name, description, create_date, last_update, state) VALUES ('Postre', 'Postre', ?, ?, 'A')`,
        [new Date().toDateString(), new Date().toDateString()],
        (tx, results) => {
          console.log("Insert en type_food correctamente", results);
        },
        (tx, error) => {
          console.error(
            new Date().toDateString(),
            "Error al insertar datos de postre en tabla type_food:",
            error
          );
        }
      );
    }
    {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS type_food_restriction (
          code INTEGER PRIMARY KEY AUTOINCREMENT, 
          name TEXT NOT NULL UNIQUE,
          description TEXT,
          create_date TEXT NOT NULL,
          last_update TEXT NOT NULL, 
          state TEXT DEFAULT 'A' );`,
        [],
        (tx, results) => {
          console.log(
            "Tabla type_food_restriction creada correctamente",
            results
          );
        },
        (tx, error) => {
          console.error("Error al crear la tabla type_food_restriction", error);
        }
      );
    }
    {
      tx.executeSql(
        `INSERT OR IGNORE INTO type_food_restriction (name, description, create_date, last_update, state) VALUES ('Vegetariano', 'Alimento apto para dieta vegetariana', ?, ?, 'A')`,
        [new Date().toDateString(), new Date().toDateString()],
        (tx, results) => {
          console.log("Insert en type_food_restriction correctamente", results);
        },
        (tx, error) => {
          console.error(
            new Date().toDateString(),
            "Error al insertar datos de vegetariano en tabla type_food_restriction",
            error
          );
        }
      );
    }
    {
      tx.executeSql(
        `INSERT OR IGNORE INTO type_food_restriction (name, description, create_date, last_update, state) VALUES ('Vegano', 'Alimento apto para dieta vegana', ?, ?, 'A')`,
        [new Date().toDateString(), new Date().toDateString()],
        (tx, results) => {
          console.log("Insert en type_food_restriction correctamente", results);
        },
        (tx, error) => {
          console.error(
            new Date().toDateString(),
            "Error al insertar datos de vegano en tabla type_food_restriction",
            error
          );
        }
      );
    }
    {
      tx.executeSql(
        `INSERT OR IGNORE INTO type_food_restriction (name, description, create_date, last_update, state) VALUES ('Celiaco', 'Alimento apto para dieta sin TACC', ?, ?, 'A')`,
        [new Date().toDateString(), new Date().toDateString()],
        (tx, results) => {
          console.log("Insert en type_food_restriction correctamente", results);
        },
        (tx, error) => {
          console.error(
            new Date().toDateString(),
            "Error al insertar datos de celiaco en tabla type_food_restriction",
            error
          );
        }
      );
    }
    {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS order_state (
          code INTEGER PRIMARY KEY AUTOINCREMENT, 
          description TEXT,
          create_date TEXT NOT NULL,
          last_update TEXT NOT NULL, 
          state TEXT DEFAULT 'A' );`,
        [],
        (tx, results) => {
          console.log("Tabla order_state creada correctamente", results);
        },
        (tx, error) => {
          console.error("Error al crear la tabla order_state", error);
        }
      );
    }
    {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS menu (
          id INTEGER PRIMARY KEY AUTOINCREMENT, 
          create_date TEXT NOT NULL);`,
        [],
        (tx, results) => {
          console.log("Tabla menu creada correctamente", results);
        },
        (tx, error) => {
          console.error("Error al crear la tabla menu", error);
        }
      );
    }
    {
      //se usan comillas para crear la tabla order ("order"), porque order es palabra reservada y si no tiene las comillas tira error al crear la tabla
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS "order" ( 
          user_id TEXT NOT NULL,
          create_date TEXT NOT NULL,
          order_state_code INTEGER NOT NULL,
          menu_id INTEGER NOT NULL,
          FOREIGN KEY(user_id) REFERENCES user(member_code),
          FOREIGN KEY(order_state_code) REFERENCES order_state(code),
          FOREIGN KEY(menu_id) REFERENCES menu(id),
          PRIMARY KEY (user_id, create_date));`,
        [],
        (tx, results) => {
          console.log("Tabla order creada correctamente", results);
        },
        (tx, error) => {
          console.error("Error al crear la tabla order", error);
        }
      );
    }
    {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS food ( 
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          type_code INTEGER NOT NULL,
          name TEXT NOT NULL UNIQUE,
          description TEXT NOT NULL,
          price REAL DEFAULT 0,
          stock INTEGER DEFAULT 1000000,
          create_date TEXT NOT NULL, 
          last_update TEXT NOT NULL, 
          state TEXT DEFAULT 'A',
          FOREIGN KEY(type_code) REFERENCES type_food(code));`,
        [],
        (tx, results) => {
          console.log("Tabla food creada correctamente", results);
        },
        (tx, error) => {
          console.error("Error al crear la tabla food", error);
        }
      );
    }
    {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS relation_food_menu ( 
          id_menu INTEGER NOT NULL,
          id_food INTEGER NOT NULL,
          create_date TEXT NOT NULL, 
          last_update TEXT NOT NULL, 
          state TEXT DEFAULT 'A',
          FOREIGN KEY(id_food) REFERENCES food(id)
          FOREIGN KEY(id_menu) REFERENCES menu(id)
          PRIMARY KEY (id_menu, id_food));`,
        [],
        (tx, results) => {
          console.log("Tabla relation_food_menu creada correctamente", results);
        },
        (tx, error) => {
          console.error("Error al crear la tabla relation_food_menu", error);
        }
      );
    }
    {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS relation_restriction_food ( 
          id_food INTEGER NOT NULL,
          code_restriction INTEGER NOT NULL,
          create_date TEXT NOT NULL, 
          last_update TEXT NOT NULL, 
          state TEXT DEFAULT 'A',
          FOREIGN KEY(id_food) REFERENCES food(id)
          FOREIGN KEY(code_restriction) REFERENCES type_food_restriction(code)
          PRIMARY KEY (id_food, code_restriction));`,
        [],
        (tx, results) => {
          console.log(
            "Tabla relation_restriction_food creada correctamente",
            results
          );
        },
        (tx, error) => {
          console.error(
            "Error al crear la tabla relation_restriction_food",
            error
          );
        }
      );
    }

    //Chequear inserts
    {
      tx.executeSql(`SELECT * FROM type_user;`, [], (_, { rows }) => {
        console.log(rows._array);
      });
    }
    {
      tx.executeSql(`SELECT * FROM type_food;`, [], (_, { rows }) => {
        console.log(rows._array);
      });
    }
    {
      tx.executeSql(
        `SELECT * FROM type_food_restriction;`,
        [],
        (_, { rows }) => {
          console.log(rows._array);
        }
      );
    }
  });
};

// export const insertUser = (nombre, apellido) => {
//   db.transaction((tx) => {
//     tx.executeSql(
//       "INSERT INTO usuario (nombre, apellido) VALUES (?, ?)",
//       [nombre, apellido],
//       (tx, results) => {
//         console.log("Usuario insertado correctamente");
//       },
//       (tx, error) => {
//         console.error("Error al insertar usuario:", error);
//       }
//     );
//   });
// };

// export const getUsers = () => {
//   return new Promise((resolve, reject) => {
//     db.transaction((tx) => {
//       tx.executeSql(
//         "SELECT * FROM usuario",
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
