const db = require("../database");

const createProduct = async (product) => {
  const sql = `
        INSERT INTO products
        (name, description, price, stock, category_id, image_url)
        VALUES (?, ?, ?, ?, ?, ?)
    `;

  const [result] = await db.execute(sql, [
    product.name,
    product.description,
    product.price,
    product.stock,
    product.category_id,
    product.image_url,
  ]);

  return result;
};

const getAllProducts = async (filters) => {
  const { sql: baseSql, values } = buildProductQuery(filters);

  let sql = `
        SELECT
            p.id,
            p.name,
            p.description,
            p.price,
            p.stock,
            p.category_id,
            p.image_url,
            c.name AS category
        ${baseSql}
    `;

  switch (filters.sort) {
    case "price_asc":
      sql += " ORDER BY p.price ASC";
      break;

    case "price_desc":
      sql += " ORDER BY p.price DESC";
      break;

    case "name_asc":
      sql += " ORDER BY p.name ASC";
      break;

    case "name_desc":
      sql += " ORDER BY p.name DESC";
      break;

    case "oldest":
      sql += " ORDER BY p.created_at ASC";
      break;

    default:
      sql += " ORDER BY p.created_at DESC";
  }
  const offset = (filters.page - 1) * filters.limit;
  sql += ` LIMIT ${Number(filters.limit)} OFFSET ${Number(offset)}`;
  const queryValues = [...values];
  const [rows] = await db.execute(sql, queryValues);
  return rows;
};

const getProductCount = async (filters) => {
  const { sql: baseSql, values } = buildProductQuery(filters);

  const countSql = `
        SELECT COUNT(*) AS total
        ${baseSql}
    `;

  const [rows] = await db.execute(countSql, values);

  return rows[0].total;
};
const getProductById = async (id) => {
  const sql = `
        select 
            p.id,
            p.name,
            p.description,
            p.price,
            p.stock,
            p.category_id,
            p.image_url,
            c.name as category
        from 
            products p
        join 
            categories c
        on 
            p.category_id = c.id 
        where 
            p.id = ? and p.is_active = true
    `;
  const [rows] = await db.execute(sql, [id]);
  return rows[0];
};

const updateProduct = async (id, product) => {
  const sql = `
        UPDATE products
        SET
            name = ?,
            description = ?,
            price = ?,
            stock = ?,
            category_id = ?,
            image_url = ?
        WHERE id = ?
        AND is_active = TRUE
    `;

  const [result] = await db.execute(sql, [
    product.name,
    product.description,
    product.price,
    product.stock,
    product.category_id,
    product.image_url,
    id,
  ]);

  return result;
};

const deleteProduct = async (id) => {
  const sql = `
        update products 
        set is_active = false
        where id = ? and is_active = true
        `;
  const [result] = await db.execute(sql, [id]);
  return result;
};

const buildProductQuery = (filters) => {
  let sql = `
        FROM products p
        JOIN categories c
            ON p.category_id = c.id
        WHERE p.is_active = TRUE
    `;

  const values = [];

  if (filters.search) {
    sql += " AND p.name LIKE ?";
    values.push(`%${filters.search}%`);
  }

  if (filters.category) {
    sql += " AND p.category_id = ?";
    values.push(filters.category);
  }

  return { sql, values };
};

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getProductCount,
};
