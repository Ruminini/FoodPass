import db from "./DB";
import {
  createFaceTable,
  createFoodTable,
  createLogsLoginTable,
  createMenuTable,
  createOrderStateTable,
  createOrderTable,
  createRelationFoodMenuTable,
  createRelationRestrictionFood,
  createTypeFoodRestrictionTable,
  createTypeFoodTable,
  createTypeUserTable,
  createUserTable,
  createValidMemberTable,
  createOrderForSupplierTable,
  createGuestExpirationTable,
} from "./DBSchema";

export const initializeDatabase = () => {
  db.transaction((tx) => {
    tx.executeSql(
      createTypeUserTable,
      [],
      (tx, results) => {
        console.log("Tabla type_user creada correctamente");
      },
      (tx, error) => {
        console.error("Error al crear la tabla type_user:", error);
      }
    );
    tx.executeSql(
      createValidMemberTable,
      [],
      (tx, results) => {
        console.log("Tabla valid_member creada correctamente");
      },
      (tx, error) => {
        console.error("Error al crear la tabla usuario:", error);
      }
    );
    tx.executeSql(
      createUserTable,
      [],
      (tx, results) => {
        console.log("Tabla user creada correctamente");
      },
      (tx, error) => {
        console.error("Error al crear la tabla user:", error);
      }
    );
    tx.executeSql(
      createFaceTable,
      [],
      (tx, results) => {
        console.log("Tabla face creada correctamente");
      },
      (tx, error) => {
        console.error("Error al crear la tabla face:", error);
      }
    );
    tx.executeSql(
      createLogsLoginTable,
      [],
      (tx, results) => {
        console.log("Tabla logs_login creada correctamente");
      },
      (tx, error) => {
        console.error("Error al crear la tabla logs_login:", error);
      }
    );
    tx.executeSql(
      createTypeFoodTable,
      [],
      (tx, results) => {
        console.log("Tabla type_food creada correctamente");
      },
      (tx, error) => {
        console.error("Error al crear la tabla type_food", error);
      }
    );
    tx.executeSql(
      createTypeFoodRestrictionTable,
      [],
      (tx, results) => {
        console.log("Tabla type_food_restriction creada correctamente");
      },
      (tx, error) => {
        console.error("Error al crear la tabla type_food_restriction", error);
      }
    );
    tx.executeSql(
      createOrderStateTable,
      [],
      (tx, results) => {
        console.log("Tabla order_state creada correctamente");
      },
      (tx, error) => {
        console.error("Error al crear la tabla order_state", error);
      }
    );
    tx.executeSql(
      createMenuTable,
      [],
      (tx, results) => {
        console.log("Tabla menu creada correctamente");
      },
      (tx, error) => {
        console.error("Error al crear la tabla menu", error);
      }
    );
    tx.executeSql(
      createOrderTable,
      [],
      (tx, results) => {
        console.log("Tabla order creada correctamente");
      },
      (tx, error) => {
        console.error("Error al crear la tabla order", error);
      }
    );
    tx.executeSql(
      createFoodTable,
      [],
      (tx, results) => {
        console.log("Tabla food creada correctamente");
      },
      (tx, error) => {
        console.error("Error al crear la tabla food", error);
      }
    );
    tx.executeSql(
      createRelationFoodMenuTable,
      [],
      (tx, results) => {
        console.log("Tabla relation_food_menu creada correctamente");
      },
      (tx, error) => {
        console.error("Error al crear la tabla relation_food_menu", error);
      }
    );
    tx.executeSql(
      createRelationRestrictionFood,
      [],
      (tx, results) => {
        console.log("Tabla relation_restriction_food creada correctamente");
      },
      (tx, error) => {
        console.error(
          "Error al crear la tabla relation_restriction_food",
          error
        );
      }
    );
    tx.executeSql(
      createOrderForSupplierTable,
      [],
      (tx, results) => {
        console.log("Tabla order_for_supplier creada correctamente");
      },
      (tx, error) => {
        console.error("Error al crear la tabla order_for_supplier", error);
      }
    );
    tx.executeSql(
      createGuestExpirationTable,
      [],
      (tx, results) => {
        console.log("Tabla guest_expiration creada correctamente");
      },
      (tx, error) => {
        console.error("Error al crear la tabla guest_expiration", error);
      }
    );
  },
  (error) => {
    console.error("Error al inicializar la base de datos:", error);
  },
  () => {
    console.log("Base de datos inicializada");
  });
};
