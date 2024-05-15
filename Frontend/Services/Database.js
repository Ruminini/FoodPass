import * as SQLite from "expo-sqlite";

//Este archivo contiene la lógica para crear y administrar la base de datos SQLite.

const db = SQLite.openDatabase("FoodPass.db");

export const initializeDatabase = () => {
  db.transaction((tx) => {
    tx.executeSql(
      "CREATE TABLE IF NOT EXISTS usuario (id INTEGER PRIMARY KEY AUTOINCREMENT, nombre TEXT NOT NULL, apellido TEXT NOT NULL)",
      [],
      (tx, results) => {
        console.log("Tabla usuario creada correctamente");
      },
      (tx, error) => {
        console.error("Error al crear la tabla usuario:", error);
      }
    );
  });
};

export const insertUser = (nombre, apellido) => {
  db.transaction((tx) => {
    tx.executeSql(
      "INSERT INTO usuario (nombre, apellido) VALUES (?, ?)",
      [nombre, apellido],
      (tx, results) => {
        console.log("Usuario insertado correctamente");
      },
      (tx, error) => {
        console.error("Error al insertar usuario:", error);
      }
    );
  });
};

export const getUsers = () => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM usuario",
        [],
        (tx, results) => {
          const users = results.rows._array;
          resolve(users);
        },
        (tx, error) => {
          reject(error);
        }
      );
    });
  });
};
