const db = require("../database");

const AddressModel = {
  async getAddressCount(userId) {
    const sql = `
            SELECT COUNT(*) AS total
            FROM addresses
            WHERE user_id = ?
        `;

    const [rows] = await db.execute(sql, [userId]);

    return rows[0].total;
  },

  async createAddress(addressData) {
    const sql = `
            INSERT INTO addresses
            (
                user_id,
                full_name,
                phone,
                address_line1,
                address_line2,
                city,
                state,
                postal_code,
                country,
                address_type,
                is_default
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

    const values = [
      addressData.user_id,
      addressData.full_name,
      addressData.phone,
      addressData.address_line1,
      addressData.address_line2,
      addressData.city,
      addressData.state,
      addressData.postal_code,
      addressData.country,
      addressData.address_type,
      addressData.is_default,
    ];

    const [result] = await db.execute(sql, values);

    return result.insertId;
  },

  async getAddressesByUserId(userId) {
    const sql = `
        SELECT
            id,
            full_name,
            phone,
            address_line1,
            address_line2,
            city,
            state,
            postal_code,
            country,
            address_type,
            is_default,
            created_at,
            updated_at
        FROM addresses
        WHERE user_id = ?
        ORDER BY is_default DESC, created_at DESC
    `;

    const [rows] = await db.execute(sql, [userId]);

    return rows;
  },

  async getAddressById(addressId, userId) {
    const sql = `
        SELECT
            id,
            full_name,
            phone,
            address_line1,
            address_line2,
            city,
            state,
            postal_code,
            country,
            address_type,
            is_default,
            created_at,
            updated_at
        FROM addresses
        WHERE id = ?
          AND user_id = ?
    `;

    const [rows] = await db.execute(sql, [addressId, userId]);

    return rows[0] || null;
  },

  async updateAddress(addressId, userId, addressData) {
    const sql = `
        UPDATE addresses
        SET
            full_name = ?,
            phone = ?,
            address_line1 = ?,
            address_line2 = ?,
            city = ?,
            state = ?,
            postal_code = ?,
            country = ?,
            address_type = ?
        WHERE id = ?
        AND user_id = ?
    `;

    const values = [
      addressData.full_name,
      addressData.phone,
      addressData.address_line1,
      addressData.address_line2,
      addressData.city,
      addressData.state,
      addressData.postal_code,
      addressData.country,
      addressData.address_type,
      addressId,
      userId,
    ];

    const [result] = await db.execute(sql, values);

    return result;
  },

  async getAddressByIdDefault(addressId, userId) {
    const sql = `
        SELECT id, is_default
        FROM addresses
        WHERE id = ?
        AND user_id = ?
    `;

    const [rows] = await db.execute(sql, [addressId, userId]);

    return rows[0] || null;
  },

  async deleteAddress(addressId, userId) {
    const sql = `
        DELETE FROM addresses
        WHERE id = ?
        AND user_id = ?
    `;

    const [result] = await db.execute(sql, [addressId, userId]);

    return result;
  },

  async getLatestAddress(userId) {
    const sql = `
        SELECT id
        FROM addresses
        WHERE user_id = ?
        ORDER BY created_at DESC
        LIMIT 1
    `;

    const [rows] = await db.execute(sql, [userId]);

    return rows[0] || null;
  },

  async setDefaultAddress(addressId, userId) {
    const sql = `
        UPDATE addresses
        SET is_default = TRUE
        WHERE id = ?
        AND user_id = ?
    `;

    await db.execute(sql, [addressId, userId]);
  },

  async clearDefaultAddress(userId) {
    const sql = `
        UPDATE addresses
        SET is_default = FALSE
        WHERE user_id = ?
    `;

    await db.execute(sql, [userId]);
  },
};

module.exports = AddressModel;
