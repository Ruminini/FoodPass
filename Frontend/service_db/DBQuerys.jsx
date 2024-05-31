import db from "./DB";

//Funcion para obtener miembro valido mediante el id
export const getValidMemberById = (code) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM valid_member WHERE code = ?",
        [code],
        (tx, results) => {
          const member = results.rows._array;
          resolve(member);
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

//Obtener tipo de usuario de la tabla user por id
export const getTypeUserById = (member_code) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT type_code FROM user where member_code = ?",
        [member_code],
        (tx, results) => {
          const type_code = results.rows._array[0].type_code;
          resolve(type_code);
        },
        (tx, error) => {
          reject(error);
        }
      );
    });
  });
};

//Función para inactivar miembro en la tabla user
export const inactiveUserMember = (member_code) => {
  db.transaction((tx) => {
    tx.executeSql(
      "UPDATE user SET state = ?, last_update = ? WHERE member_code = ?",
      [
        "I",
        new Date().toString(),
        member_code
      ],
      (tx, results) => {
        console.log("Miembro usuario inactivado correctamente", member_code);
      },
      (tx, error) => {
        console.error("Error inactivar miembro usuario:", error);
      }
    );
  });
};

//Función para activar miembro en la tabla user
export const activeUserMember = (member_code) => {
  db.transaction((tx) => {
    tx.executeSql(
      "UPDATE user SET state = ?, last_update = ? WHERE member_code = ?",
      [
        "A",
        new Date().toString(),
        member_code
      ],
      (tx, results) => {
        console.log("Miembro usuario activado correctamente", member_code);
      },
      (tx, error) => {
        console.error("Error activar miembro usuario:", error);
      }
    );
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

//Obtener todos los alimentos
export const getAllFood = () => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM food",
        [],
        (tx, results) => {
          const foods = results.rows._array;
          resolve(foods);
        },
        (tx, error) => {
          reject(error);
        }
      );
    });
  });
};

//Obtener todos los alimentos activos y con stock
export const getAllFoodWithStockAndActive = () => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM food WHERE state = 'A' AND stock != 0",
        [],
        (tx, results) => {
          const foods = results.rows._array;
          resolve(foods);
        },
        (tx, error) => {
          reject(error);
        }
      );
    });
  });
};

//Obtener alimento por id
export const getFoodByID = (id_food) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM food WHERE id = ?",
        [id_food],
        (tx, results) => {
          const food = results.rows._array;
          resolve(food);
        },
        (tx, error) => {
          reject(error);
        }
      );
    });
  });
};

//Obtener id del alimento por nombre
export const getFoodIdByName = (food_name) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM food WHERE name = ?",
        [food_name],
        (tx, results) => {
          const food = results.rows._array[0].id; // Id del alimento
          resolve(food);
        },
        (tx, error) => {
          reject(error);
        }
      );
    });
  });
};

//Obtener todos los datos del alimento por nombre
export const getTotalDataFoodByName = (food_name) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM food WHERE name = ?",
        [food_name],
        (tx, results) => {
          const food = results.rows._array;
          resolve(food);
        },
        (tx, error) => {
          reject(error);
        }
      );
    });
  });
};

// Devuelve las diferentes relaciones de restricción que tienen las comidas de la db (vegano, vegetariano o celíaco)
export const getRelationOfFood = () => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM relation_restriction_food", [],
        (tx, results) => {
          const relations = results.rows._array;
          resolve(relations);
        },
        (tx, error) => {
          reject(error);
        }
      );
    });
  });
}

//INSERTAR PARAMETRIA INICIAL
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

//Función para insertar miembro en la tabla valid_member
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
        console.log("Miembro registrado correctamente", code);
      },
      (tx, error) => {
        console.error("Error al registrar miembro:", error);
      }
    );
  });
};

//Función para inactivar miembro en la tabla valid_member
export const inactiveValidMember = (code) => {
  db.transaction((tx) => {
    tx.executeSql(
      "UPDATE valid_member SET state = ?, last_update = ? WHERE code = ?",
      [
        "I",
        new Date().toString(),
        code
      ],
      (tx, results) => {
        console.log("Miembro valido inactivado correctamente", code);
      },
      (tx, error) => {
        console.error("Error inactivar miembro valido:", error);
      }
    );
  });
};

//Función para activar miembro en la tabla valid_member
export const activeValidMember = (code) => {
  db.transaction((tx) => {
    tx.executeSql(
      "UPDATE valid_member SET state = ?, last_update = ? WHERE code = ?",
      [
        "A",
        new Date().toString(),
        code
      ],
      (tx, results) => {
        console.log("Miembro valido activado correctamente", code);
      },
      (tx, error) => {
        console.error("Error activar miembro valido:", error);
      }
    );
  });
};

