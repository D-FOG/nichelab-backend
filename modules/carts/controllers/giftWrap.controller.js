import GiftWrap from "../models/giftWrap.model.js";

// Admin: Create gift wrap
export const createGiftWrap = async (req, res) => {
  try {
    const { name, description, price } = req.body;

    if (!name || price === undefined) {
      return res.status(400).json({ error: "name and price are required" });
    }

    const giftWrap = await GiftWrap.create({
      name,
      description,
      price,
    });

    return res.status(201).json({
      message: "Gift wrap created successfully",
      giftWrap,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// Admin: Get all gift wraps
export const getAllGiftWraps = async (req, res) => {
  try {
    const { isActive } = req.query;

    const filter = {};
    if (isActive !== undefined) {
      filter.isActive = isActive === "true";
    }

    const giftWraps = await GiftWrap.find(filter).sort({ createdAt: -1 });

    return res.json(giftWraps);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// Admin: Get single gift wrap
export const getGiftWrap = async (req, res) => {
  try {
    const giftWrap = await GiftWrap.findById(req.params.id);

    if (!giftWrap) {
      return res.status(404).json({ error: "Gift wrap not found" });
    }

    return res.json(giftWrap);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// Admin: Update gift wrap
export const updateGiftWrap = async (req, res) => {
  try {
    const { name, description, price, isActive } = req.body;

    const updates = {};
    if (name) updates.name = name;
    if (description !== undefined) updates.description = description;
    if (price !== undefined) updates.price = price;
    if (isActive !== undefined) updates.isActive = isActive;

    const giftWrap = await GiftWrap.findByIdAndUpdate(req.params.id, updates, {
      new: true,
    });

    if (!giftWrap) {
      return res.status(404).json({ error: "Gift wrap not found" });
    }

    return res.json({ message: "Gift wrap updated", giftWrap });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// Admin: Delete gift wrap
export const deleteGiftWrap = async (req, res) => {
  try {
    const giftWrap = await GiftWrap.findByIdAndDelete(req.params.id);

    if (!giftWrap) {
      return res.status(404).json({ error: "Gift wrap not found" });
    }

    return res.json({ message: "Gift wrap deleted", giftWrap });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
