const allowedTransitions = {
  Pending: ["Confirmed", "Cancelled"],
  Confirmed: ["Preparing"],
  Preparing: ["Out for Delivery"],
  "Out for Delivery": ["Delivered"],
  Delivered: [],
  Cancelled: [],
};

module.exports = {
  allowedTransitions,
};