//Insertar usuario en tabla user. Se utilizará para nuevos registros.
export const insertUser = (member_code, type_code, hashed_pass, salt) => {
  db.transaction((tx) => {
    tx.executeSql(
      "INSERT OR IGNORE INTO user (member_code, type_code, hashed_pass, salt, create_date, last_update, state) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [
        member_code,
        type_code,
        hashed_pass,
        salt,
        new Date().toString(),
        new Date().toString(),
        "A",
      ],
      (tx, results) => {
        console.log("Usuario insertado correctamente", member_code);
      },
      (tx, error) => {
        console.error("Error al insertar usuario:", error);
      }
    );
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

//Función para inactivar miembro en la tabla face
export const inactiveFaceMember = (user_id) => {
  db.transaction((tx) => {
    tx.executeSql(
      "UPDATE face SET state = ? WHERE user_id = ?",
      [
        "I",
        user_id
      ],
      (tx, results) => {
        console.log("Rostro del miembro inactivado correctamente", user_id);
      },
      (tx, error) => {
        console.error("Error al inactivar rostro del miembro:", error);
      }
    );
  });
};

//Función para activar miembro en la tabla valid_member
export const activeFaceMember = (user_id) => {
  db.transaction((tx) => {
    tx.executeSql(
      "UPDATE face SET state = ? WHERE user_id = ?",
      [
        "A",
        user_id
      ],
      (tx, results) => {
        console.log("Rostro del miembro activado correctamente", user_id);
      },
      (tx, error) => {
        console.error("Error inactivar rostro del miembro:", error);
      }
    );
  });
};

//Insertar alimentos y sus restricciones
export const insertFood = (
  type_code,
  name,
  description,
  stock,
  minimum_amount,
  code_restriction
) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      // Insertar el alimento en la tabla food
      tx.executeSql(
        "INSERT OR IGNORE INTO food (type_code, name, description, price, stock, minimum_amount, create_date, last_update, state) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          type_code,
          name,
          description,
          0,
          stock,
          minimum_amount,
          new Date().toString(),
          new Date().toString(),
          "A",
        ],
        (tx, results) => {
          // Obtener el ID del alimento recién insertado
          tx.executeSql(
            "SELECT id FROM food WHERE name = ?",
            [name],
            (tx, results) => {
              const food_id = results.rows._array[0].id;

              if (code_restriction) {
                // Insertar la restricción correspondiente
                insertRestriction(food_id, code_restriction)
                  .then(() => {
                    console.log("Alimento y restricción insertados correctamente: ", name);
                    resolve();
                  })
                  .catch((error) => {
                    console.error("Error al insertar la restricción: ", error);
                    reject(error);
                  });
              } else {
                console.log("Alimento insertado sin restricción: ", name);
                resolve();
              }
            },
            (tx, error) => {
              console.error("Error al obtener el ID del alimento: ", error);
              reject(error);
            }
          );
        },
        (tx, error) => {
          console.error("Error al insertar el alimento: ", name, error);
          reject(error);
        }
      );
    });
  });
};

// Inserta una nueva restricción al alimento si es para vegetarianos, veganos o celíacos
export const insertRestriction = (food_id, restriction_code) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "INSERT OR IGNORE INTO relation_restriction_food (id_food, code_restriction, create_date, last_update) VALUES (?, ?, ?, ?)",
        [
          food_id, restriction_code, new Date().toString(), new Date().toString(),
        ],
        (tx, results) => {
          console.log("Se le asigno una restricción al alimento con id "+food_id+" correctamente");
        },
        (tx, error) => {
          console.error("Error al insertar restricción al alimento ", error);
        },
      )
    });
  });
}

//Marcar orden como enviada
export const markSentSupplierOrder = (order_id) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "UPDATE order_for_supplier SET state = 'B' WHERE id = ?",
        [order_id],
        (tx, results) => {
          resolve(order_id);
        },
        (tx, error) => {
          reject(error);
        }
      );
    });
  });
};

//Actualiza el stock de la comida agregando la cantidad de la orden
export const addStockFromSupplierOrder = (order_id) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `UPDATE food
        SET stock = stock + (
          SELECT amount
          FROM order_for_supplier
          WHERE id = ?
          AND id_food = food.id
        )
        WHERE EXISTS (
          SELECT 1
          FROM order_for_supplier
          WHERE id = ?
          AND id_food = food.id
        )`,
        [order_id, order_id],
        (tx, results) => {
          resolve(order_id);
        },
        (tx, error) => {
          reject(error);
        }
      );
    });
  });
};

//Actualiza el stock de la comida agregando la cantidad de la orden
export const getOrdersForSupplier = () => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `SELECT o.id, o.amount, f.name
        FROM order_for_supplier o
        INNER JOIN food f ON o.id_food = f.id
        WHERE o.state = 'A';`,
        [],
        (tx, results) => {
          console.log('getOrdersForSupplier',results.rows._array)
          resolve(results.rows._array);
        },
        (tx, error) => {
          console.error("Error al obtener las ordenes:", error);
          reject(error);
        }
      );
    });
  });
};

//Función para inactivar alimento indicando el name en la tabla food
export const inactiveFoodByName = (name) => {
  db.transaction((tx) => {
    tx.executeSql(
      "UPDATE food SET state = ?, last_update = ? WHERE name = ?",
      [
        "I",
        new Date().toString(),
        name
      ],
      (tx, results) => {
        console.log("Alimento inactivado correctamente", name);
      },
      (tx, error) => {
        console.error("Error al inactivar alimento:", error);
      }
    );
  });
};

//Función para actualizar stock de alimentos indicando id y stock en la tabla food
export const updateStockFoodById = (id, stock) => {
  db.transaction((tx) => {
    tx.executeSql(
      "UPDATE food SET stock = ?, last_update = ? WHERE id = ?",
      [
        stock, 
        new Date().toString(), 
        id
      ],
      (tx, results) => {
        console.log("Stock actualizado correctamente: ", id, stock);
      },
      (tx, error) => {
        console.error("Error al actualizar stock ", error);
      }
    );
  });
};

//Función para actualizar stock de alimentos idicando name y stock en la tabla food
export const updateStockFoodByName = (name, stock) => {
  console.log(name, stock)
  db.transaction((tx) => {
    tx.executeSql(
      "UPDATE food SET stock = ?, last_update = ? WHERE name = ?",
      [
        stock, 
        new Date().toString(), 
        name
      ],
      (tx, results) => {
        console.log("Stock actualizado correctamente: ", name, stock);
      },
      (tx, error) => {
        console.error("Error al actualizar stock ", error);
      }
    );
  });
};
