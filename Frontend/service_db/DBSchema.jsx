export const createTypeUserTable = `CREATE TABLE IF NOT EXISTS type_user (
    code INTEGER PRIMARY KEY AUTOINCREMENT, 
    name TEXT NOT NULL UNIQUE,  
    create_date TEXT NOT NULL, 
    last_update TEXT NOT NULL, 
    state TEXT DEFAULT 'A')`;

export const createValidMemberTable = `CREATE TABLE IF NOT EXISTS valid_member (
    code TEXT PRIMARY KEY NOT NULL, 
    name TEXT NOT NULL, 
    last_name TEXT NOT NULL, 
    create_date TEXT NOT NULL, 
    last_update TEXT NOT NULL, 
    state TEXT DEFAULT 'A')`;

export const createUserTable = ` CREATE TABLE IF NOT EXISTS user (
    member_code TEXT PRIMARY KEY, 
    type_code INTEGER NOT NULL,
    hashed_pass TEXT NOT NULL, 
    salt TEXT NOT NULL, 
    create_date TEXT NOT NULL,
    last_update TEXT NOT NULL,
    state TEXT DEFAULT 'A'
    --FOREIGN KEY(type_code) REFERENCES type_user(code)
  );`;

export const createFaceTable = `CREATE TABLE IF NOT EXISTS face (
    id INTEGER PRIMARY KEY AUTOINCREMENT, 
    user_id TEXT NOT NULL,
    descriptor TEXT NOT NULL UNIQUE,
    create_date TEXT NOT NULL, 
    state TEXT DEFAULT 'A'
    --FOREIGN KEY(user_id) REFERENCES user(member_code)
  );`;

export const createLogsLoginTable = `CREATE TABLE IF NOT EXISTS logs_login (
    id INTEGER PRIMARY KEY AUTOINCREMENT, 
    user_id TEXT NOT NULL,
    create_date TEXT NOT NULL
    --FOREIGN KEY(user_id) REFERENCES user(member_code)
  );`;

export const createLogsOrderRetireTable = `CREATE TABLE IF NOT EXISTS logs_order_retire (
  id INTEGER PRIMARY KEY AUTOINCREMENT, 
  user_id TEXT NOT NULL,
  create_date TEXT NOT NULL
  --FOREIGN KEY(user_id) REFERENCES user(member_code),
);`;

export const createTypeFoodTable = `CREATE TABLE IF NOT EXISTS type_food (
    code INTEGER PRIMARY KEY AUTOINCREMENT, 
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    create_date TEXT NOT NULL,
    last_update TEXT NOT NULL, 
    state TEXT DEFAULT 'A' );`;

export const createTypeFoodRestrictionTable = `CREATE TABLE IF NOT EXISTS type_food_restriction (
    code INTEGER PRIMARY KEY AUTOINCREMENT, 
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    create_date TEXT NOT NULL,
    last_update TEXT NOT NULL, 
    state TEXT DEFAULT 'A' );`;

export const createOrderStateTable = `CREATE TABLE IF NOT EXISTS order_state (
    code INTEGER PRIMARY KEY AUTOINCREMENT, 
    description TEXT NOT NULL UNIQUE,
    create_date TEXT NOT NULL,
    last_update TEXT NOT NULL, 
    state TEXT DEFAULT 'A' );`;

export const createMenuTable = `CREATE TABLE IF NOT EXISTS menu (
    id INTEGER PRIMARY KEY AUTOINCREMENT, 
    create_date TEXT NOT NULL);`;

export const createOrderTable = `CREATE TABLE IF NOT EXISTS "order" ( 
    user_id TEXT NOT NULL,
    create_date TEXT NOT NULL,
    order_state_code INTEGER NOT NULL,
    menu_id INTEGER NOT NULL,
    --FOREIGN KEY(user_id) REFERENCES user(member_code),
    --FOREIGN KEY(order_state_code) REFERENCES order_state(code),
    --FOREIGN KEY(menu_id) REFERENCES menu(id),
    PRIMARY KEY (user_id, create_date)
  );`;

export const createFoodTable = `CREATE TABLE IF NOT EXISTS food ( 
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    type_code INTEGER NOT NULL,
    name TEXT NOT NULL UNIQUE,
    description TEXT NOT NULL,
    price REAL DEFAULT 0,
    stock INTEGER NOT NULL,
    minimum_amount DEFAULT 0,
    create_date TEXT NOT NULL, 
    last_update TEXT NOT NULL, 
    state TEXT DEFAULT 'A'
    --FOREIGN KEY(type_code) REFERENCES type_food(code)
  );`;

export const createRelationFoodMenuTable = `CREATE TABLE IF NOT EXISTS relation_food_menu ( 
    id_menu INTEGER NOT NULL,
    id_food INTEGER NOT NULL,
    create_date TEXT NOT NULL, 
    last_update TEXT NOT NULL, 
    state TEXT DEFAULT 'A',
    --FOREIGN KEY(id_food) REFERENCES food(id)
    --FOREIGN KEY(id_menu) REFERENCES menu(id)
    PRIMARY KEY (id_menu, id_food)
  );`;

export const createRelationRestrictionFood = `CREATE TABLE IF NOT EXISTS relation_restriction_food ( 
    id_food INTEGER NOT NULL,
    code_restriction INTEGER NOT NULL,
    create_date TEXT NOT NULL, 
    last_update TEXT NOT NULL, 
    state TEXT DEFAULT 'A',
    --FOREIGN KEY(id_food) REFERENCES food(id)
    --FOREIGN KEY(code_restriction) REFERENCES type_food_restriction(code)
    PRIMARY KEY (id_food, code_restriction)
  );`;

export const createOrderForSupplierTable = `CREATE TABLE IF NOT EXISTS order_for_supplier ( 
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    id_food INTEGER NOT NULL,
    amount REAL NOT NULL, 
    create_date TEXT DEFAULT (DATE()), 
    last_update TEXT DEFAULT (DATE()), 
    state TEXT DEFAULT 'A'
  );`;
