const Market = require('../models/Market');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const getMarkets = asyncHandler(async (req, res) => {
  const filter = { isActive: true };

  if (req.query.search) {
    const search = new RegExp(escapeRegex(req.query.search.trim()), 'i');
    filter.$or = [{ name: search }, { address: search }];
  }

  if (req.query.day) {
    filter.marketDays = req.query.day.toLowerCase();
  }

  if (req.query.longitude && req.query.latitude) {
    const longitude = Number(req.query.longitude);
    const latitude = Number(req.query.latitude);
    const radiusKm = Math.min(Number(req.query.radiusKm) || 25, 100);

    if (!Number.isFinite(longitude) || !Number.isFinite(latitude)) {
      throw new AppError('Longitude and latitude must be valid numbers', 400);
    }

    filter.location = {
      $near: {
        $geometry: { type: 'Point', coordinates: [longitude, latitude] },
        $maxDistance: radiusKm * 1000,
      },
    };
  }

  const markets = await Market.find(filter).sort({ name: 1 });

  res.status(200).json({
    success: true,
    count: markets.length,
    data: { markets },
  });
});

const getMarket = asyncHandler(async (req, res) => {
  const market = await Market.findOne({ _id: req.params.id, isActive: true });

  if (!market) throw new AppError('Market not found', 404);

  res.status(200).json({ success: true, data: { market } });
});

module.exports = { getMarkets, getMarket };

