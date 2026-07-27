import { writeFileSync } from "node:fs";

let idCounter = 0;
function uid(prefix) {
  idCounter++;
  const hex = String(idCounter).padStart(12, "0");
  return `${prefix}-${hex.slice(0, 8)}-${hex.slice(8, 12)}-0000-000000000000`;
}

const categories = [
  { id: uid("cat"), name: "Desktop PCs", description: "High-performance desktop computers for work, gaming, and home use" },
  { id: uid("cat"), name: "Laptops", description: "Portable computers for professionals, students, and travelers" },
  { id: uid("cat"), name: "Smartphones", description: "Latest smartphones with cutting-edge technology and features" },
  { id: uid("cat"), name: "Clothing", description: "Fashionable apparel for men and women across all seasons" },
  { id: uid("cat"), name: "Shoes", description: "Footwear for sports, casual wear, and outdoor adventures" },
  { id: uid("cat"), name: "Accessories", description: "Tech accessories, peripherals, and lifestyle gadgets" },
];

const vendors = [
  { id: uid("ven"), name: "TechWorld", rating: 4.7 },
  { id: uid("ven"), name: "MegaStore", rating: 4.2 },
  { id: uid("ven"), name: "QuickShip", rating: 3.9 },
  { id: uid("ven"), name: "BudgetHub", rating: 3.5 },
  { id: uid("ven"), name: "PremiumSupply", rating: 4.9 },
];

const warehouses = [
  { id: uid("war"), name: "Berlin Distribution Center", country: "DE" },
  { id: uid("war"), name: "Vienna Logistics Hub", country: "AT" },
  { id: uid("war"), name: "Warsaw Fulfillment Center", country: "PL" },
  { id: uid("war"), name: "Amsterdam Warehouse", country: "NL" },
];

const vouchers = [
  { code: "WELCOME10", type: "percent", value: 10, description: "10% off your first order" },
  { code: "SUMMER20", type: "percent", value: 20, categoryId: categories[3].id, description: "20% off summer clothing" },
  { code: "FLAT500", type: "fixed", value: 500, description: "500 cents off any order" },
  { code: "MINORDER1000", type: "fixed", value: 1000, minOrderValue: 5000, description: "1000 cents off orders over 5000 cents" },
  { code: "EXPIRED2024", type: "percent", value: 15, validUntil: "2024-12-31", description: "15% off (expired)" },
  { code: "TECH20", type: "percent", value: 20, categoryId: categories[0].id, description: "20% off desktop PCs" },
  { code: "NEAREXPIRY", type: "percent", value: 10, validUntil: "2026-08-31", description: "10% off - expiring soon" },
  { code: "GENEROUS25", type: "percent", value: 25, description: "25% off everything - our best deal" },
];

const pcBrands = ["ProTech", "GamerForce", "HomeBase", "EliteSys", "MaxCompute", "PowerCore", "ApexDigital", "NovaTech"];
const laptopBrands = ["UltraSync", "PowerNote", "StudentTech", "BizPro", "TravelMate", "FlexBook", "AeroBook", "ZenLap"];
const phoneBrands = ["PixelZ", "GalaxyNote", "BudgetPhone", "XenonMobile", "ApexPhone", "OrionMobile", "NovaPhone"];
const clothingBrands = ["FashionFit", "UrbanStyle", "TrailBlazer", "ComfortWear", "EliteApparel", "NatureThreads"];
const shoeBrands = ["RunFast", "UrbanStep", "TrailMaster", "ComfortWalk", "SportFlex", "ElevateShoes"];
const accessoryBrands = ["TechGear", "ConnectPro", "PowerUp", "ErgoPlus", "SoundMax", "ViewMaster"];

const pcCpus = ["Intel Core i5-13400", "Intel Core i5-14400", "Intel Core i7-13700", "Intel Core i7-14700", "Intel Core i9-13900K", "Intel Core i9-14900K", "AMD Ryzen 5 7600", "AMD Ryzen 7 7800X3D", "AMD Ryzen 9 7950X", "AMD Ryzen 5 5600X"];
const laptopCpus = ["Intel Core i5-1335U", "Intel Core i5-1440P", "Intel Core i7-1360P", "Intel Core i7-1460P", "Intel Core i9-13900H", "AMD Ryzen 5 7530U", "AMD Ryzen 7 7840U", "AMD Ryzen 9 7940HS"];

