const db = require("../database");

const getCartByUserId = async (userId) => {
  const query = `
        SELECT *
        FROM cart
        WHERE user_id = ?
    `;

  const [rows] = await db.execute(query, [userId]);

  return rows[0] || null;
};

const createCart = async (userId) => {
  const query = `
        INSERT INTO cart (user_id)
        VALUES (?)
    `;

  const [result] = await db.execute(query, [userId]);

  return result.insertId;
};

const findCartItem = async (cartId, productId) => {
  const query = `
        SELECT *
        FROM cart_items
        WHERE cart_id = ? AND product_id = ?
    `;

  const [rows] = await db.execute(query, [cartId, productId]);

  return rows[0] || null;
};

const addCartItem = async (cartId, productId, quantity) => {
  const query = `
        INSERT INTO cart_items (cart_id, product_id, quantity)
        VALUES (?, ?, ?)
    `;

  const [result] = await db.execute(query, [cartId, productId, quantity]);

  return result.insertId;
};

const updateCartItemQuantity = async (cartItemId, quantity) => {
  const query = `
        UPDATE cart_items
        SET quantity = ?
        WHERE id = ?
    `;

  await db.execute(query, [quantity, cartItemId]);
};

const getCartItems = async (cartId) => {
  const query = `
        SELECT
            ci.id AS cartItemId,
            ci.quantity,
            p.id AS productId,
            p.name,
            p.price,
            p.image_url,
            CAST(ci.quantity * p.price AS DECIMAL(10,2)) AS subtotal
        FROM cart_items ci
        INNER JOIN products p
            ON ci.product_id = p.id
        WHERE ci.cart_id = ?
    `;

  const [rows] = await db.execute(query, [cartId]);

  return rows;
};

const getCartDetails = async (cartId) => {
  const items = await getCartItems(cartId);

  const totalItems = items.reduce((total, item) => total + item.quantity, 0);

  const totalAmount = items.reduce(
    (total, item) => total + Number(item.subtotal),
    0,
  );

  return {
    id: cartId,
    items,
    summary: {
      totalItems,
      totalAmount,
    },
  };
};

const removeCartItem = async (cartItemId) => {
  const query = `
        DELETE FROM cart_items
        WHERE id = ?
    `;

  const [result] = await db.execute(query, [cartItemId]);

  return result.affectedRows;
};

const clearCart = async (cartId) => {
  const query = `
        DELETE FROM cart_items
        WHERE cart_id = ?
    `;

  const [result] = await db.execute(query, [cartId]);

  return result.affectedRows;
};

const deleteCart = async (cartId) => {
  const query = `
        DELETE FROM cart
        WHERE id = ?
    `;

  const [result] = await db.execute(query, [cartId]);

  return result.affectedRows;
};

const hasCartItems = async (cartId) => {
  const query = `
        SELECT COUNT(*) AS count
        FROM cart_items
        WHERE cart_id = ?
    `;

  const [rows] = await db.execute(query, [cartId]);

  return rows[0].count > 0;
};

module.exports = {
  createCart,
  getCartByUserId,
  findCartItem,
  getCartDetails,
  addCartItem,
  clearCart,
  removeCartItem,
  updateCartItemQuantity,
  getCartItems,
  deleteCart,
  hasCartItems,
};
