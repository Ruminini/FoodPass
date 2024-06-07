import db from "./DB";
export const createTriggers = () => {
  return new Promise((resolve, reject) => {
    db.transaction(
      (tx) => {
        Object.keys(triggers).forEach((name) => {
          tx.executeSql(
            triggers[name],
            [],
            () => {
              console.log("Trigger created:", name);
            },
            (_, error) => {
              console.error("Error creating trigger:", error);
            }
          );
        });
      },
      (error) => {
        reject(error);
      },
      resolve
    );
  });
};

export const dropTriggers = () => {
  return new Promise((resolve, reject) => {
    db.transaction(
      (tx) => {
        Object.keys(triggers).forEach((name) => {
          tx.executeSql(
            `DROP TRIGGER IF EXISTS ${name}`,
            [],
            () => {
              console.log("Trigger dropped:", name);
            },
            (_, error) => {
              console.error("Error dropping trigger:", error);
            }
          );
        });
      },
      (error) => {
        reject(error);
      },
      resolve
    );
  });
};

const triggers = {
  // Generate restock order
  restock_food: `CREATE TRIGGER IF NOT EXISTS restock_food
    AFTER UPDATE ON food
    FOR EACH ROW
    WHEN NEW.stock < NEW.minimum_amount
    BEGIN
        -- Check if an order already exists for the same food item, with state 'A'
        UPDATE order_for_supplier
        SET amount = 3 * NEW.minimum_amount - NEW.stock
        WHERE id_food = NEW.id
        AND state = 'A';
        
        -- If no rows were updated, insert a new order
        INSERT INTO order_for_supplier (id_food, amount)
        SELECT NEW.id, 3 * NEW.minimum_amount - NEW.stock
        WHERE NOT EXISTS (
            SELECT 1
            FROM order_for_supplier
            WHERE id_food = NEW.id
            AND state = 'A'
        );
    END;`,
  // Auto update last_update on order_for_supplier
  last_update_order_for_supplier: `CREATE TRIGGER IF NOT EXISTS last_update_order_for_supplier
    AFTER UPDATE ON order_for_supplier
    FOR EACH ROW
    WHEN NEW.state = 'C'
    BEGIN
        UPDATE order_for_supplier
        SET last_update = CURRENT_DATE
        WHERE id = NEW.id;
    END;`,
  // Auto update last_update on guest_expiration
  last_update_guest_expiration: `CREATE TRIGGER IF NOT EXISTS last_update_guest_expiration
    AFTER UPDATE ON guest_expiration
    FOR EACH ROW
    BEGIN
        UPDATE guest_expiration
        SET last_update = CURRENT_DATE
        WHERE user_id = NEW.user_id;
    END;`,
};