const pcGpus = ["Integrated", "NVIDIA RTX 3060 12GB", "NVIDIA RTX 4060 8GB", "NVIDIA RTX 4070 12GB", "NVIDIA RTX 4080 16GB", "NVIDIA RTX 4090 24GB", "AMD Radeon RX 7600", "AMD Radeon RX 7800 XT", "AMD Radeon RX 7900 XTX"];
const laptopGpus = ["Integrated", "NVIDIA RTX 3050 6GB", "NVIDIA RTX 4050 6GB", "NVIDIA RTX 4060 8GB", "NVIDIA RTX 4070 8GB"];

const pcConfigs = [
  { ram: 8, storage: "256GB SSD", name: "8GB / 256GB" },
  { ram: 16, storage: "512GB SSD", name: "16GB / 512GB" },
  { ram: 32, storage: "1TB SSD", name: "32GB / 1TB" },
  { ram: 64, storage: "2TB SSD", name: "64GB / 2TB" },
];

const laptopConfigs = [
  { ram: 8, storage: "256GB SSD", name: "8GB / 256GB" },
  { ram: 16, storage: "512GB SSD", name: "16GB / 512GB" },
  { ram: 32, storage: "1TB SSD", name: "32GB / 1TB" },
];

const phoneConfigs = [
  { storage: "128GB", color: "Black", name: "128GB Black" },
  { storage: "128GB", color: "White", name: "128GB White" },
  { storage: "256GB", color: "Black", name: "256GB Black" },
  { storage: "256GB", color: "Blue", name: "256GB Blue" },
  { storage: "512GB", color: "Black", name: "512GB Black" },
];

const clothingSizes = ["S", "M", "L", "XL", "XXL"];
const clothingColors = ["Black", "White", "Blue", "Red", "Green"];

const shoeSizes = [38, 39, 40, 41, 42, 43, 44, 45, 46];
const shoeColors = ["Black", "White", "Brown", "Grey", "Navy"];

const accessoryTypes = [
  { name: "Black", colors: ["Black", "White"] },
  { name: "White", colors: ["White", "Silver"] },
  { name: "RGB", colors: ["Black", "White"] },
];

function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

function randInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

function generateOffer(vendorIdx, warehouseIdx, basePrice) {
  const vendor = vendors[vendorIdx];
  const warehouse = warehouses[warehouseIdx];
  const priceMultiplier = [1.0, 0.95, 1.05, 0.85, 1.2][vendorIdx];
  const price = Math.round(basePrice * priceMultiplier * (0.9 + Math.random() * 0.2) / 100) * 100;
  const shippingCost = Math.round((200 + Math.random() * 800) / 100) * 100;
  const hasFreeThreshold = Math.random() > 0.5;
  return {
    id: uid("off"),
    vendorId: vendor.id,
    warehouseId: warehouse.id,
    price,
    currency: "EUR",
    shippingCost,
    freeShippingThreshold: hasFreeThreshold ? price * 3 : undefined,
    deliveryDays: { min: randInt(2, 5), max: randInt(5, 12) },
    stock: randInt(0, 500),
  };
}

function generateOffers(basePrice) {
  const numOffers = randInt(2, 4);
  const used = new Set();
  const offers = [];
  for (let i = 0; i < numOffers; i++) {
    let vi, wi;
    do {
      vi = randInt(0, vendors.length - 1);
      wi = randInt(0, warehouses.length - 1);
    } while (used.has(`${vi}-${wi}`));
    used.add(`${vi}-${wi}`);
    offers.push(generateOffer(vi, wi, basePrice));
  }
  return offers;
}

function randomTags() {
  const pool = ["new", "bestseller", "sale", "trending", "limited", "premium", "budget", "eco-friendly", "wireless", "waterproof", "lightweight", "durable", "ergonomic", "gaming", "professional", "student", "travel", "home"];
  const count = randInt(1, 4);
  const tags = new Set();
  while (tags.size < count) tags.add(pick(pool));
  return [...tags];
}

