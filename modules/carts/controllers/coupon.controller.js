import Coupon from "../models/coupon.model.js";

// Admin: Create coupon
export const createCoupon = async (req, res) => {
  try {
    const {
      code,
      description,
      discountType,
      discountValue,
      maxUses,
      minPurchaseAmount,
      expiryDate,
    } = req.body;

    if (!code || !discountType || discountValue === undefined) {
      return res.status(400).json({
        error: "code, discountType, and discountValue are required",
      });
    }

    const coupon = await Coupon.create({
      code: code.toUpperCase(),
      description,
      discountType,
      discountValue,
      maxUses,
      minPurchaseAmount,
      expiryDate,
    });

    return res.status(201).json({
      message: "Coupon created successfully",
      coupon,
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ error: "Coupon code already exists" });
    }
    return res.status(500).json({ error: err.message });
  }
};

// Admin: Get all coupons
export const getAllCoupons = async (req, res) => {
  try {
    const { isActive } = req.query;

    const filter = {};
    if (isActive !== undefined) {
      filter.isActive = isActive === "true";
    }

    const coupons = await Coupon.find(filter).sort({ createdAt: -1 });

    return res.json(coupons);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// Admin: Get single coupon
export const getCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);

    if (!coupon) {
      return res.status(404).json({ error: "Coupon not found" });
    }

    return res.json(coupon);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// Admin: Update coupon
export const updateCoupon = async (req, res) => {
  try {
    const {
      code,
      description,
      discountType,
      discountValue,
      maxUses,
      minPurchaseAmount,
      isActive,
      expiryDate,
    } = req.body;

    const updates = {};
    if (code) updates.code = code.toUpperCase();
    if (description !== undefined) updates.description = description;
    if (discountType) updates.discountType = discountType;
    if (discountValue !== undefined) updates.discountValue = discountValue;
    if (maxUses !== undefined) updates.maxUses = maxUses;
    if (minPurchaseAmount !== undefined)
      updates.minPurchaseAmount = minPurchaseAmount;
    if (isActive !== undefined) updates.isActive = isActive;
    if (expiryDate !== undefined) updates.expiryDate = expiryDate;

    const coupon = await Coupon.findByIdAndUpdate(req.params.id, updates, {
      new: true,
    });

    if (!coupon) {
      return res.status(404).json({ error: "Coupon not found" });
    }

    return res.json({ message: "Coupon updated", coupon });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ error: "Coupon code already exists" });
    }
    return res.status(500).json({ error: err.message });
  }
};

// Admin: Delete coupon
export const deleteCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndDelete(req.params.id);

    if (!coupon) {
      return res.status(404).json({ error: "Coupon not found" });
    }

    return res.json({ message: "Coupon deleted", coupon });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// Admin: Reset coupon usage
export const resetCouponUsage = async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndUpdate(
      req.params.id,
      { currentUses: 0 },
      { new: true }
    );

    if (!coupon) {
      return res.status(404).json({ error: "Coupon not found" });
    }

    return res.json({ message: "Coupon usage reset", coupon });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
