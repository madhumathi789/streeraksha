/*const mongoose = require('mongoose');

const guardianSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    relationship: {
      type: String,
      default: 'Friend',
    },
    verified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Guardian', guardianSchema);*/
const mongoose = require('mongoose');

const guardianSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    relationship: {
      type: String,
      default: 'Friend',
    },
    verified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Guardian', guardianSchema);
