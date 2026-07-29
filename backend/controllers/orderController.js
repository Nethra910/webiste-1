const db = require("../database");
const OrderModel = require("../models/orderModel");
const AddressModel = require("../models/addressModel");
const CartModel = require("../models/cartModel");
const { allowedTransitions } = require("../utils/orderStatus");

exports.placeOrder = async (req, res, next) => {
  let connection;

  try {
    const userId = req.user.id;
    const { address_id, payment_method = "COD" } = req.body;

    // console.log("========== PLACE ORDER ==========");
    // console.log("User ID:", userId);
    // console.log("Request Body:", req.body);

    // -------------------------
    // Validate Address
    // -------------------------

    const address = await AddressModel.getAddressById(address_id, userId);

    // console.log("Address:", address);

    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Address not found or does not belong to the user.",
      });
    }

    // -------------------------
    // Get Cart Items
    // -------------------------

    const cartItems = await CartModel.getCartItemsByUser(userId);

    // console.log("Cart Items:");
    // console.log(JSON.stringify(cartItems, null, 2));

    if (!cartItems.length) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty.",
      });
    }

    // -------------------------
    // Check Stock & Calculate Total
    // -------------------------

    let totalAmount = 0;
    const orderItems = [];

    for (const item of cartItems) {
      // console.log("Processing Cart Item:", item);

      if (item.quantity > item.stock) {
        return res.status(400).json({
          success: false,
          message: `${item.name} is out of stock.`,
        });
      }

      const subtotal = Number(item.price) * Number(item.quantity);

      totalAmount += subtotal;

      orderItems.push({
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.price,
        subtotal,
      });
    }

    // console.log("Order Items:");
    // console.log(JSON.stringify(orderItems, null, 2));

    // console.log("Create Order Params:");
    // console.log({
    //   userId,
    //   address_id,
    //   totalAmount,
    //   payment_method,
    // });

    // -------------------------
    // Start Transaction
    // -------------------------

    connection = await db.getConnection();

    // console.log("Transaction Started");

    await connection.beginTransaction();

    // -------------------------
    // Create Order
    // -------------------------

    const orderId = await OrderModel.createOrder(
      connection,
      userId,
      address_id,
      totalAmount,
      payment_method,
    );

    // console.log("Created Order ID:", orderId);

    // -------------------------
    // Create Order Items
    // -------------------------

    // console.log("Creating Order Items...");

    await OrderModel.createOrderItems(connection, orderId, orderItems);

    // console.log("Order Items Created");

    // -------------------------
    // Update Product Stock
    // -------------------------

    // console.log("Updating Product Stock...");

    await OrderModel.updateProductStock(connection, orderItems);

    // console.log("Product Stock Updated");

    // -------------------------
    // Clear Cart
    // -------------------------

    // console.log("Clearing Cart...");

    await OrderModel.clearCart(connection, userId);

    //  console.log("Cart Cleared");

    // -------------------------
    // Commit Transaction
    // -------------------------

    await connection.commit();

    // console.log("Transaction Committed");

    res.status(201).json({
      success: true,
      message: "Order placed successfully.",
      order: {
        id: orderId,
        total_amount: totalAmount,
        payment_method,
        status: "Pending",
        items: orderItems,
      },
    });
  } catch (error) {
    console.error("========== ERROR ==========");
    console.error(error);
    console.error(error.stack);

    if (connection) {
      await connection.rollback();
      // console.log("Transaction Rolled Back");
    }

    next(error);
  } finally {
    if (connection) {
      connection.release();
      // console.log("Connection Released");
    }

    // console.log("========== END ==========");
  }
};

exports.getMyOrders = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const orders = await OrderModel.getOrdersByUser(userId);

    return res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    next(error);
  }
};

exports.getOrderById = async (req, res, next) => {
  try {
    const orderId = req.params.id;
    const userId = req.user.id;

    const rows = await OrderModel.getOrderById(orderId);

    if (!rows.length) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }

    // Ensure the user owns the order
    if (rows[0].user_id !== userId) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access.",
      });
    }

    const order = {
      id: rows[0].id,
      user_id: rows[0].user_id,
      address_id: rows[0].address_id,
      total_amount: rows[0].total_amount,
      status: rows[0].status,
      payment_method: rows[0].payment_method,
      payment_status: rows[0].payment_status,
      created_at: rows[0].created_at,
      items: rows.map((item) => ({
        product_id: item.product_id,
        product_name: item.product_name,
        quantity: item.quantity,
        price: item.price,
        subtotal: item.subtotal,
      })),
    };

    return res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    next(error);
  }
};

exports.getAllOrders = async (req, res, next) => {
  try {
    const orders = await OrderModel.getAllOrders();

    return res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    next(error);
  }
};

exports.getAdminOrderById = async (req, res, next) => {
  try {
    const orderId = req.params.id;

    const rows = await OrderModel.getOrderById(orderId);

    if (!rows.length) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }

    const order = {
      id: rows[0].id,
      user_id: rows[0].user_id,

      total_amount: rows[0].total_amount,
      status: rows[0].status,
      payment_method: rows[0].payment_method,
      payment_status: rows[0].payment_status,
      created_at: rows[0].created_at,

      customer: {
        username: rows[0].username,
        email: rows[0].email,
      },

      delivery_address: {
        id: rows[0].address_id,
        full_name: rows[0].full_name,
        phone: rows[0].phone,
        address_line1: rows[0].address_line1,
        address_line2: rows[0].address_line2,
        city: rows[0].city,
        state: rows[0].state,
        postal_code: rows[0].postal_code,
        country: rows[0].country,
      },

      items: rows.map((item) => ({
        product_id: item.product_id,
        product_name: item.product_name,
        quantity: item.quantity,
        price: item.price,
        subtotal: item.subtotal,
      })),
    };

    return res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    next(error);
  }
};

exports.updateOrderStatus = async (req, res, next) => {
  try {
    const orderId = Number(req.params.id);
    const { status } = req.body;

    // -------------------------
    // Check if Order Exists
    // -------------------------

    const order = await OrderModel.getOrderStatus(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }

    const currentStatus = order.status;

    // -------------------------
    // Validate Status Transition
    // -------------------------

    const nextStatuses = allowedTransitions[currentStatus] || [];

    if (!nextStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Cannot change order status from '${currentStatus}' to '${status}'.`,
        allowed_next_statuses: nextStatuses,
      });
    }

    // -------------------------
    // Update Order Status
    // -------------------------

    const result = await OrderModel.updateOrderStatus(orderId, status);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }

    // -------------------------
    // Success Response
    // -------------------------

    return res.status(200).json({
      success: true,
      message: "Order status updated successfully.",
      order: {
        id: orderId,
        previous_status: currentStatus,
        current_status: status,
        updated_at: new Date(),
      },
    });
  } catch (error) {
    next(error);
  }
};
