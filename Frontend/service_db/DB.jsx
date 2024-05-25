import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabase("FoodPass.db");

export default db;
