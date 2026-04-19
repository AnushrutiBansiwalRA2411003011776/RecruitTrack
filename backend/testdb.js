const db = require("./db/connection");

async function test() {
  try {
    const [rows] = await db.execute("SELECT * FROM student LIMIT 1");
    console.log("Table exists, rows:", rows.length);
  } catch (error) {
    console.error("DB error:", error);
  }
}

test();
