const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

const User = require('./models/User');
const Product = require('./models/Product');

const sampleProducts = [
  {
    name: 'MRF Genius Grand Edition Cricket Bat',
    description: 'Premium English Willow cricket bat used by international players. Perfect balance and massive sweet spot for aggressive stroke play. Grade 1 English Willow with thick edges and full profile.',
    price: 4999,
    originalPrice: 6999,
    category: 'cricket',
    brand: 'MRF',
    stock: 25,
    images: [{ url: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800', publicId: 'cricket-bat-1' }],
    featured: true,
    tags: ['cricket', 'bat', 'english-willow', 'professional'],
  },
  {
    name: 'SG Test Cricket Ball (Pack of 6)',
    description: 'Official SG Test cricket ball made with premium leather. Four-piece construction with hand-stitched seam. Approved for first-class cricket matches.',
    price: 2499,
    originalPrice: 2999,
    category: 'cricket',
    brand: 'SG',
    stock: 50,
    images: [{ url: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=800', publicId: 'cricket-ball-1' }],
    tags: ['cricket', 'ball', 'leather', 'test-match'],
  },
  {
    name: 'Nike Flight Premier League Football',
    description: 'Official match ball with Aerowsculpt technology for consistent flight. Machine-stitched casing with textured surface for improved grip and control.',
    price: 3499,
    originalPrice: 4499,
    category: 'football',
    brand: 'Nike',
    stock: 30,
    images: [{ url: 'https://images.unsplash.com/photo-1614632537190-23e4146777db?w=800', publicId: 'football-1' }],
    featured: true,
    tags: ['football', 'soccer', 'match-ball', 'premier-league'],
  },
  {
    name: 'Adidas Predator Edge Football Boots',
    description: 'Elite football boots with Zone Skin upper for enhanced ball control. Faceted Controlframe outsole for explosive acceleration and sharp turns on firm ground.',
    price: 7999,
    originalPrice: 9999,
    category: 'football',
    brand: 'Adidas',
    stock: 15,
    images: [{ url: 'https://images.unsplash.com/photo-1511886929837-354d827aae26?w=800', publicId: 'football-boots-1' }],
    featured: true,
    tags: ['football', 'boots', 'firm-ground', 'professional'],
  },
  {
    name: 'Spalding NBA Official Indoor Basketball',
    description: 'Official NBA game ball with full-grain leather cover. Superior grip, bounce, and durability for indoor court play. FIBA approved size and weight.',
    price: 2999,
    originalPrice: 3999,
    category: 'basketball',
    brand: 'Spalding',
    stock: 20,
    images: [{ url: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800', publicId: 'basketball-1' }],
    tags: ['basketball', 'nba', 'indoor', 'official'],
  },
  {
    name: 'Yonex Astrox 99 Badminton Racket',
    description: 'Premium badminton racket with Rotational Generator System for steep attack angles. Namd graphite shaft for increased shuttle hold and powerful smashes.',
    price: 8999,
    originalPrice: 11999,
    category: 'badminton',
    brand: 'Yonex',
    stock: 12,
    images: [{ url: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=800', publicId: 'badminton-racket-1' }],
    featured: true,
    tags: ['badminton', 'racket', 'professional', 'advanced'],
  },
  {
    name: 'Wilson Pro Staff 97 Tennis Racket',
    description: 'Roger Federer signature tennis racket with Braided Graphite & Kevlar construction. 97 sq in head size for precision and control. Ideal for advanced players.',
    price: 12999,
    originalPrice: 15999,
    category: 'tennis',
    brand: 'Wilson',
    stock: 8,
    images: [{ url: 'https://images.unsplash.com/photo-1617883861744-13b534e1b1ea?w=800', publicId: 'tennis-racket-1' }],
    tags: ['tennis', 'racket', 'professional', 'graphite'],
  },
  {
    name: 'Stag Championship Table Tennis Set',
    description: 'Complete table tennis set with 2 professional-grade rackets, 3 ITTF approved balls, and carry case. 5-ply blade with ITTF rubber for optimal spin and speed.',
    price: 1499,
    originalPrice: 1999,
    category: 'indoor-games',
    brand: 'Stag',
    stock: 35,
    images: [{ url: 'https://images.unsplash.com/photo-1558743212-c9e67ccd3e76?w=800', publicId: 'table-tennis-1' }],
    tags: ['table-tennis', 'indoor', 'racket', 'set'],
  },
  {
    name: 'PowerMax Adjustable Dumbbell Set (20kg)',
    description: 'Adjustable dumbbell set with quick-lock mechanism. Ranges from 2.5kg to 20kg per dumbbell. Chrome-plated steel with rubber grip handles for comfortable workout.',
    price: 3999,
    originalPrice: 5499,
    category: 'fitness',
    brand: 'PowerMax',
    stock: 18,
    images: [{ url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800', publicId: 'dumbbell-1' }],
    featured: true,
    tags: ['fitness', 'dumbbell', 'weight-training', 'home-gym'],
  },
  {
    name: 'Speedo Fastskin LZR Racer Swimming Goggles',
    description: 'Competition swimming goggles with IQfit technology for leak-free seal. Anti-fog coating and UV protection. Hydrodynamic lens shape for reduced drag.',
    price: 1999,
    originalPrice: 2499,
    category: 'swimming',
    brand: 'Speedo',
    stock: 40,
    images: [{ url: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=800', publicId: 'swimming-goggles-1' }],
    tags: ['swimming', 'goggles', 'competition', 'anti-fog'],
  },
  {
    name: 'Hero Sprint Pro 26T Mountain Bike',
    description: 'Rugged mountain bike with 21-speed Shimano gears. Double-wall alloy rims, front suspension fork, and disc brakes. Perfect for trails and daily commutes.',
    price: 15999,
    originalPrice: 19999,
    category: 'cycling',
    brand: 'Hero',
    stock: 5,
    images: [{ url: 'https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?w=800', publicId: 'mountain-bike-1' }],
    featured: true,
    tags: ['cycling', 'mountain-bike', '21-speed', 'disc-brake'],
  },
  {
    name: 'Kho Kho Training Kit',
    description: 'Complete Kho Kho training kit including poles, marking tape, and official rule book. Suitable for school and club-level training and tournaments.',
    price: 2999,
    category: 'local-sports',
    brand: 'SportIndia',
    stock: 10,
    images: [{ url: 'https://images.unsplash.com/photo-1461896836934-bd45ba4c8e36?w=800', publicId: 'kho-kho-1' }],
    tags: ['kho-kho', 'local-sport', 'training', 'indian-sport'],
  },
  {
    name: 'Cricket Batting Pads - Pro Edition',
    description: 'Lightweight batting pads with high-density foam protection. Three-strap fastening system for secure fit. Sweat-absorbent inner lining.',
    price: 1899,
    originalPrice: 2499,
    category: 'cricket',
    brand: 'SS',
    stock: 22,
    images: [{ url: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800', publicId: 'batting-pads-1' }],
    tags: ['cricket', 'pads', 'protection', 'batting'],
  },
  {
    name: 'Resistance Band Set (5 Levels)',
    description: 'Complete resistance band set with 5 different resistance levels. Includes door anchor, ankle straps, and carry bag. Perfect for home workouts and physical therapy.',
    price: 799,
    originalPrice: 1299,
    category: 'fitness',
    brand: 'FitBeast',
    stock: 60,
    images: [{ url: 'https://images.unsplash.com/photo-1598268030450-7a476f602eea?w=800', publicId: 'resistance-bands-1' }],
    tags: ['fitness', 'resistance-bands', 'home-workout', 'accessories'],
  },
  {
    name: 'Professional Sports Water Bottle (1L)',
    description: 'BPA-free sports water bottle with squeeze cap and measurement markings. Leak-proof design with wide mouth for easy cleaning. Suitable for all sports.',
    price: 399,
    originalPrice: 599,
    category: 'accessories',
    brand: 'Decathlon',
    stock: 100,
    images: [{ url: 'https://images.unsplash.com/photo-1523362628745-0c100150b504?w=800', publicId: 'water-bottle-1' }],
    tags: ['accessories', 'water-bottle', 'hydration', 'bpa-free'],
  },
  {
    name: 'Carrom Board Tournament Edition',
    description: 'Official tournament size carrom board (32x32 inches) with premium plywood construction. Smooth playing surface with beveled edges. Includes striker and coins.',
    price: 3499,
    originalPrice: 4299,
    category: 'indoor-games',
    brand: 'Surco',
    stock: 8,
    images: [{ url: 'https://images.unsplash.com/photo-1611996575749-79a3a250f948?w=800', publicId: 'carrom-1' }],
    featured: true,
    tags: ['carrom', 'indoor', 'board-game', 'tournament'],
  },
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Product.deleteMany({});
    console.log('Cleared existing data');

    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 12);
    await User.create({
      name: 'Admin User',
      email: 'admin@sportsshop.com',
      password: adminPassword,
      role: 'admin',
    });

    // Create test customer
    const customerPassword = await bcrypt.hash('customer123', 12);
    await User.create({
      name: 'Test Customer',
      email: 'customer@test.com',
      password: customerPassword,
      role: 'customer',
    });

    console.log('Created admin and test users');

    // Create products (using create to trigger pre-save hooks for slug generation)
    for (const productData of sampleProducts) {
      await Product.create(productData);
    }
    console.log(`Seeded ${sampleProducts.length} products`);

    console.log('Database seeding completed successfully!');
    console.log('\nTest Accounts:');
    console.log('Admin: admin@sportsshop.com / admin123');
    console.log('Customer: customer@test.com / customer123');

    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedDatabase();
