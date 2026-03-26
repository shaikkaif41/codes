const slugify = require('slugify');

const generateSlug = (text) => {
  return slugify(text, { lower: true, strict: true });
};

const calculateCartTotal = (items) => {
  return items.reduce((total, item) => {
    return total + item.price * item.quantity;
  }, 0);
};

const formatPrice = (price) => {
  return parseFloat(price).toFixed(2);
};

const generateOrderNumber = () => {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `ORD-${timestamp}-${random}`;
};

module.exports = {
  generateSlug,
  calculateCartTotal,
  formatPrice,
  generateOrderNumber,
};
