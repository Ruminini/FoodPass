import db from "./DB";

//Inserta todos los datos de parametría. Ejecutar al iniciar junto con el initDatabase.
export const insertParameters = () => {
  db.transaction((tx) => {
    tx.executeSql(
      `INSERT OR IGNORE INTO type_user (name, create_date, last_update, state) VALUES ('Admin', ?, ?, 'A')`,
      [new Date().toString(), new Date().toString()],
      (tx, results) => {
        console.log("Insert en type_user correctamente", results);
      },
      (tx, error) => {
        console.error("Error al insertar datos en tabla type_user:", error);
      }
    );
    tx.executeSql(
      `INSERT OR IGNORE INTO type_user (name, create_date, last_update, state) VALUES ('general', ?, ?, 'A')`,
      [new Date().toString(), new Date().toString()],
      (tx, results) => {
        console.log("Insert en type_user correctamente", results);
      },
      (tx, error) => {
        console.error(
          new Date().toString(),
          "Error al insertar datos en tabla type_user:",
          error
        );
      }
    );
    tx.executeSql(
      `INSERT OR IGNORE INTO type_food (name, description, create_date, last_update, state) VALUES ('Plato Principal', 'Plato Principal', ?, ?, 'A')`,
      [new Date().toString(), new Date().toString()],
      (tx, results) => {
        console.log("Insert en type_food correctamente", results);
      },
      (tx, error) => {
        console.error(
          new Date().toString(),
          "Error al insertar datos comida principal en tabla type_food:",
          error
        );
      }
    );
    tx.executeSql(
      `INSERT OR IGNORE INTO type_food (name, description, create_date, last_update, state) VALUES ('Bebida', 'Bebida', ?, ?, 'A')`,
      [new Date().toString(), new Date().toString()],
      (tx, results) => {
        console.log("Insert en type_food correctamente", results);
      },
      (tx, error) => {
        console.error(
          new Date().toString(),
          "Error al insertar datos de bebida en tabla type_food:",
          error
        );
      }
    );
    tx.executeSql(
      `INSERT OR IGNORE INTO type_food (name, description, create_date, last_update, state) VALUES ('Postre', 'Postre', ?, ?, 'A')`,
      [new Date().toString(), new Date().toString()],
      (tx, results) => {
        console.log("Insert en type_food correctamente", results);
      },
      (tx, error) => {
        console.error(
          new Date().toString(),
          "Error al insertar datos de postre en tabla type_food:",
          error
        );
      }
    );
    tx.executeSql(
      `INSERT OR IGNORE INTO type_food_restriction (name, description, create_date, last_update, state) VALUES ('Vegetariano', 'Alimento apto para dieta vegetariana', ?, ?, 'A')`,
      [new Date().toString(), new Date().toString()],
      (tx, results) => {
        console.log("Insert en type_food_restriction correctamente", results);
      },
      (tx, error) => {
        console.error(
          new Date().toString(),
          "Error al insertar datos de vegetariano en tabla type_food_restriction",
          error
        );
      }
    );
    tx.executeSql(
      `INSERT OR IGNORE INTO type_food_restriction (name, description, create_date, last_update, state) VALUES ('Vegano', 'Alimento apto para dieta vegana', ?, ?, 'A')`,
      [new Date().toString(), new Date().toString()],
      (tx, results) => {
        console.log("Insert en type_food_restriction correctamente", results);
      },
      (tx, error) => {
        console.error(
          new Date().toString(),
          "Error al insertar datos de vegano en tabla type_food_restriction",
          error
        );
      }
    );
    tx.executeSql(
      `INSERT OR IGNORE INTO type_food_restriction (name, description, create_date, last_update, state) VALUES ('Celiaco', 'Alimento apto para dieta sin TACC', ?, ?, 'A')`,
      [new Date().toString(), new Date().toString()],
      (tx, results) => {
        console.log("Insert en type_food_restriction correctamente", results);
      },
      (tx, error) => {
        console.error(
          new Date().toString(),
          "Error al insertar datos de celiaco en tabla type_food_restriction",
          error
        );
      }
    );
    tx.executeSql(
      `INSERT OR IGNORE INTO order_state (description, create_date, last_update, state) VALUES ('Pendiente', ?, ?, 'A')`,
      [new Date().toString(), new Date().toString()],
      (tx, results) => {
        console.log("Insert en order_state correctamente", results);
      },
      (tx, error) => {
        console.error(
          new Date().toString(),
          "Error al insertar datos de Pendiente en tabla order_state",
          error
        );
      }
    );
    tx.executeSql(
      `INSERT OR IGNORE INTO order_state (description, create_date, last_update, state) VALUES ('Retirado', ?, ?, 'A')`,
      [new Date().toString(), new Date().toString()],
      (tx, results) => {
        console.log("Insert en order_state correctamente", results);
      },
      (tx, error) => {
        console.error(
          new Date().toString(),
          "Error al insertar datos de Retirado en tabla order_state",
          error
        );
      }
    );
    tx.executeSql(
      `INSERT OR IGNORE INTO order_state (description, create_date, last_update, state) VALUES ('Cancelado', ?, ?, 'A')`,
      [new Date().toString(), new Date().toString()],
      (tx, results) => {
        console.log("Insert en order_state correctamente", results);
      },
      (tx, error) => {
        console.error(
          new Date().toString(),
          "Error al insertar datos de Cancelado en tabla order_state",
          error
        );
      }
    );

    //Chequear Inserts de Parametrías

    tx.executeSql(`SELECT * FROM type_user;`, [], (_, { rows }) => {
      console.log(rows._array);
    });

    tx.executeSql(`SELECT * FROM type_food;`, [], (_, { rows }) => {
      console.log(rows._array);
    });

    tx.executeSql(`SELECT * FROM type_food_restriction;`, [], (_, { rows }) => {
      console.log(rows._array);
    });

    tx.executeSql(`SELECT * FROM order_state;`, [], (_, { rows }) => {
      console.log(rows._array);
    });
  });
};

