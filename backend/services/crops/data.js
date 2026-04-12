export const crops = [
  { id: 1, name: 'Basmati Rice', category: 'Grains', price: 42, unit: 'kg', quantity: 500, farmerId: 1, farmer: 'Rajesh Kumar', location: 'Punjab', image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&q=80', rating: 4.8, reviews: 124, available: true, organic: true, description: 'Premium quality long-grain basmati rice, freshly harvested from Punjab fields.', approvalStatus: 'Approved' },
  { id: 2, name: 'Alphonso Mango', category: 'Fruits', price: 120, unit: 'kg', quantity: 200, farmerId: 4, farmer: 'Suresh Patil', location: 'Maharashtra', image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=400&q=80', rating: 4.9, reviews: 89, available: true, organic: false, description: 'World-famous Alphonso mangoes with rich aroma and sweet taste.', approvalStatus: 'Approved' },
  { id: 3, name: 'Fresh Tomatoes', category: 'Vegetables', price: 28, unit: 'kg', quantity: 300, farmerId: 6, farmer: 'Anita Sharma', location: 'Karnataka', image: 'https://images.unsplash.com/photo-1558818498-28c1e002b655?w=400&q=80', rating: 4.5, reviews: 67, available: true, organic: true, description: 'Farm-fresh juicy tomatoes, harvested daily for maximum freshness.', approvalStatus: 'Approved' },
  { id: 4, name: 'Wheat Flour', category: 'Grains', price: 35, unit: 'kg', quantity: 1000, farmerId: 1, farmer: 'Vikram Singh', location: 'Haryana', image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&q=80', rating: 4.6, reviews: 201, available: true, organic: false, description: 'Stone-ground whole wheat flour, rich in fiber and nutrients.', approvalStatus: 'Approved' },
  { id: 5, name: 'Banana', category: 'Fruits', price: 45, unit: 'dozen', quantity: 150, farmerId: 1, farmer: 'Priya Nair', location: 'Kerala', image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&q=80', rating: 4.4, reviews: 56, available: true, organic: true, description: 'Naturally ripened bananas from Kerala plantations.', approvalStatus: 'Approved' },
  { id: 6, name: 'Onion', category: 'Vegetables', price: 22, unit: 'kg', quantity: 800, farmerId: 4, farmer: 'Manoj Desai', location: 'Maharashtra', image: 'https://images.unsplash.com/photo-1518977676405-d6a6d35d2e1a?w=400&q=80', rating: 4.3, reviews: 143, available: true, organic: false, description: 'Fresh red onions directly from Nashik farms.', approvalStatus: 'Approved' },
  { id: 7, name: 'Groundnut', category: 'Grains', price: 65, unit: 'kg', quantity: 400, farmerId: 1, farmer: 'Ramesh Patel', location: 'Gujarat', image: 'https://images.unsplash.com/photo-1567653418944-75e8ae68b636?w=400&q=80', rating: 4.7, reviews: 78, available: true, organic: true, description: 'High-quality groundnuts, ideal for oil extraction and snacking.', approvalStatus: 'Approved' },
  { id: 8, name: 'Spinach', category: 'Vegetables', price: 18, unit: 'kg', quantity: 100, farmerId: 6, farmer: 'Lakshmi Devi', location: 'Tamil Nadu', image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400&q=80', rating: 4.6, reviews: 45, available: false, organic: true, description: 'Fresh organic spinach, packed with iron and vitamins.', approvalStatus: 'Pending' },
  { id: 9, name: 'Turmeric', category: 'Spices', price: 180, unit: 'kg', quantity: 250, farmerId: 1, farmer: 'Venkat Rao', location: 'Andhra Pradesh', image: 'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=400&q=80', rating: 4.9, reviews: 92, available: true, organic: true, description: 'Pure Erode turmeric with high curcumin content.', approvalStatus: 'Approved' },
  { id: 10, name: 'Green Chilli', category: 'Vegetables', price: 55, unit: 'kg', quantity: 180, farmerId: 1, farmer: 'Shyam Lal', location: 'Rajasthan', image: 'https://images.unsplash.com/photo-1588252303782-cb80119abd6d?w=400&q=80', rating: 4.4, reviews: 38, available: true, organic: false, description: 'Fiery green chillies for that perfect spice kick.', approvalStatus: 'Approved' },
  { id: 11, name: 'Potato', category: 'Vegetables', price: 20, unit: 'kg', quantity: 2000, farmerId: 1, farmer: 'Dilip Verma', location: 'Uttar Pradesh', image: 'https://images.unsplash.com/photo-1518977676405-d6a6d35d2e1a?w=400&q=80', rating: 4.2, reviews: 310, available: true, organic: false, description: 'Fresh potatoes from the fertile plains of Uttar Pradesh.', approvalStatus: 'Approved' },
  { id: 12, name: 'Sugarcane Jaggery', category: 'Processed', price: 90, unit: 'kg', quantity: 600, farmerId: 6, farmer: 'Arun Nikam', location: 'Karnataka', image: 'https://images.unsplash.com/photo-1607920592519-bab15d97ab0e?w=400&q=80', rating: 4.8, reviews: 61, available: true, organic: true, description: 'Traditional organic jaggery made from fresh sugarcane juice.', approvalStatus: 'Approved' },
];

export const categories = [
  { id: 'all', label: 'All', icon: '🌾' },
  { id: 'Fruits', label: 'Fruits', icon: '🍎' },
  { id: 'Vegetables', label: 'Vegetables', icon: '🥦' },
  { id: 'Grains', label: 'Grains', icon: '🌾' },
  { id: 'Spices', label: 'Spices', icon: '🌶️' },
  { id: 'Processed', label: 'Processed', icon: '🫙' },
];

export const farmers = [
  { id: 1, name: 'Rajesh Kumar', location: 'Punjab', crops: 8, rating: 4.8, image: 'https://randomuser.me/api/portraits/men/32.jpg', verified: true, yearsActive: 5 },
  { id: 2, name: 'Suresh Patil', location: 'Maharashtra', crops: 5, rating: 4.9, image: 'https://randomuser.me/api/portraits/men/45.jpg', verified: true, yearsActive: 8 },
  { id: 3, name: 'Anita Sharma', location: 'Karnataka', crops: 12, rating: 4.5, image: 'https://randomuser.me/api/portraits/women/28.jpg', verified: true, yearsActive: 3 },
  { id: 4, name: 'Vikram Singh', location: 'Haryana', crops: 6, rating: 4.6, image: 'https://randomuser.me/api/portraits/men/67.jpg', verified: false, yearsActive: 6 },
];

export const cropVarieties = [
  // Grains > Rice
  { id: 'v-001', category: 'Grains', subCategory: 'Rice', variety: 'Basmati Rice' },
  { id: 'v-002', category: 'Grains', subCategory: 'Rice', variety: 'Sona Masoori' },
  { id: 'v-003', category: 'Grains', subCategory: 'Rice', variety: 'Ponni Rice' },
  { id: 'v-004', category: 'Grains', subCategory: 'Rice', variety: 'Brown Rice' },
  // Grains > Wheat
  { id: 'v-005', category: 'Grains', subCategory: 'Wheat', variety: 'Wheat Flour' },
  { id: 'v-006', category: 'Grains', subCategory: 'Wheat', variety: 'Whole Wheat' },
  { id: 'v-007', category: 'Grains', subCategory: 'Wheat', variety: 'Durum Wheat' },
  // Grains > Millets
  { id: 'v-008', category: 'Grains', subCategory: 'Millets', variety: 'Ragi (Finger Millet)' },
  { id: 'v-009', category: 'Grains', subCategory: 'Millets', variety: 'Jowar (Sorghum)' },
  { id: 'v-010', category: 'Grains', subCategory: 'Millets', variety: 'Bajra (Pearl Millet)' },
  // Grains > Pulses & Legumes
  { id: 'v-011', category: 'Grains', subCategory: 'Pulses & Legumes', variety: 'Groundnut' },
  { id: 'v-012', category: 'Grains', subCategory: 'Pulses & Legumes', variety: 'Chana Dal' },
  { id: 'v-013', category: 'Grains', subCategory: 'Pulses & Legumes', variety: 'Moong Dal' },
  { id: 'v-014', category: 'Grains', subCategory: 'Pulses & Legumes', variety: 'Toor Dal' },

  // Fruits > Mango
  { id: 'v-015', category: 'Fruits', subCategory: 'Mango', variety: 'Alphonso Mango' },
  { id: 'v-016', category: 'Fruits', subCategory: 'Mango', variety: 'Kesar Mango' },
  { id: 'v-017', category: 'Fruits', subCategory: 'Mango', variety: 'Dasheri Mango' },
  // Fruits > Banana
  { id: 'v-018', category: 'Fruits', subCategory: 'Banana', variety: 'Robusta Banana' },
  { id: 'v-019', category: 'Fruits', subCategory: 'Banana', variety: 'Nendran Banana' },
  { id: 'v-020', category: 'Fruits', subCategory: 'Banana', variety: 'Elaichi Banana' },
  // Fruits > Citrus
  { id: 'v-021', category: 'Fruits', subCategory: 'Citrus', variety: 'Nagpur Orange' },
  { id: 'v-022', category: 'Fruits', subCategory: 'Citrus', variety: 'Sweet Lime (Mosambi)' },
  { id: 'v-023', category: 'Fruits', subCategory: 'Citrus', variety: 'Lemon' },
  // Fruits > Other Fruits
  { id: 'v-024', category: 'Fruits', subCategory: 'Other Fruits', variety: 'Pomegranate' },
  { id: 'v-025', category: 'Fruits', subCategory: 'Other Fruits', variety: 'Guava' },
  { id: 'v-026', category: 'Fruits', subCategory: 'Other Fruits', variety: 'Papaya' },

  // Vegetables > Leafy Greens
  { id: 'v-027', category: 'Vegetables', subCategory: 'Leafy Greens', variety: 'Spinach' },
  { id: 'v-028', category: 'Vegetables', subCategory: 'Leafy Greens', variety: 'Methi (Fenugreek)' },
  { id: 'v-029', category: 'Vegetables', subCategory: 'Leafy Greens', variety: 'Coriander' },
  // Vegetables > Root Vegetables
  { id: 'v-030', category: 'Vegetables', subCategory: 'Root Vegetables', variety: 'Potato' },
  { id: 'v-031', category: 'Vegetables', subCategory: 'Root Vegetables', variety: 'Onion' },
  { id: 'v-032', category: 'Vegetables', subCategory: 'Root Vegetables', variety: 'Carrot' },
  { id: 'v-033', category: 'Vegetables', subCategory: 'Root Vegetables', variety: 'Beetroot' },
  // Vegetables > Solanaceae
  { id: 'v-034', category: 'Vegetables', subCategory: 'Solanaceae', variety: 'Fresh Tomatoes' },
  { id: 'v-035', category: 'Vegetables', subCategory: 'Solanaceae', variety: 'Brinjal (Eggplant)' },
  { id: 'v-036', category: 'Vegetables', subCategory: 'Solanaceae', variety: 'Green Chilli' },
  { id: 'v-037', category: 'Vegetables', subCategory: 'Solanaceae', variety: 'Capsicum' },
  // Vegetables > Gourds & Others
  { id: 'v-038', category: 'Vegetables', subCategory: 'Gourds & Others', variety: 'Bottle Gourd' },
  { id: 'v-039', category: 'Vegetables', subCategory: 'Gourds & Others', variety: 'Bitter Gourd' },
  { id: 'v-040', category: 'Vegetables', subCategory: 'Gourds & Others', variety: 'Okra (Bhindi)' },
  { id: 'v-041', category: 'Vegetables', subCategory: 'Gourds & Others', variety: 'Cauliflower' },

  // Spices
  { id: 'v-042', category: 'Spices', subCategory: 'Whole Spices', variety: 'Turmeric' },
  { id: 'v-043', category: 'Spices', subCategory: 'Whole Spices', variety: 'Red Chilli' },
  { id: 'v-044', category: 'Spices', subCategory: 'Whole Spices', variety: 'Black Pepper' },
  { id: 'v-045', category: 'Spices', subCategory: 'Whole Spices', variety: 'Cumin (Jeera)' },
  { id: 'v-046', category: 'Spices', subCategory: 'Seed Spices', variety: 'Mustard Seeds' },
  { id: 'v-047', category: 'Spices', subCategory: 'Seed Spices', variety: 'Coriander Seeds' },
  { id: 'v-048', category: 'Spices', subCategory: 'Seed Spices', variety: 'Fennel (Saunf)' },
  { id: 'v-049', category: 'Spices', subCategory: 'Aromatic Spices', variety: 'Cardamom' },
  { id: 'v-050', category: 'Spices', subCategory: 'Aromatic Spices', variety: 'Clove' },
  { id: 'v-051', category: 'Spices', subCategory: 'Aromatic Spices', variety: 'Cinnamon' },

  // Processed
  { id: 'v-052', category: 'Processed', subCategory: 'Sweeteners', variety: 'Sugarcane Jaggery' },
  { id: 'v-053', category: 'Processed', subCategory: 'Sweeteners', variety: 'Palm Jaggery' },
  { id: 'v-054', category: 'Processed', subCategory: 'Sweeteners', variety: 'Honey' },
  { id: 'v-055', category: 'Processed', subCategory: 'Oils', variety: 'Groundnut Oil' },
  { id: 'v-056', category: 'Processed', subCategory: 'Oils', variety: 'Coconut Oil' },
  { id: 'v-057', category: 'Processed', subCategory: 'Oils', variety: 'Mustard Oil' },
  { id: 'v-058', category: 'Processed', subCategory: 'Flours & Powders', variety: 'Besan (Gram Flour)' },
  { id: 'v-059', category: 'Processed', subCategory: 'Flours & Powders', variety: 'Rice Flour' },
  { id: 'v-060', category: 'Processed', subCategory: 'Flours & Powders', variety: 'Ragi Flour' },
];

// Build a lookup map for quick variety resolution
export const varietyMap = Object.fromEntries(cropVarieties.map(v => [v.id, v]));

let nextId = crops.length + 1;
export function getNextId() { return nextId++; }
