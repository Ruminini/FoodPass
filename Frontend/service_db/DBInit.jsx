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
} from "./DBSchema";

export const initializeDatabase = () => {
  db.transaction((tx) => {
    tx.executeSql(
      createTypeUserTable,
      [],
      (tx, results) => {
        console.log("Tabla type_user creada correctamente", results);
      },
      (tx, error) => {
        console.error("Error al crear la tabla type_user:", error);
      }
    );
    tx.executeSql(
      createValidMemberTable,
      [],
      (tx, results) => {
        console.log("Tabla valid_member creada correctamente", results);
      },
      (tx, error) => {
        console.error("Error al crear la tabla usuario:", error);
      }
    );
    tx.executeSql(
      createUserTable,
      [],
      (tx, results) => {
        console.log("Tabla user creada correctamente", results);
      },
      (tx, error) => {
        console.error("Error al crear la tabla user:", error);
      }
    );
    tx.executeSql(
      createFaceTable,
      [],
      (tx, results) => {
        console.log("Tabla face creada correctamente", results);
      },
      (tx, error) => {
        console.error("Error al crear la tabla face:", error);
      }
    );
    tx.executeSql(
      createLogsLoginTable,
      [],
      (tx, results) => {
        console.log("Tabla logs_login creada correctamente", results);
      },
      (tx, error) => {
        console.error("Error al crear la tabla logs_login:", error);
      }
    );
    tx.executeSql(
      createTypeFoodTable,
      [],
      (tx, results) => {
        console.log("Tabla type_food creada correctamente", results);
      },
      (tx, error) => {
        console.error("Error al crear la tabla type_food", error);
      }
    );
    tx.executeSql(
      createTypeFoodRestrictionTable,
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
    tx.executeSql(
      createOrderStateTable,
      [],
      (tx, results) => {
        console.log("Tabla order_state creada correctamente", results);
      },
      (tx, error) => {
        console.error("Error al crear la tabla order_state", error);
      }
    );
    tx.executeSql(
      createMenuTable,
      [],
      (tx, results) => {
        console.log("Tabla menu creada correctamente", results);
      },
      (tx, error) => {
        console.error("Error al crear la tabla menu", error);
      }
    );
    tx.executeSql(
      createOrderTable,
      [],
      (tx, results) => {
        console.log("Tabla order creada correctamente", results);
      },
      (tx, error) => {
        console.error("Error al crear la tabla order", error);
      }
    );
    tx.executeSql(
      createFoodTable,
      [],
      (tx, results) => {
        console.log("Tabla food creada correctamente", results);
      },
      (tx, error) => {
        console.error("Error al crear la tabla food", error);
      }
    );
    tx.executeSql(
      createRelationFoodMenuTable,
      [],
      (tx, results) => {
        console.log("Tabla relation_food_menu creada correctamente", results);
      },
      (tx, error) => {
        console.error("Error al crear la tabla relation_food_menu", error);
      }
    );
    tx.executeSql(
      createRelationRestrictionFood,
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
    tx.executeSql(
      createOrderForSupplierTable,
      [],
      (tx, results) => {
        console.log("Tabla order_for_supplier creada correctamente", results);
      },
      (tx, error) => {
        console.error("Error al crear la tabla order_for_supplier", error);
      }
    );
  });
};