const productGenerators = {
  [categories[0].id]: (count) => {
    const names = [
      "Pro Workstation", "Gamer X", "Home Office", "Business Elite", "PowerStation",
      "Creator Pro", "Mini PC", "Ultra Tower", "Silent Station", "Media Center",
      "Render Beast", "Stream Master", "Budget Builder", "Office Pro", "Developer Rig",
      "Server Station", "CAD Workstation", "Gaming Ultra", "Family PC", "Student Basic",
      "Performance X", "Eco Station", "Compact Pro", "Tower Extreme", "All-in-One Pro",
      "LAN Party Special", "Content Creator", "Data Science Pro", "Home Server", "Entry Level",
      "Professional CAD", "VR Ready", "Multi Monitor Pro", "Cloud Gaming", "Ultimate Render",
      "Zero Fan Silent", "Small Form Factor", "Rack Mount Pro", "High Availability", "Energy Efficient",
    ];
    const products = [];
    for (let i = 0; i < count && i < names.length; i++) {
      const name = names[i];
      const brand = pick(pcBrands);
      const cpu = pick(pcCpus);
      const gpu = pick(pcGpus);
      const basePrice = gpu === "Integrated" ? randInt(40000, 80000) : randInt(80000, 400000);
      const variants = [];
      for (const cfg of pcConfigs.slice(0, randInt(3, 4))) {
        const variantPrice = basePrice + (cfg.ram * 1500) + (cfg.storage.includes("2TB") ? 15000 : cfg.storage.includes("1TB") ? 8000 : cfg.storage.includes("512") ? 4000 : 2000);
        variants.push({
          id: uid("var"),
          sku: `${brand.slice(0, 3).toUpperCase()}-${name.replace(/\s/g, "").slice(0, 8)}-${cfg.ram}G-${cfg.storage.replace(/\s/g, "")}`,
          name: cfg.name,
          attributes: { ram: cfg.ram, storage: cfg.storage },
          offers: generateOffers(variantPrice),
        });
      }
      products.push({
        id: uid("prd"),
        categoryId: categories[0].id,
        name: `${brand} ${name}`,
        description: `High-performance ${name.toLowerCase()} desktop powered by ${cpu} with ${gpu} graphics.`,
        brand,
        tags: [...new Set([...randomTags(), gpu !== "Integrated" ? "gaming" : "professional"])],
        attributes: { cpu, ram_gb: pcConfigs[pcConfigs.length - 1].ram, storage: pcConfigs[pcConfigs.length - 1].storage, gpu, os: "Windows 11 Pro" },
        variants,
      });
    }
    return products;
  },

  [categories[1].id]: (count) => {
    const names = [
      "UltraBook Air", "PowerBook Pro", "StudentLite", "Business Travel", "Creator Studio",
      "Gaming Laptop", "Executive Slim", "Budget Notebook", "Convertible Flex", "Rugged Outdoor",
      "Developer Pro", "Designer Edition", "Student Chromebook", "Enterprise Secure", "Media Pro",
      "TravelLight 13", "Performance 16", "Essential 14", "Premium Slim", "Workstation Mobile",
      "Hybrid Pro", "Everyday Essential", "Power User", "Compact 13", "Ultra Slim 14",
      "Gaming Beast", "Creator 16", "Business Class", "Student Value", "Professional Mobility",
      "Lightweight Champ", "Multimedia Hub", "Developer Ultra", "Cloud Book", "Secure Business",
      "Eco Notebook", "Aluminum Pro", "Carbon Fiber", "Titanium Edition", "Budget Performer",
    ];
    const products = [];
    for (let i = 0; i < count && i < names.length; i++) {
      const name = names[i];
      const brand = pick(laptopBrands);
      const cpu = pick(laptopCpus);
      const gpu = pick(laptopGpus);
      const displaySize = pick(["13.3\"", "14\"", "15.6\"", "16\""]);
      const weight = pick(["1.2kg", "1.4kg", "1.8kg", "2.1kg", "2.5kg"]);
      const batteryLife = pick(["6h", "8h", "10h", "12h", "15h"]);
      const basePrice = gpu === "Integrated" ? randInt(50000, 100000) : randInt(100000, 350000);
      const variants = [];
      const configs = laptopConfigs.slice(0, randInt(2, 3));
      for (const cfg of configs) {
        const variantPrice = basePrice + (cfg.ram * 1500) + (cfg.storage.includes("1TB") ? 8000 : cfg.storage.includes("512") ? 4000 : 2000);
        variants.push({
          id: uid("var"),
          sku: `${brand.slice(0, 3).toUpperCase()}-${name.replace(/\s/g, "").slice(0, 8)}-${cfg.ram}G-${cfg.storage.replace(/\s/g, "")}`,
          name: cfg.name,
          attributes: { ram: cfg.ram, storage: cfg.storage },
          offers: generateOffers(variantPrice),
        });
      }
      products.push({
        id: uid("prd"),
        categoryId: categories[1].id,
        name: `${brand} ${name}`,
        description: `Versatile ${displaySize} ${name.toLowerCase()} laptop featuring ${cpu} with ${gpu}, weighs only ${weight}.`,
        brand,
        tags: [...new Set([...randomTags(), "portable", "laptop"])],
        attributes: { cpu, ram_gb: configs[configs.length - 1].ram, storage: configs[configs.length - 1].storage, gpu, display: displaySize, weight, battery: batteryLife, os: "Windows 11 Home" },
        variants,
      });
    }
    return products;
  },

  [categories[2].id]: (count) => {
    const names = [
      "PixelZ Pro", "GalaxyNote Ultra", "BudgetPhone X", "XenonMobile Edge", "ApexPhone Pro",
      "OrionMobile X", "NovaPhone S", "StarPhone 5G", "StreamPhone", "PhotoMaster Pro",
      "Compact Phone", "Business Smart", "Gaming Phone", "EcoPhone", "Waterproof Explorer",
      "Foldable Screen X", "Mini Smart", "Ultra Slim Phone", "Battery King", "5G Budget",
      "Premium Camera", "Secure Enterprise", "Travel Phone", "Music Focus", "Video Creator",
      "Dual Screen Pro", "Flagship Ultra", "Mid-Range Champ", "Value Smart", "Youth Edition",
      "Professional Plus", "Light Edition", "Plus Max", "Ultra Premium", "Smart Basic",
    ];
    const products = [];
    for (let i = 0; i < count && i < names.length; i++) {
      const name = names[i];
      const brand = pick(phoneBrands);
      const displaySize = pick(["6.1\"", "6.5\"", "6.7\"", "6.9\""]);
      const cameraMp = pick(["48MP", "50MP", "64MP", "108MP", "200MP"]);
      const batteryMah = pick(["4000mAh", "4500mAh", "5000mAh", "5500mAh"]);
      const basePrice = name.includes("Budget") || name.includes("Value") || name.includes("Basic") ? randInt(15000, 40000) : name.includes("Pro") || name.includes("Ultra") || name.includes("Premium") || name.includes("Flagship") || name.includes("Plus") ? randInt(70000, 150000) : randInt(40000, 70000);
      const variants = [];
      const configs = phoneConfigs.slice(0, randInt(3, 5));
      for (const cfg of configs) {
        const ram = cfg.storage === "128GB" ? pick([6, 8]) : cfg.storage === "256GB" ? pick([8, 12]) : 12;
        const storageGbs = cfg.storage === "512GB" ? 512 : cfg.storage === "256GB" ? 256 : 128;
        const variantPrice = basePrice + (ram * 1000) + (storageGbs * 200);
        variants.push({
          id: uid("var"),
          sku: `${brand.slice(0, 3).toUpperCase()}-${name.replace(/\s/g, "").slice(0, 8)}-${cfg.storage}-${cfg.color}`,
          name: cfg.name,
          attributes: { storage: cfg.storage, color: cfg.color, ram },
          offers: generateOffers(variantPrice),
        });
      }
      products.push({
        id: uid("prd"),
        categoryId: categories[2].id,
        name: `${brand} ${name}`,
        description: `Feature-packed smartphone with ${displaySize} ${cameraMp} camera and ${batteryMah} battery.`,
        brand,
        tags: [...new Set([...randomTags(), "smartphone", "5G"])],
        attributes: { display: displaySize, camera: cameraMp, battery: batteryMah, os: pick(["Android 14", "Android 15", "iOS 18"]) },
        variants,
      });
    }
    return products;
  },

  [categories[3].id]: (count) => {
    const products = [];
    const types = [
      { name: "Classic Oxford Shirt", material: "Cotton", season: "All-Season", basePrice: 3000 },
      { name: "Running Shorts Pro", material: "Polyester", season: "Summer", basePrice: 2500 },
      { name: "Winter Jacket Premium", material: "Down", season: "Winter", basePrice: 15000 },
      { name: "Casual T-Shirt", material: "Cotton", season: "Summer", basePrice: 1500 },
      { name: "Slim Fit Chinos", material: "Cotton Blend", season: "All-Season", basePrice: 4000 },
      { name: "Wool Sweater", material: "Merino Wool", season: "Winter", basePrice: 6000 },
      { name: "Denim Jacket", material: "Denim", season: "Fall", basePrice: 8000 },
      { name: "Polo Shirt", material: "Pique Cotton", season: "All-Season", basePrice: 3500 },
      { name: "Formal Blazer", material: "Wool Blend", season: "All-Season", basePrice: 12000 },
      { name: "Hoodie Fleece", material: "Fleece", season: "Fall", basePrice: 5000 },
      { name: "Linen Shirt", material: "Linen", season: "Summer", basePrice: 3500 },
      { name: "Cargo Pants", material: "Cotton Twill", season: "All-Season", basePrice: 4500 },
      { name: "Leather Jacket", material: "Leather", season: "Fall", basePrice: 20000 },
      { name: "Tracksuit Set", material: "Polyester", season: "All-Season", basePrice: 7000 },
      { name: "V-Neck Sweater", material: "Cashmere", season: "Winter", basePrice: 10000 },
      { name: "Bermuda Shorts", material: "Cotton", season: "Summer", basePrice: 2000 },
      { name: "Rain Coat", material: "Nylon", season: "Spring", basePrice: 9000 },
      { name: "Dress Shirt", material: "Cotton", season: "All-Season", basePrice: 4000 },
      { name: "Cardigan", material: "Wool", season: "Fall", basePrice: 6500 },
      { name: "Tank Top", material: "Cotton", season: "Summer", basePrice: 1200 },
      { name: "Bomber Jacket", material: "Nylon", season: "Spring", basePrice: 11000 },
      { name: "Joggers", material: "Fleece", season: "All-Season", basePrice: 3500 },
      { name: "Flannel Shirt", material: "Cotton", season: "Fall", basePrice: 3000 },
      { name: "Parka Coat", material: "Down", season: "Winter", basePrice: 22000 },
      { name: "Chino Shorts", material: "Cotton", season: "Summer", basePrice: 2500 },
      { name: "Turtleneck", material: "Merino Wool", season: "Winter", basePrice: 5500 },
      { name: "Windbreaker", material: "Polyester", season: "Spring", basePrice: 7500 },
      { name: "Crew Neck Tee", material: "Organic Cotton", season: "Summer", basePrice: 1800 },
      { name: "Sweatpants", material: "Fleece", season: "All-Season", basePrice: 3000 },
      { name: "Overcoat", material: "Wool", season: "Winter", basePrice: 25000 },
      { name: "Graphic Tee", material: "Cotton", season: "Summer", basePrice: 2000 },
      { name: "Vest", material: "Down", season: "Winter", basePrice: 8000 },
      { name: "Corduroy Pants", material: "Cotton", season: "Fall", basePrice: 5000 },
      { name: "Henley Shirt", material: "Cotton", season: "All-Season", basePrice: 2500 },
      { name: "Trench Coat", material: "Cotton", season: "Spring", basePrice: 18000 },
      { name: "Rugby Shirt", material: "Cotton", season: "Fall", basePrice: 4000 },
      { name: "Shortsleeve Shirt", material: "Linen", season: "Summer", basePrice: 3000 },
      { name: "Puffer Vest", material: "Synthetic", season: "Fall", basePrice: 7000 },
      { name: "Roll Neck Sweater", material: "Wool", season: "Winter", basePrice: 6000 },
      { name: "Sport Jacket", material: "Polyester", season: "All-Season", basePrice: 9500 },
    ];
    for (let i = 0; i < count && i < types.length; i++) {
      const t = types[i];
      const brand = pick(clothingBrands);
      const variants = [];
      const sizes = clothingSizes.slice(0, randInt(3, 5));
      const colors = clothingColors.slice(0, randInt(2, 4));
      const variantCount = randInt(3, Math.min(sizes.length * colors.length, 6));
      const usedSC = new Set();
      for (let v = 0; v < variantCount; v++) {
        let size, color;
        do {
          size = pick(sizes);
          color = pick(colors);
        } while (usedSC.has(`${size}-${color}`));
        usedSC.add(`${size}-${color}`);
        const variantPrice = t.basePrice + (["XL", "XXL"].includes(size) ? 500 : 0);
        variants.push({
          id: uid("var"),
          sku: `${brand.slice(0, 3).toUpperCase()}-${t.name.replace(/\s/g, "").slice(0, 8)}-${size}-${color}`,
          name: `${size} / ${color}`,
          attributes: { size, color },
          offers: generateOffers(variantPrice),
        });
      }
      products.push({
        id: uid("prd"),
        categoryId: categories[3].id,
        name: `${brand} ${t.name}`,
        description: `Comfortable ${t.name.toLowerCase()} made from ${t.material}, perfect for ${t.season.toLowerCase()} wear.`,
        brand,
        tags: [...new Set([...randomTags(), "clothing", t.season.toLowerCase()])],
        attributes: { material: t.material, season: t.season },
        variants,
      });
    }
    return products;
  },

  [categories[4].id]: (count) => {
    const products = [];
    const types = [
      { name: "Urban Runner", type: "Running", material: "Mesh", waterproof: false, basePrice: 8000 },
      { name: "Classic Sneaker", type: "Casual", material: "Canvas", waterproof: false, basePrice: 6000 },
      { name: "Hiking Boot Pro", type: "Hiking", material: "Leather", waterproof: true, basePrice: 14000 },
      { name: "Trail Runner", type: "Running", material: "Mesh", waterproof: false, basePrice: 10000 },
      { name: "Formal Oxford", type: "Formal", material: "Leather", waterproof: false, basePrice: 12000 },
      { name: "Basketball High Top", type: "Sports", material: "Synthetic", waterproof: false, basePrice: 11000 },
      { name: "Casual Loafers", type: "Casual", material: "Leather", waterproof: false, basePrice: 9000 },
      { name: "Winter Boot", type: "Boots", material: "Leather", waterproof: true, basePrice: 16000 },
      { name: "Sandal Sport", type: "Sandals", material: "EVA", waterproof: true, basePrice: 3500 },
      { name: "Cross Trainer", type: "Sports", material: "Mesh", waterproof: false, basePrice: 8500 },
      { name: "Chelsea Boot", type: "Boots", material: "Suede", waterproof: false, basePrice: 13000 },
      { name: "Canvas Slip-On", type: "Casual", material: "Canvas", waterproof: false, basePrice: 4500 },
      { name: "Dress Pump", type: "Formal", material: "Leather", waterproof: false, basePrice: 15000 },
      { name: "Waterproof Hiker", type: "Hiking", material: "Gore-Tex", waterproof: true, basePrice: 18000 },
      { name: "Running Light", type: "Running", material: "Knit", waterproof: false, basePrice: 7000 },
      { name: "Ankle Boot", type: "Boots", material: "Leather", waterproof: false, basePrice: 11000 },
      { name: "Tennis Shoe", type: "Sports", material: "Rubber", waterproof: false, basePrice: 7500 },
      { name: "Moccasin", type: "Casual", material: "Suede", waterproof: false, basePrice: 6500 },
      { name: "Snow Boot", type: "Boots", material: "Synthetic", waterproof: true, basePrice: 12000 },
      { name: "Espadrille", type: "Casual", material: "Canvas", waterproof: false, basePrice: 3000 },
      { name: "Climbing Shoe", type: "Sports", material: "Rubber", waterproof: false, basePrice: 10000 },
      { name: "Wingtip Brogue", type: "Formal", material: "Leather", waterproof: false, basePrice: 16000 },
      { name: "Slide Sandal", type: "Sandals", material: "EVA", waterproof: true, basePrice: 2000 },
      { name: "Golf Shoe", type: "Sports", material: "Leather", waterproof: true, basePrice: 12000 },
      { name: "Chukka Boot", type: "Boots", material: "Suede", waterproof: false, basePrice: 10000 },
      { name: "Walking Shoe", type: "Casual", material: "Mesh", waterproof: false, basePrice: 7000 },
      { name: "Platform Sneaker", type: "Casual", material: "Canvas", waterproof: false, basePrice: 8500 },
      { name: "Martial Arts Shoe", type: "Sports", material: "Canvas", waterproof: false, basePrice: 4000 },
      { name: "Rain Boot", type: "Boots", material: "Rubber", waterproof: true, basePrice: 5000 },
      { name: "Fashion Boot", type: "Boots", material: "Leather", waterproof: false, basePrice: 14000 },
    ];
    for (let i = 0; i < count && i < types.length; i++) {
      const t = types[i];
      const brand = pick(shoeBrands);
      const variants = [];
      const useSizes = shoeSizes.slice(randInt(0, 3), randInt(6, 9));
      const useColors = shoeColors.slice(0, randInt(2, 3));
      const variantCount = randInt(3, Math.min(useSizes.length * useColors.length, 8));
      const usedSC = new Set();
      for (let v = 0; v < variantCount; v++) {
        let size, color;
        do {
          size = pick(useSizes);
          color = pick(useColors);
        } while (usedSC.has(`${size}-${color}`));
        usedSC.add(`${size}-${color}`);
        const variantPrice = t.basePrice + (size > 44 ? 1000 : 0);
        variants.push({
          id: uid("var"),
          sku: `${brand.slice(0, 3).toUpperCase()}-${t.name.replace(/\s/g, "").slice(0, 8)}-${size}-${color}`,
          name: `EU ${size} / ${color}`,
          attributes: { size, color },
          offers: generateOffers(variantPrice),
        });
      }
      products.push({
        id: uid("prd"),
        categoryId: categories[4].id,
        name: `${brand} ${t.name}`,
        description: `${t.type === "Waterproof" || t.waterproof ? "Waterproof " : ""}${t.type} ${t.name.toLowerCase()} made from ${t.material}.`,
        brand,
        tags: [...new Set([...randomTags(), "shoes", t.type.toLowerCase(), t.waterproof ? "waterproof" : ""].filter(Boolean))],
        attributes: { type: t.type, material: t.material, waterproof: t.waterproof },
        variants,
      });
    }
    return products;
  },

  [categories[5].id]: (count) => {
    const products = [];
    const types = [
      { name: "Mechanical Keyboard RGB", connectivity: "Wired", features: "RGB Lighting", basePrice: 8000 },
      { name: "Wireless Mouse Pro", connectivity: "Wireless", features: "Ergonomic", basePrice: 5000 },
      { name: "USB-C Hub 7-in-1", connectivity: "Wired", features: "Multi-Port", basePrice: 3500 },
      { name: "Noise Cancelling Headphones", connectivity: "Bluetooth", features: "ANC", basePrice: 20000 },
      { name: "Webcam 4K", connectivity: "USB", features: "Auto-Focus", basePrice: 9000 },
      { name: "Laptop Stand", connectivity: "None", features: "Adjustable", basePrice: 4000 },
      { name: "Wireless Charger Pad", connectivity: "Qi Wireless", features: "Fast Charging", basePrice: 2500 },
      { name: "Portable SSD 1TB", connectivity: "USB-C", features: "High Speed", basePrice: 12000 },
      { name: "Gaming Headset", connectivity: "USB", features: "Surround Sound", basePrice: 7000 },
      { name: "Monitor Arm", connectivity: "None", features: "Articulating", basePrice: 6000 },
      { name: "Desk Lamp LED", connectivity: "USB", features: "Dimmable", basePrice: 3000 },
      { name: "Bluetooth Speaker", connectivity: "Bluetooth", features: "Waterproof", basePrice: 8000 },
      { name: "Card Reader USB-C", connectivity: "USB-C", features: "Multi-Slot", basePrice: 2000 },
      { name: "Mouse Pad XL", connectivity: "None", features: "Non-Slip", basePrice: 1500 },
      { name: "Cable Management Kit", connectivity: "None", features: "Organizer", basePrice: 1000 },
      { name: "Drawing Tablet", connectivity: "USB", features: "Pressure Sensitive", basePrice: 30000 },
      { name: "Phone Gimbal", connectivity: "Bluetooth", features: "3-Axis Stabilization", basePrice: 15000 },
      { name: "Power Bank 20000mAh", connectivity: "USB-C", features: "Fast Charge", basePrice: 5000 },
      { name: "WiFi Range Extender", connectivity: "WiFi", features: "Dual Band", basePrice: 3500 },
      { name: "USB Microphone", connectivity: "USB", features: "Studio Quality", basePrice: 10000 },
      { name: "Smartwatch Band", connectivity: "None", features: "Silicone", basePrice: 1500 },
      { name: "Screen Protector", connectivity: "None", features: "Tempered Glass", basePrice: 800 },
      { name: "External DVD Drive", connectivity: "USB", features: "Portable", basePrice: 2500 },
      { name: "VR Headset", connectivity: "USB-C", features: "4K Display", basePrice: 50000 },
      { name: "Stream Deck", connectivity: "USB", features: "Programmable Keys", basePrice: 12000 },
      { name: "Tablet Stand", connectivity: "None", features: "Foldable", basePrice: 2000 },
    ];
    for (let i = 0; i < count && i < types.length; i++) {
      const t = types[i];
      const brand = pick(accessoryBrands);
      const variants = [];
      const accessoryColors = t.name.includes("Keyboard") || t.name.includes("Mouse") ? ["Black", "White", "RGB"] : t.name.includes("Headphone") || t.name.includes("Speaker") || t.name.includes("Headset") ? ["Black", "White", "Silver"] : t.name.includes("Stand") || t.name.includes("Arm") || t.name.includes("Mat") || t.name.includes("Pad") ? ["Black", "Grey"] : ["Black", "Silver", "White"];
      const variantCount = Math.min(randInt(2, 3), accessoryColors.length);
      const usedC = new Set();
      for (let v = 0; v < variantCount; v++) {
        let color;
        do { color = pick(accessoryColors); } while (usedC.has(color));
        usedC.add(color);
        const vPrice = t.basePrice + (["RGB", "White", "Silver"].includes(color) && t.name.includes("Keyboard") ? 2000 : 0);
        variants.push({
          id: uid("var"),
          sku: `${brand.slice(0, 3).toUpperCase()}-${t.name.replace(/\s/g, "").slice(0, 8)}-${color}`,
          name: color,
          attributes: { color, connectivity: t.connectivity },
          offers: generateOffers(vPrice),
        });
      }
      products.push({
        id: uid("prd"),
        categoryId: categories[5].id,
        name: `${brand} ${t.name}`,
        description: `Premium ${t.name.toLowerCase()} with ${t.features}. ${t.connectivity !== "None" ? `Connectivity: ${t.connectivity}.` : ""}`,
        brand,
        tags: [...new Set([...randomTags(), "accessory"])],
        attributes: { connectivity: t.connectivity, features: t.features },
        variants,
      });
    }
    return products;
  },
};

function main() {
  const products = [];
  const targets = {
    [categories[0].id]: 40,
    [categories[1].id]: 40,
    [categories[2].id]: 35,
    [categories[3].id]: 40,
    [categories[4].id]: 30,
    [categories[5].id]: 25,
  };
  for (const [catId, count] of Object.entries(targets)) {
    const gen = productGenerators[catId];
    if (gen) products.push(...gen(count));
  }
  const dataset = { categories, products, vendors, warehouses, vouchers };
  writeFileSync("data/dataset.json", JSON.stringify(dataset, null, 2));
  console.log(`Generated ${products.length} products`);
  let variantCount = 0;
  let offerCount = 0;
  for (const p of products) {
    variantCount += p.variants.length;
    for (const v of p.variants) {
      offerCount += v.offers.length;
    }
  }
  console.log(`  ${variantCount} variants`);
  console.log(`  ${offerCount} offers`);
}

main();