//Insertar usuario en tabla user. Se utilizará para nuevos registros.
export const insertUser = (member_code, hashed_pass, salt) => {
  db.transaction((tx) => {
    tx.executeSql(
      "INSERT OR IGNORE INTO user (member_code, type_code, hashed_pass, salt, create_date, last_update, state) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [
        member_code,
        2,
        hashed_pass,
        salt,
        new Date().toString(),
        new Date().toString(),
        "A",
      ],
      (tx, results) => {
        console.log("Usuario insertado correctamente", results);
      },
      (tx, error) => {
        console.error("Error al insertar usuario:", error);
      }
    );
  });
};

//Pasando el legajo del usuario por parametro (member_code), la función retorna un array de los registros que existan en la tabla valid_member.
export const getValidMemberById = (member_code) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM valid_member WHERE code = ?",
        [member_code],
        (tx, results) => {
          const members = results.rows._array;
          resolve(members);
        },
        (tx, error) => {
          reject(error);
        }
      );
    });
  });
};

//Obtener listado de usuarios blanqueados (valid members)
export const getValidMembers = () => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM valid_member",
        [],
        (tx, results) => {
          const members = results.rows._array;
          resolve(members);
        },
        (tx, error) => {
          reject(error);
        }
      );
    });
  });
};

//Función para insertar miembro en la tabla valid_member (blanquear usuario)
export const insertValidMember = (code, name, last_name) => {
  db.transaction((tx) => {
    tx.executeSql(
      "INSERT OR IGNORE INTO valid_member (code, name, last_name, create_date, last_update, state) VALUES (?, ?, ?, ?, ?, ?)",
      [
        code,
        name,
        last_name,
        new Date().toString(),
        new Date().toString(),
        "A",
      ],
      (tx, results) => {
        console.log("Miembro blanqueado correctamente", results);
      },
      (tx, error) => {
        console.error("Error al blanquear miembro:", error);
      }
    );
  });
};

//Obtener usuario de la tabla user por id
export const getUserById = (member_code) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM user where member_code = ?",
        [member_code],
        (tx, results) => {
          const user = results.rows._array;
          resolve(user);
        },
        (tx, error) => {
          reject(error);
        }
      );
    });
  });
};

//Obtener listado de todos los usuarios de la tabla user
export const getUsers = () => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM user",
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

//Insertar descriptores para un usuario en la tabla face
export const insertFaceData = (user_id, descriptor) => {
  db.transaction((tx) => {
    tx.executeSql(
      "INSERT OR IGNORE INTO face (user_id, descriptor, create_date, state) VALUES (?, ?, ?, ?)",
      [user_id, descriptor, new Date().toString(), "A"],
      (tx, results) => {
        console.log(
          "Descriptor del usuario ",
          user_id,
          " insertado correctamente ",
          results
        );
      },
      (tx, error) => {
        console.error(
          "Error al insertar el descriptor del usuario ",
          user_id,
          error
        );
      }
    );
  });
};

//Obtener un listado de todos los descriptores de la tabla face
export const getAllDescriptors = () => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM face",
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

//Obtener todos los descriptores de un usuario por id de usuario
export const getDescriptorsById = (user_id) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM face WHERE user_id = ?",
        [user_id],
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
