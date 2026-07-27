const cartModel = require("../models/cartModel");
const productModel = require("../models/productModel");

const addToCart = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { productId, quantity = 1 } = req.body;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required.",
      });
    }

    if (quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be greater than zero.",
      });
    }

    const product = await productModel.getProductById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    let cart = await cartModel.getCartByUserId(userId);

    if (!cart) {
      const cartId = await cartModel.createCart(userId);

      cart = {
        id: cartId,
        user_id: userId,
      };
    }

    const cartItem = await cartModel.findCartItem(cart.id, productId);

    if (cartItem) {
      const newQuantity = cartItem.quantity + quantity;

      await cartModel.updateCartItemQuantity(cartItem.id, newQuantity);

      return res.status(200).json({
        success: true,
        message: "Cart updated successfully.",
      });
    }

    await cartModel.addCartItem(cart.id, productId, quantity);
    const cartDetails = await cartModel.getCartDetails(cart.id);

    return res.status(201).json({
      success: true,
      message: "Product added to cart successfully.",
      cart: cartDetails,
    });
  } catch (error) {
    next(error);
  }
};

const getCart = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const cart = await cartModel.getCartByUserId(userId);

    if (!cart) {
      return res.status(200).json({
        success: true,
        cart: {
          items: [],
          summary: {
            totalItems: 0,
            totalAmount: 0,
          },
        },
      });
    }

    const items = await cartModel.getCartItems(cart.id);

    const totalItems = items.reduce((total, item) => total + item.quantity, 0);

    const totalAmount = items.reduce(
      (total, item) => total + parseFloat(item.subtotal),
      0,
    );
    const cartDetails = await cartModel.getCartDetails(cart.id);
    return res.status(200).json({
      success: true,
      cart: cartDetails,
    });
  } catch (error) {
    next(error);
  }
};

const updateQuantity = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const productId = Number(req.params.productId);
    const { quantity } = req.body;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required.",
      });
    }

    if (!quantity || quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be greater than zero.",
      });
    }

    const cart = await cartModel.getCartByUserId(userId);

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found.",
      });
    }

    const cartItem = await cartModel.findCartItem(cart.id, productId);

    if (!cartItem) {
      return res.status(404).json({
        success: false,
        message: "Product not found in cart.",
      });
    }

    await cartModel.updateCartItemQuantity(cartItem.id, quantity);
    const cartDetails = await cartModel.getCartDetails(cart.id);

    return res.status(200).json({
      success: true,
      message: "Cart quantity updated successfully.",
      cart: cartDetails,
    });
  } catch (error) {
    next(error);
  }
};

const removeFromCart = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const productId = Number(req.params.productId);

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required.",
      });
    }

    const cart = await cartModel.getCartByUserId(userId);

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found.",
      });
    }

    const cartItem = await cartModel.findCartItem(cart.id, productId);

    if (!cartItem) {
      return res.status(404).json({
        success: false,
        message: "Product not found in cart.",
      });
    }

    await cartModel.removeCartItem(cartItem.id);

    const cartDetails = await cartModel.getCartDetails(cart.id);

    return res.status(200).json({
      success: true,
      message: "Product removed from cart successfully.",
      cart: cartDetails,
    });
  } catch (error) {
    next(error);
  }
};

const clearCart = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const cart = await cartModel.getCartByUserId(userId);

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found.",
      });
    }

    await cartModel.clearCart(cart.id);

    return res.status(200).json({
      success: true,
      message: "Cart cleared successfully.",
      cart: {
        id: cart.id,
        items: [],
        summary: {
          totalItems: 0,
          totalAmount: 0,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};
module.exports = {
  addToCart,
  getCart,
  updateQuantity,
  removeFromCart,
  clearCart,
};
