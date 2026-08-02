const db = require("../database");

const getAllActiveCategories = async () => {
  const sql = `
    SELECT id, name
    FROM categories
    ORDER BY name ASC
  `;

  const [rows] = await db.execute(sql);
  return rows;
};

module.exports = {
  getAllActiveCategories,
};
