import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabase("FoodPass.db");
//await db.execAsync([{ sql: "PRAGMA foreign_keys = ON;", args: [] }], false);

export default db;
