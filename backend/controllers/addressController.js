const AddressModel = require("../models/addressModel");

exports.addAddress = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const {
      full_name,
      phone,
      address_line1,
      address_line2,
      city,
      state,
      postal_code,
      country = "India",
      address_type = "Home",
    } = req.body;

    const addressCount = await AddressModel.getAddressCount(userId);

    const isDefault = addressCount === 0;

    const addressId = await AddressModel.createAddress({
      user_id: userId,
      full_name,
      phone,
      address_line1,
      address_line2: address_line2 || null,
      city,
      state,
      postal_code,
      country,
      address_type,
      is_default: isDefault,
    });

    return res.status(201).json({
      success: true,
      message: "Address added successfully.",
      addressId,
    });
  } catch (err) {
    next(err);
  }
};

exports.getAddresses = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const addresses = await AddressModel.getAddressesByUserId(userId);

    return res.status(200).json({
      success: true,
      count: addresses.length,
      addresses,
    });
  } catch (err) {
    next(err);
  }
};

exports.getAddressById = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const addressId = req.params.id;

    const address = await AddressModel.getAddressById(addressId, userId);

    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Address not found.",
      });
    }

    return res.status(200).json({
      success: true,
      address,
    });
  } catch (err) {
    next(err);
  }
};

exports.updateAddress = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const addressId = req.params.id;

    const {
      full_name,
      phone,
      address_line1,
      address_line2,
      city,
      state,
      postal_code,
      country,
      address_type,
    } = req.body;

    const result = await AddressModel.updateAddress(addressId, userId, {
      full_name,
      phone,
      address_line1,
      address_line2,
      city,
      state,
      postal_code,
      country,
      address_type,
    });

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Address not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Address updated successfully.",
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteAddress = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const addressId = req.params.id;

    const address = await AddressModel.getAddressByIdDefault(addressId, userId);

    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Address not found.",
      });
    }

    await AddressModel.deleteAddress(addressId, userId);

    if (address.is_default) {
      const latestAddress = await AddressModel.getLatestAddress(userId);

      if (latestAddress) {
        await AddressModel.setDefaultAddress(latestAddress.id, userId);
      }
    }

    return res.status(200).json({
      success: true,
      message: "Address deleted successfully.",
    });
  } catch (err) {
    next(err);
  }
};

exports.setDefaultAddress = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const addressId = req.params.id;

    // Check ownership
    const address = await AddressModel.getAddressById(addressId, userId);

    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Address not found.",
      });
    }

    // Remove existing default
    await AddressModel.clearDefaultAddress(userId);

    // Set new default
    await AddressModel.setDefaultAddress(addressId, userId);

    return res.status(200).json({
      success: true,
      message: "Default address updated successfully.",
    });
  } catch (err) {
    next(err);
  }
};
