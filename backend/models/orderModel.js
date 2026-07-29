const db = require("../database");

class OrderModel {
  // ===============================
  // Create Order
  // ===============================

  static async createOrder(
    connection,
    userId,
    addressId,
    totalAmount,
    paymentMethod = "COD",
  ) {
    const [result] = await connection.execute(
      `
            INSERT INTO orders
            (
                user_id,
                address_id,
                total_amount,
                payment_method
            )
            VALUES (?, ?, ?, ?)
            `,
      [userId, addressId, totalAmount, paymentMethod],
    );

    return result.insertId;
  }

  // ===============================
  // Create Order Items
  // ===============================

  static async createOrderItems(connection, orderId, items) {
    const query = `
            INSERT INTO order_items
            (
                order_id,
                product_id,
                quantity,
                price,
                subtotal
            )
            VALUES (?, ?, ?, ?, ?)
        `;

    for (const item of items) {
      await connection.execute(query, [
        orderId,
        item.product_id,
        item.quantity,
        item.price,
        item.subtotal,
      ]);
    }
  }

  // ===============================
  // Get Single Order
  // ===============================

  static async getOrderById(orderId) {
    const [rows] = await db.execute(
      `
            SELECT
                o.id,
                o.user_id,
                o.address_id,
                o.total_amount,
                o.status,
                o.payment_method,
                o.payment_status,
                o.created_at,

                oi.product_id,
                p.name AS product_name,
                oi.quantity,
                oi.price,
                oi.subtotal

            FROM orders o

            JOIN order_items oi
                ON o.id = oi.order_id

            JOIN products p
                ON oi.product_id = p.id

            WHERE o.id = ?
            `,
      [orderId],
    );

    return rows;
  }

  // ===============================
  // Get Orders By User
  // ===============================

  static async getOrdersByUser(userId) {
    const [rows] = await db.execute(
      `
    SELECT
        id,
        address_id,
        total_amount,
        status,
        payment_method,
        payment_status,
        created_at,
        updated_at
    FROM orders
    WHERE user_id = ?
    ORDER BY created_at DESC
    `,
      [userId],
    );

    return rows;
  }

  // ===============================
  // Admin - Get All Orders
  // ===============================

  static async getAllOrders() {
    const [rows] = await db.execute(
      `
            SELECT
                o.id,
                o.user_id,
                u.username,
                u.email,
                o.address_id,
                o.total_amount,
                o.status,
                o.payment_method,
                o.payment_status,
                o.created_at,
                o.updated_at

            FROM orders o

            JOIN users u
                ON o.user_id = u.id

            ORDER BY o.created_at DESC
            `,
    );

    return rows;
  }

  // ===============================
  // Update Order Status
  // ===============================

  static async updateOrderStatus(orderId, status) {
    const [result] = await db.execute(
      `
        UPDATE orders
        SET
            status = ?,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
        `,
      [status, orderId],
    );

    return result;
  }

  // ===============================
  // Update Product Stock
  // ===============================

  static async updateProductStock(connection, items) {
    for (const item of items) {
      const [result] = await connection.execute(
        `
                UPDATE products
                SET stock = stock - ?
                WHERE id = ?
                AND stock >= ?
                `,
        [item.quantity, item.product_id, item.quantity],
      );

      if (result.affectedRows === 0) {
        throw new Error(`Insufficient stock for product ${item.product_id}`);
      }
    }
  }

  // ===============================
  // Clear Cart
  // ===============================

  static async clearCart(connection, userId) {
    const query = `
            DELETE ci
            FROM cart_items ci
            JOIN cart c
                ON ci.cart_id = c.id
            WHERE c.user_id = ?
        `;

    const [result] = await connection.execute(query, [userId]);

    return result;
  }
  static async getOrderStatus(orderId) {
    const [rows] = await db.execute(
      `
        SELECT status
        FROM orders
        WHERE id = ?
        `,
      [orderId],
    );

    return rows[0] || null;
  }
}

module.exports = OrderModel;
