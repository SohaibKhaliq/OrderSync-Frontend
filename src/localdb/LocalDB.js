// ============================================================
// LocalDB.js – Full offline LocalStorage database for OrderSync
// ============================================================

const DB_KEY = "ordersync_db";

// ── Raw access ────────────────────────────────────────────
export function getDB() {
  try {
    return JSON.parse(localStorage.getItem(DB_KEY)) || {};
  } catch {
    return {};
  }
}

export function saveDB(db) {
  localStorage.setItem(DB_KEY, JSON.stringify(db));
}

// ── Auto-increment IDs ────────────────────────────────────
function nextId(collection) {
  const db = getDB();
  const items = db[collection] || [];
  if (items.length === 0) return 1;
  return Math.max(...items.map((i) => i.id || 0)) + 1;
}

// ── Generic CRUD helpers ──────────────────────────────────
export function col(name) {
  return getDB()[name] || [];
}

function setCol(name, data) {
  const db = getDB();
  db[name] = data;
  saveDB(db);
}

// ── Seed data ─────────────────────────────────────────────
const SEED = {
  users: [
    {
      id: 1,
      username: "admin@campuskarahi.pk",
      password: "admin123",
      name: "Usman Ahmad",
      designation: "Head Manager",
      phone: "+923001234567",
      email: "admin@campuskarahi.pk",
      role: "admin",
      scope:
        "dashboard,pos,orders,kitchen,customers,invoices,reports,reservations,users,settings",
      tenant_id: "local_tenant_001",
      created_at: new Date().toISOString(),
    },
    {
      id: 2,
      username: "fatima.malik@campuskarahi.pk",
      password: "staff123",
      name: "Fatima Malik",
      designation: "Cashier",
      phone: "+923121234568",
      email: "fatima.malik@campuskarahi.pk",
      role: "staff",
      scope: "pos,orders,kitchen,customers,invoices,reservations",
      tenant_id: "local_tenant_001",
      created_at: new Date().toISOString(),
    },
    {
      id: 3,
      username: "bilal.hassan@campuskarahi.pk",
      password: "staff123",
      name: "Bilal Hassan",
      designation: "Kitchen Supervisor",
      phone: "+923211234569",
      email: "bilal.hassan@campuskarahi.pk",
      role: "staff",
      scope: "kitchen,orders",
      tenant_id: "local_tenant_001",
      created_at: new Date().toISOString(),
    },
    {
      id: 4,
      username: "asad.rehman@campuskarahi.pk",
      password: "staff123",
      name: "Asad Rehman",
      designation: "Waiter",
      phone: "+923331234570",
      email: "asad.rehman@campuskarahi.pk",
      role: "staff",
      scope: "pos,orders,reservations",
      tenant_id: "local_tenant_001",
      created_at: new Date().toISOString(),
    },
  ],

  categories: [
    { id: 1, title: "Chai & Drinks", created_at: new Date().toISOString() },
    { id: 2, title: "Snacks", created_at: new Date().toISOString() },
    { id: 3, title: "Desi Main Course", created_at: new Date().toISOString() },
    { id: 4, title: "Rice & Pulao", created_at: new Date().toISOString() },
    {
      id: 5,
      title: "Sandwiches & Rolls",
      created_at: new Date().toISOString(),
    },
    { id: 6, title: "Desserts & Mithai", created_at: new Date().toISOString() },
  ],

  taxes: [
    {
      id: 1,
      title: "GST Pakistan",
      rate: 17,
      type: "percentage",
      created_at: new Date().toISOString(),
    },
  ],

  payment_types: [
    {
      id: 1,
      title: "Cash",
      is_active: 1,
      created_at: new Date().toISOString(),
    },
    {
      id: 2,
      title: "Card",
      is_active: 1,
      created_at: new Date().toISOString(),
    },
    {
      id: 3,
      title: "JazzCash",
      is_active: 1,
      created_at: new Date().toISOString(),
    },
    {
      id: 4,
      title: "Easypaisa",
      is_active: 1,
      created_at: new Date().toISOString(),
    },
  ],

  store_tables: [
    {
      id: 1,
      title: "T-1",
      floor: "Ground Floor",
      seating_capacity: 4,
      created_at: new Date().toISOString(),
    },
    {
      id: 2,
      title: "T-2",
      floor: "Ground Floor",
      seating_capacity: 4,
      created_at: new Date().toISOString(),
    },
    {
      id: 3,
      title: "T-3",
      floor: "Ground Floor",
      seating_capacity: 6,
      created_at: new Date().toISOString(),
    },
    {
      id: 4,
      title: "T-4",
      floor: "Ground Floor",
      seating_capacity: 6,
      created_at: new Date().toISOString(),
    },
    {
      id: 5,
      title: "T-5",
      floor: "First Floor",
      seating_capacity: 4,
      created_at: new Date().toISOString(),
    },
    {
      id: 6,
      title: "T-6",
      floor: "First Floor",
      seating_capacity: 4,
      created_at: new Date().toISOString(),
    },
    {
      id: 7,
      title: "T-7",
      floor: "First Floor",
      seating_capacity: 8,
      created_at: new Date().toISOString(),
    },
    {
      id: 8,
      title: "T-8",
      floor: "Rooftop",
      seating_capacity: 4,
      created_at: new Date().toISOString(),
    },
    {
      id: 9,
      title: "T-9",
      floor: "Rooftop",
      seating_capacity: 6,
      created_at: new Date().toISOString(),
    },
    {
      id: 10,
      title: "T-10",
      floor: "Private Hall",
      seating_capacity: 20,
      created_at: new Date().toISOString(),
    },
  ],

  menu_items: [
    // ── Chai & Drinks ─────────────────────────────────────────────────────
    {
      id: 1,
      title: "Doodh Patti Chai",
      price: 80,
      net_price: 68,
      category_id: 1,
      category_title: "Chai & Drinks",
      tax_id: 1,
      tax_rate: 17,
      tax_type: "percentage",
      tax_title: "GST Pakistan",
      image: null,
      variants: [
        { id: 1, title: "Cutting", price: 50 },
        { id: 2, title: "Full Cup", price: 80 },
      ],
      addons: [],
      is_active: 1,
      created_at: new Date().toISOString(),
    },
    {
      id: 2,
      title: "Kashmiri Chai",
      price: 150,
      net_price: 128,
      category_id: 1,
      category_title: "Chai & Drinks",
      tax_id: 1,
      tax_rate: 17,
      tax_type: "percentage",
      tax_title: "GST Pakistan",
      image: null,
      variants: [],
      addons: [{ id: 1, title: "Extra Malai", price: 30 }],
      is_active: 1,
      created_at: new Date().toISOString(),
    },
    {
      id: 3,
      title: "Lassi",
      price: 130,
      net_price: 111,
      category_id: 1,
      category_title: "Chai & Drinks",
      tax_id: 1,
      tax_rate: 17,
      tax_type: "percentage",
      tax_title: "GST Pakistan",
      image: null,
      variants: [
        { id: 3, title: "Sweet", price: 130 },
        { id: 4, title: "Salty", price: 130 },
        { id: 5, title: "Mango", price: 160 },
      ],
      addons: [],
      is_active: 1,
      created_at: new Date().toISOString(),
    },
    {
      id: 4,
      title: "Cold Coffee",
      price: 220,
      net_price: 188,
      category_id: 1,
      category_title: "Chai & Drinks",
      tax_id: 1,
      tax_rate: 17,
      tax_type: "percentage",
      tax_title: "GST Pakistan",
      image: null,
      variants: [
        { id: 6, title: "Regular", price: 220 },
        { id: 7, title: "Large", price: 280 },
      ],
      addons: [{ id: 2, title: "Extra Shot", price: 40 }],
      is_active: 1,
      created_at: new Date().toISOString(),
    },
    {
      id: 5,
      title: "Rooh Afza Sharbat",
      price: 70,
      net_price: 60,
      category_id: 1,
      category_title: "Chai & Drinks",
      tax_id: 1,
      tax_rate: 17,
      tax_type: "percentage",
      tax_title: "GST Pakistan",
      image: null,
      variants: [],
      addons: [],
      is_active: 1,
      created_at: new Date().toISOString(),
    },
    {
      id: 6,
      title: "Fresh Lime Soda",
      price: 120,
      net_price: 103,
      category_id: 1,
      category_title: "Chai & Drinks",
      tax_id: 1,
      tax_rate: 17,
      tax_type: "percentage",
      tax_title: "GST Pakistan",
      image: null,
      variants: [],
      addons: [],
      is_active: 1,
      created_at: new Date().toISOString(),
    },
    // ── Snacks ─────────────────────────────────────────────────────────────
    {
      id: 7,
      title: "Samosa (2 pcs)",
      price: 60,
      net_price: 51,
      category_id: 2,
      category_title: "Snacks",
      tax_id: 1,
      tax_rate: 17,
      tax_type: "percentage",
      tax_title: "GST Pakistan",
      image: null,
      variants: [],
      addons: [{ id: 3, title: "Chutney", price: 0 }],
      is_active: 1,
      created_at: new Date().toISOString(),
    },
    {
      id: 8,
      title: "Masala Fries",
      price: 190,
      net_price: 162,
      category_id: 2,
      category_title: "Snacks",
      tax_id: 1,
      tax_rate: 17,
      tax_type: "percentage",
      tax_title: "GST Pakistan",
      image: null,
      variants: [],
      addons: [
        { id: 4, title: "Cheese Sauce", price: 40 },
        { id: 5, title: "Jalapeños", price: 20 },
      ],
      is_active: 1,
      created_at: new Date().toISOString(),
    },
    {
      id: 9,
      title: "Aloo Tikki (3 pcs)",
      price: 120,
      net_price: 103,
      category_id: 2,
      category_title: "Snacks",
      tax_id: 1,
      tax_rate: 17,
      tax_type: "percentage",
      tax_title: "GST Pakistan",
      image: null,
      variants: [],
      addons: [],
      is_active: 1,
      created_at: new Date().toISOString(),
    },
    {
      id: 10,
      title: "Papri Chaat",
      price: 150,
      net_price: 128,
      category_id: 2,
      category_title: "Snacks",
      tax_id: 1,
      tax_rate: 17,
      tax_type: "percentage",
      tax_title: "GST Pakistan",
      image: null,
      variants: [],
      addons: [],
      is_active: 1,
      created_at: new Date().toISOString(),
    },
    // ── Desi Main Course ───────────────────────────────────────────────────
    {
      id: 11,
      title: "Chicken Karahi",
      price: 550,
      net_price: 470,
      category_id: 3,
      category_title: "Desi Main Course",
      tax_id: 1,
      tax_rate: 17,
      tax_type: "percentage",
      tax_title: "GST Pakistan",
      image: null,
      variants: [
        { id: 8, title: "Half", price: 550 },
        { id: 9, title: "Full", price: 1050 },
      ],
      addons: [
        { id: 6, title: "Extra Naan", price: 40 },
        { id: 7, title: "Raita", price: 60 },
      ],
      is_active: 1,
      created_at: new Date().toISOString(),
    },
    {
      id: 12,
      title: "Beef Karahi",
      price: 600,
      net_price: 513,
      category_id: 3,
      category_title: "Desi Main Course",
      tax_id: 1,
      tax_rate: 17,
      tax_type: "percentage",
      tax_title: "GST Pakistan",
      image: null,
      variants: [
        { id: 10, title: "Half", price: 600 },
        { id: 11, title: "Full", price: 1150 },
      ],
      addons: [{ id: 6, title: "Extra Naan", price: 40 }],
      is_active: 1,
      created_at: new Date().toISOString(),
    },
    {
      id: 13,
      title: "Nihari",
      price: 480,
      net_price: 410,
      category_id: 3,
      category_title: "Desi Main Course",
      tax_id: 1,
      tax_rate: 17,
      tax_type: "percentage",
      tax_title: "GST Pakistan",
      image: null,
      variants: [],
      addons: [
        { id: 8, title: "Paya extra", price: 80 },
        { id: 6, title: "Extra Naan", price: 40 },
      ],
      is_active: 1,
      created_at: new Date().toISOString(),
    },
    {
      id: 14,
      title: "Daal Chawal",
      price: 230,
      net_price: 197,
      category_id: 3,
      category_title: "Desi Main Course",
      tax_id: 1,
      tax_rate: 17,
      tax_type: "percentage",
      tax_title: "GST Pakistan",
      image: null,
      variants: [],
      addons: [],
      is_active: 1,
      created_at: new Date().toISOString(),
    },
    {
      id: 15,
      title: "Halwa Puri (2 pcs)",
      price: 250,
      net_price: 214,
      category_id: 3,
      category_title: "Desi Main Course",
      tax_id: 1,
      tax_rate: 17,
      tax_type: "percentage",
      tax_title: "GST Pakistan",
      image: null,
      variants: [],
      addons: [
        { id: 9, title: "Extra Puri", price: 30 },
        { id: 10, title: "Chana", price: 50 },
      ],
      is_active: 1,
      created_at: new Date().toISOString(),
    },
    {
      id: 27,
      title: "Aloo Paratha",
      price: 180,
      net_price: 154,
      category_id: 3,
      category_title: "Desi Main Course",
      tax_id: 1,
      tax_rate: 17,
      tax_type: "percentage",
      tax_title: "GST Pakistan",
      image: null,
      variants: [],
      addons: [
        { id: 11, title: "Butter extra", price: 30 },
        { id: 7, title: "Raita", price: 60 },
      ],
      is_active: 1,
      created_at: new Date().toISOString(),
    },
    // ── Rice & Pulao ───────────────────────────────────────────────────────
    {
      id: 16,
      title: "Chicken Biryani",
      price: 380,
      net_price: 325,
      category_id: 4,
      category_title: "Rice & Pulao",
      tax_id: 1,
      tax_rate: 17,
      tax_type: "percentage",
      tax_title: "GST Pakistan",
      image: null,
      variants: [],
      addons: [
        { id: 7, title: "Raita", price: 60 },
        { id: 12, title: "Salad", price: 40 },
      ],
      is_active: 1,
      created_at: new Date().toISOString(),
    },
    {
      id: 17,
      title: "Beef Pulao",
      price: 370,
      net_price: 316,
      category_id: 4,
      category_title: "Rice & Pulao",
      tax_id: 1,
      tax_rate: 17,
      tax_type: "percentage",
      tax_title: "GST Pakistan",
      image: null,
      variants: [],
      addons: [{ id: 7, title: "Raita", price: 60 }],
      is_active: 1,
      created_at: new Date().toISOString(),
    },
    {
      id: 18,
      title: "Kabuli Pulao",
      price: 390,
      net_price: 333,
      category_id: 4,
      category_title: "Rice & Pulao",
      tax_id: 1,
      tax_rate: 17,
      tax_type: "percentage",
      tax_title: "GST Pakistan",
      image: null,
      variants: [],
      addons: [],
      is_active: 1,
      created_at: new Date().toISOString(),
    },
    // ── Sandwiches & Rolls ────────────────────────────────────────────────
    {
      id: 19,
      title: "Aloo Tikki Burger",
      price: 290,
      net_price: 248,
      category_id: 5,
      category_title: "Sandwiches & Rolls",
      tax_id: 1,
      tax_rate: 17,
      tax_type: "percentage",
      tax_title: "GST Pakistan",
      image: null,
      variants: [],
      addons: [
        { id: 4, title: "Cheese Sauce", price: 40 },
        { id: 13, title: "Extra Patty", price: 80 },
      ],
      is_active: 1,
      created_at: new Date().toISOString(),
    },
    {
      id: 20,
      title: "Zinger Burger",
      price: 430,
      net_price: 368,
      category_id: 5,
      category_title: "Sandwiches & Rolls",
      tax_id: 1,
      tax_rate: 17,
      tax_type: "percentage",
      tax_title: "GST Pakistan",
      image: null,
      variants: [],
      addons: [
        { id: 4, title: "Cheese Sauce", price: 40 },
        { id: 5, title: "Jalapeños", price: 20 },
      ],
      is_active: 1,
      created_at: new Date().toISOString(),
    },
    {
      id: 21,
      title: "Chicken Roll",
      price: 260,
      net_price: 222,
      category_id: 5,
      category_title: "Sandwiches & Rolls",
      tax_id: 1,
      tax_rate: 17,
      tax_type: "percentage",
      tax_title: "GST Pakistan",
      image: null,
      variants: [],
      addons: [{ id: 14, title: "Extra Sauce", price: 20 }],
      is_active: 1,
      created_at: new Date().toISOString(),
    },
    {
      id: 22,
      title: "Seekh Kebab Roll",
      price: 310,
      net_price: 265,
      category_id: 5,
      category_title: "Sandwiches & Rolls",
      tax_id: 1,
      tax_rate: 17,
      tax_type: "percentage",
      tax_title: "GST Pakistan",
      image: null,
      variants: [],
      addons: [],
      is_active: 1,
      created_at: new Date().toISOString(),
    },
    {
      id: 23,
      title: "Club Sandwich",
      price: 340,
      net_price: 291,
      category_id: 5,
      category_title: "Sandwiches & Rolls",
      tax_id: 1,
      tax_rate: 17,
      tax_type: "percentage",
      tax_title: "GST Pakistan",
      image: null,
      variants: [],
      addons: [],
      is_active: 1,
      created_at: new Date().toISOString(),
    },
    // ── Desserts & Mithai ─────────────────────────────────────────────────
    {
      id: 24,
      title: "Gulab Jamun (2 pcs)",
      price: 100,
      net_price: 85,
      category_id: 6,
      category_title: "Desserts & Mithai",
      tax_id: 1,
      tax_rate: 17,
      tax_type: "percentage",
      tax_title: "GST Pakistan",
      image: null,
      variants: [],
      addons: [],
      is_active: 1,
      created_at: new Date().toISOString(),
    },
    {
      id: 25,
      title: "Kheer",
      price: 120,
      net_price: 103,
      category_id: 6,
      category_title: "Desserts & Mithai",
      tax_id: 1,
      tax_rate: 17,
      tax_type: "percentage",
      tax_title: "GST Pakistan",
      image: null,
      variants: [],
      addons: [],
      is_active: 1,
      created_at: new Date().toISOString(),
    },
    {
      id: 26,
      title: "Gajar Halwa",
      price: 140,
      net_price: 120,
      category_id: 6,
      category_title: "Desserts & Mithai",
      tax_id: 1,
      tax_rate: 17,
      tax_type: "percentage",
      tax_title: "GST Pakistan",
      image: null,
      variants: [],
      addons: [],
      is_active: 1,
      created_at: new Date().toISOString(),
    },
  ],

  store_setting: {
    id: 1,
    store_name: "Campus Karahi",
    address: "FAST-NUCES Campus, Faisal Town, Lahore, Pakistan",
    phone: "+92 42 111 128 128",
    email: "info@campuskarahi.pk",
    currency: "PKR",
    image: null,
    is_qr_menu_enabled: 1,
    is_qr_order_enabled: 1,
    created_at: new Date().toISOString(),
  },

  print_setting: {
    id: 1,
    page_format: "80",
    header: "Bismillah ir-Rahman ir-Rahim\nCampus Karahi – FAST-NU Lahore",
    footer: "Dobara tashreef layen! Shukriya!\nFeedback: info@campuskarahi.pk",
    show_notes: 1,
    is_enable_print: 1,
    show_store_details: 1,
    show_customer_details: 1,
    print_token: 1,
    created_at: new Date().toISOString(),
  },

  customers: [
    {
      id: 1,
      phone: "03001234567",
      name: "Ahmed Raza",
      email: "ahmed.raza@nu.edu.pk",
      birth_date: "2002-04-15",
      gender: "male",
      visit_count: 14,
      created_at: new Date().toISOString(),
    },
    {
      id: 2,
      phone: "03121234568",
      name: "Fatima Khan",
      email: "fatima.khan@nu.edu.pk",
      birth_date: "2003-07-22",
      gender: "female",
      visit_count: 9,
      created_at: new Date().toISOString(),
    },
    {
      id: 3,
      phone: "03211234569",
      name: "Usman Ali",
      email: "usman.ali@nu.edu.pk",
      birth_date: "2001-11-08",
      gender: "male",
      visit_count: 17,
      created_at: new Date().toISOString(),
    },
    {
      id: 4,
      phone: "03331234570",
      name: "Ayesha Siddiqui",
      email: "ayesha.siddiqui@nu.edu.pk",
      birth_date: "2002-02-28",
      gender: "female",
      visit_count: 6,
      created_at: new Date().toISOString(),
    },
    {
      id: 5,
      phone: "03451234571",
      name: "Hamza Malik",
      email: "hamza.malik@nu.edu.pk",
      birth_date: "2000-09-14",
      gender: "male",
      visit_count: 21,
      created_at: new Date().toISOString(),
    },
    {
      id: 6,
      phone: "03551234572",
      name: "Zara Qureshi",
      email: "zara.qureshi@lums.edu.pk",
      birth_date: "2003-01-30",
      gender: "female",
      visit_count: 5,
      created_at: new Date().toISOString(),
    },
    {
      id: 7,
      phone: "03001234573",
      name: "Bilal Hussain",
      email: "bilal.hussain@lums.edu.pk",
      birth_date: "2001-06-17",
      gender: "male",
      visit_count: 11,
      created_at: new Date().toISOString(),
    },
    {
      id: 8,
      phone: "03121234574",
      name: "Sara Ahmed",
      email: "sara.ahmed@lums.edu.pk",
      birth_date: "2002-12-05",
      gender: "female",
      visit_count: 3,
      created_at: new Date().toISOString(),
    },
    {
      id: 9,
      phone: "03211234575",
      name: "Muneeb Sheikh",
      email: "muneeb.sheikh@comsats.edu.pk",
      birth_date: "2000-08-20",
      gender: "male",
      visit_count: 8,
      created_at: new Date().toISOString(),
    },
    {
      id: 10,
      phone: "03331234576",
      name: "Nadia Aslam",
      email: "nadia.aslam@comsats.edu.pk",
      birth_date: "2003-03-11",
      gender: "female",
      visit_count: 16,
      created_at: new Date().toISOString(),
    },
    {
      id: 11,
      phone: "03451234577",
      name: "Imran Butt",
      email: "imran.butt@uet.edu.pk",
      birth_date: "2001-10-25",
      gender: "male",
      visit_count: 4,
      created_at: new Date().toISOString(),
    },
    {
      id: 12,
      phone: "03551234578",
      name: "Maira Iqbal",
      email: "maira.iqbal@uet.edu.pk",
      birth_date: "2002-05-19",
      gender: "female",
      visit_count: 12,
      created_at: new Date().toISOString(),
    },
    {
      id: 13,
      phone: "03341234579",
      name: "Shahzaib Nawaz",
      email: "shahzaib.nawaz@pu.edu.pk",
      birth_date: "2000-01-07",
      gender: "male",
      visit_count: 7,
      created_at: new Date().toISOString(),
    },
    {
      id: 14,
      phone: "03221234580",
      name: "Hina Baig",
      email: "hina.baig@pu.edu.pk",
      birth_date: "2003-09-03",
      gender: "female",
      visit_count: 19,
      created_at: new Date().toISOString(),
    },
    {
      id: 15,
      phone: "03111234581",
      name: "Arsalan Tariq",
      email: "arsalan.tariq@giki.edu.pk",
      birth_date: "2001-07-29",
      gender: "male",
      visit_count: 2,
      created_at: new Date().toISOString(),
    },
    {
      id: 16,
      phone: "03021234582",
      name: "Sana Waheed",
      email: "sana.waheed@kust.edu.pk",
      birth_date: "2002-11-14",
      gender: "female",
      visit_count: 10,
      created_at: new Date().toISOString(),
    },
    {
      id: 17,
      phone: "03141234583",
      name: "Talha Mahmood",
      email: "talha.mahmood@nu.edu.pk",
      birth_date: "2000-04-02",
      gender: "male",
      visit_count: 23,
      created_at: new Date().toISOString(),
    },
    {
      id: 18,
      phone: "03251234584",
      name: "Maryam Zahid",
      email: "maryam.zahid@nu.edu.pk",
      birth_date: "2003-06-18",
      gender: "female",
      visit_count: 8,
      created_at: new Date().toISOString(),
    },
    {
      id: 19,
      phone: "03371234585",
      name: "Danyal Farooq",
      email: "danyal.farooq@lums.edu.pk",
      birth_date: "2001-02-10",
      gender: "male",
      visit_count: 15,
      created_at: new Date().toISOString(),
    },
    {
      id: 20,
      phone: "03481234586",
      name: "Aisha Rehman",
      email: "aisha.rehman@comsats.edu.pk",
      birth_date: "2002-08-23",
      gender: "female",
      visit_count: 6,
      created_at: new Date().toISOString(),
    },
    {
      id: 21,
      phone: "03001234587",
      name: "Waleed Anwar",
      email: "waleed.anwar@nu.edu.pk",
      birth_date: "2000-12-31",
      gender: "male",
      visit_count: 9,
      created_at: new Date().toISOString(),
    },
    {
      id: 22,
      phone: "03121234588",
      name: "Hira Bashir",
      email: "hira.bashir@uet.edu.pk",
      birth_date: "2003-04-07",
      gender: "female",
      visit_count: 13,
      created_at: new Date().toISOString(),
    },
  ],
  orders: [],
  order_items: [],
  invoices: [],
  payments: [],
  reservations: [],
  devices: [],

  // OCOS – customer portal accounts
  customer_accounts: [],
  // OCOS – cafe orders placed by customers online
  cafe_orders: [],

  token_counter: { value: 0 },
};

// ── Demo seeds (dates relative to "now" so all filters always return data) ──
function generateSeedReservations() {
  function d(daysOffset, hour, minute = 0) {
    const dt = new Date();
    dt.setDate(dt.getDate() + daysOffset);
    dt.setHours(hour, minute, 0, 0);
    return dt.toISOString();
  }
  function ago(days) {
    return d(-days, 10);
  }

  return [
    // ── TODAY ────────────────────────────────────────────────────────────
    {
      id: 1,
      customer_id: 1,
      customer_name: "Ahmed Raza",
      customer_phone: "03001234567",
      date: d(0, 12, 0),
      table_id: 3,
      table_title: "T-3",
      status: "booked",
      notes: "Final exams over! Group dinner – need 2 extra chairs",
      people_count: 4,
      unique_code: "RES0001",
      created_at: ago(2),
      updated_at: ago(2),
    },
    {
      id: 2,
      customer_id: 2,
      customer_name: "Fatima Khan",
      customer_phone: "03121234568",
      date: d(0, 13, 30),
      table_id: 1,
      table_title: "T-1",
      status: "paid",
      notes: "Allergic to gluten – please inform kitchen",
      people_count: 2,
      unique_code: "RES0002",
      created_at: ago(1),
      updated_at: ago(1),
    },
    {
      id: 3,
      customer_id: 3,
      customer_name: "Usman Ali",
      customer_phone: "03211234569",
      date: d(0, 14, 0),
      table_id: 6,
      table_title: "T-6",
      status: "booked",
      notes: "Study group meet – need extra power sockets if possible",
      people_count: 6,
      unique_code: "RES0003",
      created_at: ago(3),
      updated_at: ago(3),
    },
    {
      id: 4,
      customer_id: 4,
      customer_name: "Ayesha Siddiqui",
      customer_phone: "03331234570",
      date: d(0, 18, 30),
      table_id: 7,
      table_title: "T-7",
      status: "pending",
      notes: "First floor preferred, quiet corner",
      people_count: 3,
      unique_code: "RES0004",
      created_at: ago(1),
      updated_at: ago(1),
    },
    {
      id: 5,
      customer_id: 5,
      customer_name: "Hamza Malik",
      customer_phone: "03451234571",
      date: d(0, 19, 0),
      table_id: 9,
      table_title: "T-9",
      status: "booked",
      notes:
        "FAST-NU CS department farewell dinner – confirm biryani availability",
      people_count: 8,
      unique_code: "RES0005",
      created_at: ago(4),
      updated_at: ago(4),
    },
    {
      id: 6,
      customer_id: 6,
      customer_name: "Zara Qureshi",
      customer_phone: "03551234572",
      date: d(0, 20, 0),
      table_id: 2,
      table_title: "T-2",
      status: "cancelled",
      notes: "LUMS event clash, had to cancel – will rebook",
      people_count: 2,
      unique_code: "RES0006",
      created_at: ago(2),
      updated_at: ago(0),
    },

    // ── TOMORROW ─────────────────────────────────────────────────────────
    {
      id: 7,
      customer_id: 7,
      customer_name: "Bilal Hussain",
      customer_phone: "03001234573",
      date: d(1, 12, 30),
      table_id: 5,
      table_title: "T-5",
      status: "booked",
      notes: "Window seat preferred – LUMS batch lunch",
      people_count: 4,
      unique_code: "RES0007",
      created_at: ago(1),
      updated_at: ago(1),
    },
    {
      id: 8,
      customer_id: 8,
      customer_name: "Sara Ahmed",
      customer_phone: "03121234574",
      date: d(1, 13, 0),
      table_id: null,
      table_title: null,
      status: "pending",
      notes: "Surprise birthday from batchmates – keep it secret!",
      people_count: 5,
      unique_code: "RES-AB1C2D",
      created_at: ago(0),
      updated_at: ago(0),
    },
    {
      id: 9,
      customer_id: 9,
      customer_name: "Muneeb Sheikh",
      customer_phone: "03211234575",
      date: d(1, 19, 30),
      table_id: 8,
      table_title: "T-8",
      status: "booked",
      notes: "COMSATS batch reunion – rooftop view preferred",
      people_count: 6,
      unique_code: "RES0009",
      created_at: ago(2),
      updated_at: ago(2),
    },
    {
      id: 10,
      customer_id: 10,
      customer_name: "Nadia Aslam",
      customer_phone: "03331234576",
      date: d(1, 20, 0),
      table_id: 10,
      table_title: "T-10",
      status: "booked",
      notes: "Large iftar gathering – confirm by evening prayer time",
      people_count: 12,
      unique_code: "RES0010",
      created_at: ago(3),
      updated_at: ago(3),
    },
    {
      id: 11,
      customer_id: 11,
      customer_name: "Imran Butt",
      customer_phone: "03451234577",
      date: d(1, 20, 30),
      table_id: 4,
      table_title: "T-4",
      status: "booked",
      notes: "UET alumni meetup, just 2 people – quiet table please",
      people_count: 2,
      unique_code: "RES0011",
      created_at: ago(1),
      updated_at: ago(1),
    },

    // ── YESTERDAY ────────────────────────────────────────────────────────
    {
      id: 12,
      customer_id: 12,
      customer_name: "Maira Iqbal",
      customer_phone: "03551234578",
      date: d(-1, 13, 0),
      table_id: 3,
      table_title: "T-3",
      status: "paid",
      notes: "UET girls batch lunch – no beef please",
      people_count: 4,
      unique_code: "RES0012",
      created_at: ago(3),
      updated_at: ago(1),
    },
    {
      id: 13,
      customer_id: 13,
      customer_name: "Shahzaib Nawaz",
      customer_phone: "03341234579",
      date: d(-1, 14, 30),
      table_id: 1,
      table_title: "T-1",
      status: "paid",
      notes: "",
      people_count: 2,
      unique_code: "RES0013",
      created_at: ago(4),
      updated_at: ago(1),
    },
    {
      id: 14,
      customer_id: 14,
      customer_name: "Hina Baig",
      customer_phone: "03221234580",
      date: d(-1, 19, 0),
      table_id: 7,
      table_title: "T-7",
      status: "booked",
      notes: "Late arrival possible, hold table – seminar ran long",
      people_count: 3,
      unique_code: "RES-EF3G4H",
      created_at: ago(1),
      updated_at: ago(1),
    },
    {
      id: 15,
      customer_id: 15,
      customer_name: "Arsalan Tariq",
      customer_phone: "03111234581",
      date: d(-1, 20, 0),
      table_id: 6,
      table_title: "T-6",
      status: "cancelled",
      notes: "Exam schedule conflict, will rebook after finals",
      people_count: 5,
      unique_code: "RES0015",
      created_at: ago(2),
      updated_at: ago(1),
    },

    // ── LAST 7 DAYS (2-6 days ago) ───────────────────────────────────────
    {
      id: 16,
      customer_id: 1,
      customer_name: "Ahmed Raza",
      customer_phone: "03001234567",
      date: d(-2, 19, 30),
      table_id: 9,
      table_title: "T-9",
      status: "paid",
      notes: "End of semester rooftop party – FAST-NU CS",
      people_count: 9,
      unique_code: "RES0016",
      created_at: ago(5),
      updated_at: ago(2),
    },
    {
      id: 17,
      customer_id: 3,
      customer_name: "Usman Ali",
      customer_phone: "03211234569",
      date: d(-2, 20, 0),
      table_id: 2,
      table_title: "T-2",
      status: "paid",
      notes: "",
      people_count: 2,
      unique_code: "RES0017",
      created_at: ago(4),
      updated_at: ago(2),
    },
    {
      id: 18,
      customer_id: 5,
      customer_name: "Hamza Malik",
      customer_phone: "03451234571",
      date: d(-3, 13, 0),
      table_id: 5,
      table_title: "T-5",
      status: "paid",
      notes: "Quick biryani lunch before afternoon practical",
      people_count: 4,
      unique_code: "RES0018",
      created_at: ago(6),
      updated_at: ago(3),
    },
    {
      id: 19,
      customer_id: 7,
      customer_name: "Bilal Hussain",
      customer_phone: "03001234573",
      date: d(-3, 19, 0),
      table_id: 8,
      table_title: "T-8",
      status: "booked",
      notes: "LUMS alumni rooftop dinner",
      people_count: 6,
      unique_code: "RES0019",
      created_at: ago(5),
      updated_at: ago(3),
    },
    {
      id: 20,
      customer_id: 9,
      customer_name: "Muneeb Sheikh",
      customer_phone: "03211234575",
      date: d(-4, 18, 30),
      table_id: 4,
      table_title: "T-4",
      status: "cancelled",
      notes: "No-show – quiz ran overtime",
      people_count: 2,
      unique_code: "RES0020",
      created_at: ago(7),
      updated_at: ago(4),
    },
    {
      id: 21,
      customer_id: 11,
      customer_name: "Imran Butt",
      customer_phone: "03451234577",
      date: d(-5, 12, 0),
      table_id: 10,
      table_title: "T-10",
      status: "paid",
      notes: "UET CS department project team lunch – 15 students",
      people_count: 15,
      unique_code: "RES0021",
      created_at: ago(8),
      updated_at: ago(5),
    },
    {
      id: 22,
      customer_id: 13,
      customer_name: "Shahzaib Nawaz",
      customer_phone: "03341234579",
      date: d(-6, 20, 30),
      table_id: 1,
      table_title: "T-1",
      status: "paid",
      notes: "Post-defence celebration dinner",
      people_count: 2,
      unique_code: "RES-IJ5K6L",
      created_at: ago(7),
      updated_at: ago(6),
    },

    // ── THIS MONTH – future dates ─────────────────────────────────────────
    {
      id: 23,
      customer_id: 2,
      customer_name: "Fatima Khan",
      customer_phone: "03121234568",
      date: d(5, 19, 0),
      table_id: 3,
      table_title: "T-3",
      status: "booked",
      notes: "Convocation celebration with family – FAST-NU",
      people_count: 4,
      unique_code: "RES0023",
      created_at: ago(1),
      updated_at: ago(1),
    },
    {
      id: 24,
      customer_id: 4,
      customer_name: "Ayesha Siddiqui",
      customer_phone: "03331234570",
      date: d(7, 13, 30),
      table_id: 7,
      table_title: "T-7",
      status: "pending",
      notes: "First floor preferred, open terrace if available",
      people_count: 3,
      unique_code: "RES0024",
      created_at: ago(0),
      updated_at: ago(0),
    },
    {
      id: 25,
      customer_id: 6,
      customer_name: "Zara Qureshi",
      customer_phone: "03551234572",
      date: d(10, 20, 0),
      table_id: 9,
      table_title: "T-9",
      status: "booked",
      notes: "LUMS girls hostel birthday party – 10 students",
      people_count: 10,
      unique_code: "RES0025",
      created_at: ago(2),
      updated_at: ago(2),
    },
    {
      id: 26,
      customer_id: 8,
      customer_name: "Sara Ahmed",
      customer_phone: "03121234574",
      date: d(12, 19, 30),
      table_id: 4,
      table_title: "T-4",
      status: "pending",
      notes: "Project submission relief dinner – just the two of us",
      people_count: 2,
      unique_code: "RES-MN7O8P",
      created_at: ago(0),
      updated_at: ago(0),
    },
    {
      id: 27,
      customer_id: 10,
      customer_name: "Nadia Aslam",
      customer_phone: "03331234576",
      date: d(15, 12, 0),
      table_id: 6,
      table_title: "T-6",
      status: "booked",
      notes: "COMSATS class rep farewell lunch – 7 people",
      people_count: 7,
      unique_code: "RES0027",
      created_at: ago(1),
      updated_at: ago(1),
    },

    // ── LAST MONTH ────────────────────────────────────────────────────────
    {
      id: 28,
      customer_id: 2,
      customer_name: "Fatima Khan",
      customer_phone: "03121234568",
      date: d(-30, 19, 0),
      table_id: 2,
      table_title: "T-2",
      status: "paid",
      notes: "Eid pre-celebration dinner with uni friends",
      people_count: 2,
      unique_code: "RES0028",
      created_at: ago(35),
      updated_at: ago(30),
    },
    {
      id: 29,
      customer_id: 4,
      customer_name: "Ayesha Siddiqui",
      customer_phone: "03331234570",
      date: d(-25, 13, 0),
      table_id: 5,
      table_title: "T-5",
      status: "paid",
      notes: "Group project presentation prep lunch",
      people_count: 4,
      unique_code: "RES0029",
      created_at: ago(28),
      updated_at: ago(25),
    },
    {
      id: 30,
      customer_id: 6,
      customer_name: "Zara Qureshi",
      customer_phone: "03551234572",
      date: d(-22, 20, 0),
      table_id: 8,
      table_title: "T-8",
      status: "paid",
      notes: "Birthday dinner – rooftop table booked",
      people_count: 6,
      unique_code: "RES-QR9S0T",
      created_at: ago(26),
      updated_at: ago(22),
    },
    {
      id: 31,
      customer_id: 8,
      customer_name: "Sara Ahmed",
      customer_phone: "03121234574",
      date: d(-20, 19, 30),
      table_id: 3,
      table_title: "T-3",
      status: "cancelled",
      notes: "Health emergency – will rebook",
      people_count: 3,
      unique_code: "RES0031",
      created_at: ago(24),
      updated_at: ago(20),
    },
    {
      id: 32,
      customer_id: 10,
      customer_name: "Nadia Aslam",
      customer_phone: "03331234576",
      date: d(-18, 12, 30),
      table_id: 9,
      table_title: "T-9",
      status: "paid",
      notes: "Hostel Iftaar party – rooftop",
      people_count: 11,
      unique_code: "RES0032",
      created_at: ago(22),
      updated_at: ago(18),
    },
    {
      id: 33,
      customer_id: 12,
      customer_name: "Maira Iqbal",
      customer_phone: "03551234578",
      date: d(-15, 19, 0),
      table_id: 7,
      table_title: "T-7",
      status: "paid",
      notes: "Engagement announcement dinner – small & private",
      people_count: 2,
      unique_code: "RES0033",
      created_at: ago(18),
      updated_at: ago(15),
    },

    // ── NEXT MONTH (far future) ───────────────────────────────────────────
    {
      id: 34,
      customer_id: 14,
      customer_name: "Hina Baig",
      customer_phone: "03221234580",
      date: d(25, 19, 0),
      table_id: 10,
      table_title: "T-10",
      status: "booked",
      notes: "Mehndi night pre-dinner – 18 students, need Private Hall",
      people_count: 18,
      unique_code: "RES0034",
      created_at: ago(2),
      updated_at: ago(2),
    },
    {
      id: 35,
      customer_id: 15,
      customer_name: "Arsalan Tariq",
      customer_phone: "03111234581",
      date: d(28, 12, 0),
      table_id: 6,
      table_title: "T-6",
      status: "pending",
      notes: "GIKI alumni reunion – call 24h before for final headcount",
      people_count: 8,
      unique_code: "RES0035",
      created_at: ago(1),
      updated_at: ago(1),
    },
    {
      id: 36,
      customer_id: 1,
      customer_name: "Ahmed Raza",
      customer_phone: "03001234567",
      date: d(32, 20, 0),
      table_id: 9,
      table_title: "T-9",
      status: "booked",
      notes: "FAST-NU batch gathering – rooftop dinner",
      people_count: 10,
      unique_code: "RES0036",
      created_at: ago(0),
      updated_at: ago(0),
    },
    {
      id: 37,
      customer_id: 3,
      customer_name: "Usman Ali",
      customer_phone: "03211234569",
      date: d(35, 19, 30),
      table_id: 4,
      table_title: "T-4",
      status: "pending",
      notes: "",
      people_count: 2,
      unique_code: "RES-UV1W2X",
      created_at: ago(0),
      updated_at: ago(0),
    },
  ];
}

// ── Seed: POS / admin orders (dine-in & takeaway) ──────────────────────────
function generateSeedOrders() {
  function ago(days, hour = 13) {
    const dt = new Date();
    dt.setDate(dt.getDate() - days);
    dt.setHours(hour, 0, 0, 0);
    return dt.toISOString();
  }
  // delivery_type: dine_in | takeaway
  return [
    // ── TODAY ──────────────────────────────────────────────────────────────
    {
      id: 1,
      order_number: "ORD-001",
      token_no: 1,
      customer_id: 1,
      customer_name: "Ahmed Raza",
      table_id: 3,
      table_title: "T-3",
      delivery_type: "dine_in",
      customer_type: "existing",
      is_qr_order: 0,
      status: "completed",
      payment_status: "paid",
      payment_type: "cash",
      net_total: 730,
      tax_total: 124,
      total: 854,
      notes: "",
      created_at: ago(0, 12),
      updated_at: ago(0, 13),
      order_items: [
        {
          id: 1,
          order_id: 1,
          menu_item_id: 11,
          title: "Chicken Karahi",
          price: 550,
          quantity: 1,
          variant: "Half",
          addons: "Raita",
          addons_ids: [],
          notes: "",
          tax_rate: 0,
          tax_type: "",
          tax_title: "",
          status: "completed",
        },
        {
          id: 2,
          order_id: 1,
          menu_item_id: 1,
          title: "Doodh Patti Chai",
          price: 80,
          quantity: 3,
          variant: null,
          addons: null,
          addons_ids: [],
          notes: "",
          tax_rate: 0,
          tax_type: "",
          tax_title: "",
          status: "completed",
        },
      ],
    },
    {
      id: 2,
      order_number: "ORD-002",
      token_no: 2,
      customer_id: 2,
      customer_name: "Fatima Khan",
      table_id: 1,
      table_title: "T-1",
      delivery_type: "dine_in",
      customer_type: "existing",
      is_qr_order: 0,
      status: "completed",
      payment_status: "paid",
      payment_type: "jazzcash",
      net_total: 370,
      tax_total: 63,
      total: 433,
      notes: "No beef",
      created_at: ago(0, 13),
      updated_at: ago(0, 14),
      order_items: [
        {
          id: 3,
          order_id: 2,
          menu_item_id: 16,
          title: "Chicken Biryani",
          price: 380,
          quantity: 1,
          variant: null,
          addons: "Raita",
          addons_ids: [],
          notes: "",
          tax_rate: 0,
          tax_type: "",
          tax_title: "",
          status: "completed",
        },
      ],
    },
    {
      id: 3,
      order_number: "ORD-003",
      token_no: 3,
      customer_id: 5,
      customer_name: "Hamza Malik",
      table_id: null,
      table_title: null,
      delivery_type: "takeaway",
      customer_type: "existing",
      is_qr_order: 0,
      status: "completed",
      payment_status: "paid",
      payment_type: "easypaisa",
      net_total: 690,
      tax_total: 117,
      total: 807,
      notes: "Bag packing please",
      created_at: ago(0, 14),
      updated_at: ago(0, 14),
      order_items: [
        {
          id: 4,
          order_id: 3,
          menu_item_id: 12,
          title: "Beef Karahi",
          price: 600,
          quantity: 1,
          variant: "Half",
          addons: null,
          addons_ids: [],
          notes: "",
          tax_rate: 0,
          tax_type: "",
          tax_title: "",
          status: "completed",
        },
        {
          id: 5,
          order_id: 3,
          menu_item_id: 4,
          title: "Cold Coffee",
          price: 220,
          quantity: 2,
          variant: "Large",
          addons: null,
          addons_ids: [],
          notes: "",
          tax_rate: 0,
          tax_type: "",
          tax_title: "",
          status: "completed",
        },
      ],
    },
    {
      id: 4,
      order_number: "ORD-004",
      token_no: 4,
      customer_id: 3,
      customer_name: "Usman Ali",
      table_id: 6,
      table_title: "T-6",
      delivery_type: "dine_in",
      customer_type: "existing",
      is_qr_order: 0,
      status: "preparing",
      payment_status: "unpaid",
      payment_type: "cash",
      net_total: 1380,
      tax_total: 235,
      total: 1615,
      notes: "6 students – extra naans",
      created_at: ago(0, 17),
      updated_at: ago(0, 17),
      order_items: [
        {
          id: 6,
          order_id: 4,
          menu_item_id: 11,
          title: "Chicken Karahi",
          price: 550,
          quantity: 2,
          variant: "Full",
          addons: "Extra Naan ×3",
          addons_ids: [],
          notes: "",
          tax_rate: 0,
          tax_type: "",
          tax_title: "",
          status: "pending",
        },
        {
          id: 7,
          order_id: 4,
          menu_item_id: 1,
          title: "Doodh Patti Chai",
          price: 80,
          quantity: 6,
          variant: "Cutting",
          addons: null,
          addons_ids: [],
          notes: "",
          tax_rate: 0,
          tax_type: "",
          tax_title: "",
          status: "pending",
        },
      ],
    },
    {
      id: 5,
      order_number: "ORD-005",
      token_no: 5,
      customer_id: 17,
      customer_name: "Talha Mahmood",
      table_id: 5,
      table_title: "T-5",
      delivery_type: "dine_in",
      customer_type: "existing",
      is_qr_order: 0,
      status: "pending",
      payment_status: "unpaid",
      payment_type: "card",
      net_total: 860,
      tax_total: 146,
      total: 1006,
      notes: "",
      created_at: ago(0, 18),
      updated_at: ago(0, 18),
      order_items: [
        {
          id: 8,
          order_id: 5,
          menu_item_id: 20,
          title: "Zinger Burger",
          price: 430,
          quantity: 2,
          variant: null,
          addons: "Jalapeños",
          addons_ids: [],
          notes: "",
          tax_rate: 0,
          tax_type: "",
          tax_title: "",
          status: "pending",
        },
      ],
    },
    // ── YESTERDAY ──────────────────────────────────────────────────────────
    {
      id: 6,
      order_number: "ORD-006",
      token_no: 6,
      customer_id: 7,
      customer_name: "Bilal Hussain",
      table_id: 8,
      table_title: "T-8",
      delivery_type: "dine_in",
      customer_type: "existing",
      is_qr_order: 0,
      status: "completed",
      payment_status: "paid",
      payment_type: "card",
      net_total: 620,
      tax_total: 105,
      total: 725,
      notes: "",
      created_at: ago(1, 12),
      updated_at: ago(1, 13),
      order_items: [
        {
          id: 9,
          order_id: 6,
          menu_item_id: 22,
          title: "Seekh Kebab Roll",
          price: 310,
          quantity: 2,
          variant: null,
          addons: null,
          addons_ids: [],
          notes: "",
          tax_rate: 0,
          tax_type: "",
          tax_title: "",
          status: "completed",
        },
      ],
    },
    {
      id: 7,
      order_number: "ORD-007",
      token_no: 7,
      customer_id: 9,
      customer_name: "Muneeb Sheikh",
      table_id: null,
      table_title: null,
      delivery_type: "takeaway",
      customer_type: "existing",
      is_qr_order: 0,
      status: "completed",
      payment_status: "paid",
      payment_type: "jazzcash",
      net_total: 460,
      tax_total: 78,
      total: 538,
      notes: "",
      created_at: ago(1, 13),
      updated_at: ago(1, 13),
      order_items: [
        {
          id: 10,
          order_id: 7,
          menu_item_id: 13,
          title: "Nihari",
          price: 480,
          quantity: 1,
          variant: null,
          addons: "Extra Naan",
          addons_ids: [],
          notes: "",
          tax_rate: 0,
          tax_type: "",
          tax_title: "",
          status: "completed",
        },
      ],
    },
    {
      id: 8,
      order_number: "ORD-008",
      token_no: 8,
      customer_id: 12,
      customer_name: "Maira Iqbal",
      table_id: 3,
      table_title: "T-3",
      delivery_type: "dine_in",
      customer_type: "existing",
      is_qr_order: 0,
      status: "completed",
      payment_status: "paid",
      payment_type: "cash",
      net_total: 510,
      tax_total: 87,
      total: 597,
      notes: "Extra raita",
      created_at: ago(1, 14),
      updated_at: ago(1, 15),
      order_items: [
        {
          id: 11,
          order_id: 8,
          menu_item_id: 14,
          title: "Daal Chawal",
          price: 230,
          quantity: 2,
          variant: null,
          addons: null,
          addons_ids: [],
          notes: "",
          tax_rate: 0,
          tax_type: "",
          tax_title: "",
          status: "completed",
        },
        {
          id: 12,
          order_id: 8,
          menu_item_id: 2,
          title: "Kashmiri Chai",
          price: 150,
          quantity: 1,
          variant: null,
          addons: "Extra Malai",
          addons_ids: [],
          notes: "",
          tax_rate: 0,
          tax_type: "",
          tax_title: "",
          status: "completed",
        },
      ],
    },
    {
      id: 9,
      order_number: "ORD-009",
      token_no: 9,
      customer_id: 14,
      customer_name: "Hina Baig",
      table_id: 7,
      table_title: "T-7",
      delivery_type: "dine_in",
      customer_type: "existing",
      is_qr_order: 0,
      status: "cancelled",
      payment_status: "unpaid",
      payment_type: "cash",
      net_total: 380,
      tax_total: 65,
      total: 445,
      notes: "Cancelled – no-show",
      created_at: ago(1, 19),
      updated_at: ago(1, 20),
      order_items: [
        {
          id: 13,
          order_id: 9,
          menu_item_id: 16,
          title: "Chicken Biryani",
          price: 380,
          quantity: 1,
          variant: null,
          addons: "Salad",
          addons_ids: [],
          notes: "",
          tax_rate: 0,
          tax_type: "",
          tax_title: "",
          status: "completed",
        },
      ],
    },
    // ── 2 DAYS AGO ─────────────────────────────────────────────────────────
    {
      id: 10,
      order_number: "ORD-010",
      token_no: 10,
      customer_id: 4,
      customer_name: "Ayesha Siddiqui",
      table_id: 2,
      table_title: "T-2",
      delivery_type: "dine_in",
      customer_type: "existing",
      is_qr_order: 0,
      status: "completed",
      payment_status: "paid",
      payment_type: "easypaisa",
      net_total: 440,
      tax_total: 75,
      total: 515,
      notes: "",
      created_at: ago(2, 13),
      updated_at: ago(2, 14),
      order_items: [
        {
          id: 14,
          order_id: 10,
          menu_item_id: 17,
          title: "Beef Pulao",
          price: 370,
          quantity: 1,
          variant: null,
          addons: "Raita",
          addons_ids: [],
          notes: "",
          tax_rate: 0,
          tax_type: "",
          tax_title: "",
          status: "completed",
        },
        {
          id: 15,
          order_id: 10,
          menu_item_id: 5,
          title: "Rooh Afza Sharbat",
          price: 70,
          quantity: 1,
          variant: null,
          addons: null,
          addons_ids: [],
          notes: "",
          tax_rate: 0,
          tax_type: "",
          tax_title: "",
          status: "completed",
        },
      ],
    },
    {
      id: 11,
      order_number: "ORD-011",
      token_no: 11,
      customer_id: 19,
      customer_name: "Danyal Farooq",
      table_id: null,
      table_title: null,
      delivery_type: "takeaway",
      customer_type: "existing",
      is_qr_order: 0,
      status: "completed",
      payment_status: "paid",
      payment_type: "card",
      net_total: 550,
      tax_total: 94,
      total: 644,
      notes: "Leave at reception LUMS gate",
      created_at: ago(2, 14),
      updated_at: ago(2, 14),
      order_items: [
        {
          id: 16,
          order_id: 11,
          menu_item_id: 21,
          title: "Chicken Roll",
          price: 260,
          quantity: 2,
          variant: null,
          addons: "Extra Sauce",
          addons_ids: [],
          notes: "",
          tax_rate: 0,
          tax_type: "",
          tax_title: "",
          status: "completed",
        },
      ],
    },
    {
      id: 12,
      order_number: "ORD-012",
      token_no: 12,
      customer_id: 6,
      customer_name: "Zara Qureshi",
      table_id: 9,
      table_title: "T-9",
      delivery_type: "dine_in",
      customer_type: "existing",
      is_qr_order: 0,
      status: "completed",
      payment_status: "paid",
      payment_type: "jazzcash",
      net_total: 760,
      tax_total: 129,
      total: 889,
      notes: "Rooftop – great view!",
      created_at: ago(2, 19),
      updated_at: ago(2, 20),
      order_items: [
        {
          id: 17,
          order_id: 12,
          menu_item_id: 15,
          title: "Halwa Puri (2 pcs)",
          price: 250,
          quantity: 2,
          variant: null,
          addons: "Chana",
          addons_ids: [],
          notes: "",
          tax_rate: 0,
          tax_type: "",
          tax_title: "",
          status: "completed",
        },
        {
          id: 18,
          order_id: 12,
          menu_item_id: 3,
          title: "Lassi",
          price: 130,
          quantity: 2,
          variant: "Mango",
          addons: null,
          addons_ids: [],
          notes: "",
          tax_rate: 0,
          tax_type: "",
          tax_title: "",
          status: "completed",
        },
      ],
    },
    // ── 3 DAYS AGO ─────────────────────────────────────────────────────────
    {
      id: 13,
      order_number: "ORD-013",
      token_no: 13,
      customer_id: 10,
      customer_name: "Nadia Aslam",
      table_id: 4,
      table_title: "T-4",
      delivery_type: "dine_in",
      customer_type: "existing",
      is_qr_order: 0,
      status: "completed",
      payment_status: "paid",
      payment_type: "cash",
      net_total: 330,
      tax_total: 56,
      total: 386,
      notes: "",
      created_at: ago(3, 12),
      updated_at: ago(3, 13),
      order_items: [
        {
          id: 19,
          order_id: 13,
          menu_item_id: 27,
          title: "Aloo Paratha",
          price: 180,
          quantity: 1,
          variant: null,
          addons: "Butter extra",
          addons_ids: [],
          notes: "",
          tax_rate: 0,
          tax_type: "",
          tax_title: "",
          status: "completed",
        },
        {
          id: 20,
          order_id: 13,
          menu_item_id: 1,
          title: "Doodh Patti Chai",
          price: 80,
          quantity: 1,
          variant: "Full Cup",
          addons: null,
          addons_ids: [],
          notes: "",
          tax_rate: 0,
          tax_type: "",
          tax_title: "",
          status: "completed",
        },
      ],
    },
    {
      id: 14,
      order_number: "ORD-014",
      token_no: 14,
      customer_id: 21,
      customer_name: "Waleed Anwar",
      table_id: 1,
      table_title: "T-1",
      delivery_type: "dine_in",
      customer_type: "existing",
      is_qr_order: 0,
      status: "completed",
      payment_status: "paid",
      payment_type: "card",
      net_total: 480,
      tax_total: 82,
      total: 562,
      notes: "Extra Naan ×4",
      created_at: ago(3, 13),
      updated_at: ago(3, 14),
      order_items: [
        {
          id: 21,
          order_id: 14,
          menu_item_id: 11,
          title: "Chicken Karahi",
          price: 550,
          quantity: 1,
          variant: "Half",
          addons: "Extra Naan ×4",
          addons_ids: [],
          notes: "",
          tax_rate: 0,
          tax_type: "",
          tax_title: "",
          status: "completed",
        },
      ],
    },
    // ── 4-5 DAYS AGO ───────────────────────────────────────────────────────
    {
      id: 15,
      order_number: "ORD-015",
      token_no: 15,
      customer_id: 16,
      customer_name: "Sana Waheed",
      table_id: 5,
      table_title: "T-5",
      delivery_type: "dine_in",
      customer_type: "existing",
      is_qr_order: 0,
      status: "completed",
      payment_status: "paid",
      payment_type: "cash",
      net_total: 590,
      tax_total: 100,
      total: 690,
      notes: "",
      created_at: ago(4, 13),
      updated_at: ago(4, 14),
      order_items: [
        {
          id: 22,
          order_id: 15,
          menu_item_id: 18,
          title: "Kabuli Pulao",
          price: 390,
          quantity: 1,
          variant: null,
          addons: null,
          addons_ids: [],
          notes: "",
          tax_rate: 0,
          tax_type: "",
          tax_title: "",
          status: "completed",
        },
        {
          id: 23,
          order_id: 15,
          menu_item_id: 24,
          title: "Gulab Jamun (2 pcs)",
          price: 100,
          quantity: 2,
          variant: null,
          addons: null,
          addons_ids: [],
          notes: "",
          tax_rate: 0,
          tax_type: "",
          tax_title: "",
          status: "completed",
        },
      ],
    },
    {
      id: 16,
      order_number: "ORD-016",
      token_no: 16,
      customer_id: 11,
      customer_name: "Imran Butt",
      table_id: null,
      table_title: null,
      delivery_type: "takeaway",
      customer_type: "existing",
      is_qr_order: 0,
      status: "completed",
      payment_status: "paid",
      payment_type: "easypaisa",
      net_total: 660,
      tax_total: 112,
      total: 772,
      notes: "",
      created_at: ago(4, 15),
      updated_at: ago(4, 15),
      order_items: [
        {
          id: 24,
          order_id: 16,
          menu_item_id: 16,
          title: "Chicken Biryani",
          price: 380,
          quantity: 1,
          variant: null,
          addons: null,
          addons_ids: [],
          notes: "",
          tax_rate: 0,
          tax_type: "",
          tax_title: "",
          status: "completed",
        },
        {
          id: 25,
          order_id: 16,
          menu_item_id: 27,
          title: "Aloo Paratha",
          price: 180,
          quantity: 1,
          variant: null,
          addons: null,
          addons_ids: [],
          notes: "",
          tax_rate: 0,
          tax_type: "",
          tax_title: "",
          status: "completed",
        },
        {
          id: 26,
          order_id: 16,
          menu_item_id: 24,
          title: "Gulab Jamun (2 pcs)",
          price: 100,
          quantity: 1,
          variant: null,
          addons: null,
          addons_ids: [],
          notes: "",
          tax_rate: 0,
          tax_type: "",
          tax_title: "",
          status: "completed",
        },
      ],
    },
    {
      id: 17,
      order_number: "ORD-017",
      token_no: 17,
      customer_id: 22,
      customer_name: "Hira Bashir",
      table_id: 6,
      table_title: "T-6",
      delivery_type: "dine_in",
      customer_type: "existing",
      is_qr_order: 0,
      status: "completed",
      payment_status: "paid",
      payment_type: "card",
      net_total: 410,
      tax_total: 70,
      total: 480,
      notes: "UET girls table",
      created_at: ago(5, 12),
      updated_at: ago(5, 13),
      order_items: [
        {
          id: 27,
          order_id: 17,
          menu_item_id: 19,
          title: "Aloo Tikki Burger",
          price: 290,
          quantity: 1,
          variant: null,
          addons: null,
          addons_ids: [],
          notes: "",
          tax_rate: 0,
          tax_type: "",
          tax_title: "",
          status: "completed",
        },
        {
          id: 28,
          order_id: 17,
          menu_item_id: 6,
          title: "Fresh Lime Soda",
          price: 120,
          quantity: 1,
          variant: null,
          addons: null,
          addons_ids: [],
          notes: "",
          tax_rate: 0,
          tax_type: "",
          tax_title: "",
          status: "completed",
        },
      ],
    },
    {
      id: 18,
      order_number: "ORD-018",
      token_no: 18,
      customer_id: 13,
      customer_name: "Shahzaib Nawaz",
      table_id: 2,
      table_title: "T-2",
      delivery_type: "dine_in",
      customer_type: "existing",
      is_qr_order: 0,
      status: "completed",
      payment_status: "paid",
      payment_type: "jazzcash",
      net_total: 720,
      tax_total: 122,
      total: 842,
      notes: "",
      created_at: ago(5, 19),
      updated_at: ago(5, 20),
      order_items: [
        {
          id: 29,
          order_id: 18,
          menu_item_id: 13,
          title: "Nihari",
          price: 480,
          quantity: 1,
          variant: null,
          addons: null,
          addons_ids: [],
          notes: "",
          tax_rate: 0,
          tax_type: "",
          tax_title: "",
          status: "completed",
        },
        {
          id: 30,
          order_id: 18,
          menu_item_id: 1,
          title: "Doodh Patti Chai",
          price: 80,
          quantity: 3,
          variant: null,
          addons: null,
          addons_ids: [],
          notes: "",
          tax_rate: 0,
          tax_type: "",
          tax_title: "",
          status: "completed",
        },
      ],
    },
    // ── LAST WEEK (6-10 days) ───────────────────────────────────────────────
    {
      id: 19,
      order_number: "ORD-019",
      token_no: 19,
      customer_id: 18,
      customer_name: "Maryam Zahid",
      table_id: 7,
      table_title: "T-7",
      delivery_type: "dine_in",
      customer_type: "existing",
      is_qr_order: 0,
      status: "completed",
      payment_status: "paid",
      payment_type: "cash",
      net_total: 940,
      tax_total: 160,
      total: 1100,
      notes: "FAST-NU girls batch dinner",
      created_at: ago(6, 19),
      updated_at: ago(6, 20),
      order_items: [
        {
          id: 31,
          order_id: 19,
          menu_item_id: 11,
          title: "Chicken Karahi",
          price: 550,
          quantity: 1,
          variant: "Half",
          addons: "Extra Naan",
          addons_ids: [],
          notes: "",
          tax_rate: 0,
          tax_type: "",
          tax_title: "",
          status: "completed",
        },
        {
          id: 32,
          order_id: 19,
          menu_item_id: 3,
          title: "Lassi",
          price: 130,
          quantity: 3,
          variant: null,
          addons: null,
          addons_ids: [],
          notes: "",
          tax_rate: 0,
          tax_type: "",
          tax_title: "",
          status: "completed",
        },
      ],
    },
    {
      id: 20,
      order_number: "ORD-020",
      token_no: 20,
      customer_id: 8,
      customer_name: "Sara Ahmed",
      table_id: null,
      table_title: null,
      delivery_type: "takeaway",
      customer_type: "existing",
      is_qr_order: 0,
      status: "completed",
      payment_status: "paid",
      payment_type: "card",
      net_total: 260,
      tax_total: 44,
      total: 304,
      notes: "",
      created_at: ago(7, 13),
      updated_at: ago(7, 13),
      order_items: [
        {
          id: 33,
          order_id: 20,
          menu_item_id: 21,
          title: "Chicken Roll",
          price: 260,
          quantity: 1,
          variant: null,
          addons: null,
          addons_ids: [],
          notes: "",
          tax_rate: 0,
          tax_type: "",
          tax_title: "",
          status: "completed",
        },
      ],
    },
    {
      id: 21,
      order_number: "ORD-021",
      token_no: 21,
      customer_id: 15,
      customer_name: "Arsalan Tariq",
      table_id: 8,
      table_title: "T-8",
      delivery_type: "dine_in",
      customer_type: "existing",
      is_qr_order: 0,
      status: "completed",
      payment_status: "paid",
      payment_type: "easypaisa",
      net_total: 780,
      tax_total: 133,
      total: 913,
      notes: "GIKI batch table – rooftop",
      created_at: ago(8, 18),
      updated_at: ago(8, 19),
      order_items: [
        {
          id: 34,
          order_id: 21,
          menu_item_id: 18,
          title: "Kabuli Pulao",
          price: 390,
          quantity: 2,
          variant: null,
          addons: null,
          addons_ids: [],
          notes: "",
          tax_rate: 0,
          tax_type: "",
          tax_title: "",
          status: "completed",
        },
      ],
    },
    {
      id: 22,
      order_number: "ORD-022",
      token_no: 22,
      customer_id: 20,
      customer_name: "Aisha Rehman",
      table_id: 3,
      table_title: "T-3",
      delivery_type: "dine_in",
      customer_type: "existing",
      is_qr_order: 0,
      status: "completed",
      payment_status: "paid",
      payment_type: "cash",
      net_total: 490,
      tax_total: 83,
      total: 573,
      notes: "",
      created_at: ago(9, 13),
      updated_at: ago(9, 14),
      order_items: [
        {
          id: 35,
          order_id: 22,
          menu_item_id: 22,
          title: "Seekh Kebab Roll",
          price: 310,
          quantity: 1,
          variant: null,
          addons: null,
          addons_ids: [],
          notes: "",
          tax_rate: 0,
          tax_type: "",
          tax_title: "",
          status: "completed",
        },
        {
          id: 36,
          order_id: 22,
          menu_item_id: 27,
          title: "Aloo Paratha",
          price: 180,
          quantity: 1,
          variant: null,
          addons: null,
          addons_ids: [],
          notes: "",
          tax_rate: 0,
          tax_type: "",
          tax_title: "",
          status: "completed",
        },
      ],
    },
    {
      id: 23,
      order_number: "ORD-023",
      token_no: 23,
      customer_id: 1,
      customer_name: "Ahmed Raza",
      table_id: 9,
      table_title: "T-9",
      delivery_type: "dine_in",
      customer_type: "existing",
      is_qr_order: 0,
      status: "completed",
      payment_status: "paid",
      payment_type: "card",
      net_total: 1160,
      tax_total: 197,
      total: 1357,
      notes: "Repeat visitor – rooftop",
      created_at: ago(10, 14),
      updated_at: ago(10, 15),
      order_items: [
        {
          id: 37,
          order_id: 23,
          menu_item_id: 12,
          title: "Beef Karahi",
          price: 600,
          quantity: 1,
          variant: "Full",
          addons: null,
          addons_ids: [],
          notes: "",
          tax_rate: 0,
          tax_type: "",
          tax_title: "",
          status: "completed",
        },
        {
          id: 38,
          order_id: 23,
          menu_item_id: 16,
          title: "Chicken Biryani",
          price: 380,
          quantity: 1,
          variant: null,
          addons: "Raita",
          addons_ids: [],
          notes: "",
          tax_rate: 0,
          tax_type: "",
          tax_title: "",
          status: "completed",
        },
        {
          id: 39,
          order_id: 23,
          menu_item_id: 1,
          title: "Doodh Patti Chai",
          price: 80,
          quantity: 2,
          variant: null,
          addons: null,
          addons_ids: [],
          notes: "",
          tax_rate: 0,
          tax_type: "",
          tax_title: "",
          status: "completed",
        },
      ],
    },
    // ── THIS MONTH (11-20 days ago) ────────────────────────────────────────
    {
      id: 24,
      order_number: "ORD-024",
      token_no: 24,
      customer_id: 3,
      customer_name: "Usman Ali",
      table_id: 1,
      table_title: "T-1",
      delivery_type: "dine_in",
      customer_type: "existing",
      is_qr_order: 0,
      status: "completed",
      payment_status: "paid",
      payment_type: "jazzcash",
      net_total: 560,
      tax_total: 95,
      total: 655,
      notes: "",
      created_at: ago(11, 12),
      updated_at: ago(11, 13),
      order_items: [
        {
          id: 40,
          order_id: 24,
          menu_item_id: 14,
          title: "Daal Chawal",
          price: 230,
          quantity: 2,
          variant: null,
          addons: null,
          addons_ids: [],
          notes: "",
          tax_rate: 0,
          tax_type: "",
          tax_title: "",
          status: "completed",
        },
        {
          id: 41,
          order_id: 24,
          menu_item_id: 2,
          title: "Kashmiri Chai",
          price: 150,
          quantity: 1,
          variant: null,
          addons: null,
          addons_ids: [],
          notes: "",
          tax_rate: 0,
          tax_type: "",
          tax_title: "",
          status: "completed",
        },
      ],
    },
    {
      id: 25,
      order_number: "ORD-025",
      token_no: 25,
      customer_id: 17,
      customer_name: "Talha Mahmood",
      table_id: 5,
      table_title: "T-5",
      delivery_type: "dine_in",
      customer_type: "existing",
      is_qr_order: 0,
      status: "completed",
      payment_status: "paid",
      payment_type: "cash",
      net_total: 810,
      tax_total: 138,
      total: 948,
      notes: "Extra biryani portion",
      created_at: ago(13, 13),
      updated_at: ago(13, 14),
      order_items: [
        {
          id: 42,
          order_id: 25,
          menu_item_id: 16,
          title: "Chicken Biryani",
          price: 380,
          quantity: 2,
          variant: null,
          addons: "Raita",
          addons_ids: [],
          notes: "",
          tax_rate: 0,
          tax_type: "",
          tax_title: "",
          status: "completed",
        },
        {
          id: 43,
          order_id: 25,
          menu_item_id: 3,
          title: "Lassi",
          price: 130,
          quantity: 1,
          variant: null,
          addons: null,
          addons_ids: [],
          notes: "",
          tax_rate: 0,
          tax_type: "",
          tax_title: "",
          status: "completed",
        },
      ],
    },
    {
      id: 26,
      order_number: "ORD-026",
      token_no: 26,
      customer_id: 7,
      customer_name: "Bilal Hussain",
      table_id: null,
      table_title: null,
      delivery_type: "takeaway",
      customer_type: "existing",
      is_qr_order: 0,
      status: "completed",
      payment_status: "paid",
      payment_type: "easypaisa",
      net_total: 370,
      tax_total: 63,
      total: 433,
      notes: "",
      created_at: ago(15, 14),
      updated_at: ago(15, 14),
      order_items: [
        {
          id: 44,
          order_id: 26,
          menu_item_id: 17,
          title: "Beef Pulao",
          price: 370,
          quantity: 1,
          variant: null,
          addons: null,
          addons_ids: [],
          notes: "",
          tax_rate: 0,
          tax_type: "",
          tax_title: "",
          status: "completed",
        },
      ],
    },
    {
      id: 27,
      order_number: "ORD-027",
      token_no: 27,
      customer_id: 4,
      customer_name: "Ayesha Siddiqui",
      table_id: 2,
      table_title: "T-2",
      delivery_type: "dine_in",
      customer_type: "existing",
      is_qr_order: 0,
      status: "completed",
      payment_status: "paid",
      payment_type: "card",
      net_total: 390,
      tax_total: 66,
      total: 456,
      notes: "",
      created_at: ago(17, 18),
      updated_at: ago(17, 19),
      order_items: [
        {
          id: 45,
          order_id: 27,
          menu_item_id: 14,
          title: "Daal Chawal",
          price: 230,
          quantity: 1,
          variant: null,
          addons: null,
          addons_ids: [],
          notes: "",
          tax_rate: 0,
          tax_type: "",
          tax_title: "",
          status: "completed",
        },
        {
          id: 46,
          order_id: 27,
          menu_item_id: 2,
          title: "Kashmiri Chai",
          price: 150,
          quantity: 1,
          variant: null,
          addons: null,
          addons_ids: [],
          notes: "",
          tax_rate: 0,
          tax_type: "",
          tax_title: "",
          status: "completed",
        },
      ],
    },
    {
      id: 28,
      order_number: "ORD-028",
      token_no: 28,
      customer_id: 6,
      customer_name: "Zara Qureshi",
      table_id: 4,
      table_title: "T-4",
      delivery_type: "dine_in",
      customer_type: "existing",
      is_qr_order: 0,
      status: "completed",
      payment_status: "paid",
      payment_type: "cash",
      net_total: 430,
      tax_total: 73,
      total: 503,
      notes: "",
      created_at: ago(19, 13),
      updated_at: ago(19, 14),
      order_items: [
        {
          id: 47,
          order_id: 28,
          menu_item_id: 22,
          title: "Seekh Kebab Roll",
          price: 310,
          quantity: 1,
          variant: null,
          addons: null,
          addons_ids: [],
          notes: "",
          tax_rate: 0,
          tax_type: "",
          tax_title: "",
          status: "completed",
        },
        {
          id: 48,
          order_id: 28,
          menu_item_id: 7,
          title: "Samosa (2 pcs)",
          price: 60,
          quantity: 2,
          variant: null,
          addons: null,
          addons_ids: [],
          notes: "",
          tax_rate: 0,
          tax_type: "",
          tax_title: "",
          status: "completed",
        },
      ],
    },
    // ── LAST MONTH (21-40 days ago) ────────────────────────────────────────
    {
      id: 29,
      order_number: "ORD-029",
      token_no: 29,
      customer_id: 9,
      customer_name: "Muneeb Sheikh",
      table_id: 6,
      table_title: "T-6",
      delivery_type: "dine_in",
      customer_type: "existing",
      is_qr_order: 0,
      status: "completed",
      payment_status: "paid",
      payment_type: "jazzcash",
      net_total: 920,
      tax_total: 156,
      total: 1076,
      notes: "COMSATS batch – 6 tables pushed together",
      created_at: ago(22, 19),
      updated_at: ago(22, 20),
      order_items: [
        {
          id: 49,
          order_id: 29,
          menu_item_id: 11,
          title: "Chicken Karahi",
          price: 550,
          quantity: 1,
          variant: "Full",
          addons: "Extra Naan",
          addons_ids: [],
          notes: "",
          tax_rate: 0,
          tax_type: "",
          tax_title: "",
          status: "completed",
        },
        {
          id: 50,
          order_id: 29,
          menu_item_id: 3,
          title: "Lassi",
          price: 130,
          quantity: 2,
          variant: null,
          addons: null,
          addons_ids: [],
          notes: "",
          tax_rate: 0,
          tax_type: "",
          tax_title: "",
          status: "completed",
        },
      ],
    },
    {
      id: 30,
      order_number: "ORD-030",
      token_no: 30,
      customer_id: 11,
      customer_name: "Imran Butt",
      table_id: 3,
      table_title: "T-3",
      delivery_type: "dine_in",
      customer_type: "existing",
      is_qr_order: 0,
      status: "completed",
      payment_status: "paid",
      payment_type: "card",
      net_total: 670,
      tax_total: 114,
      total: 784,
      notes: "",
      created_at: ago(25, 13),
      updated_at: ago(25, 14),
      order_items: [
        {
          id: 51,
          order_id: 30,
          menu_item_id: 13,
          title: "Nihari",
          price: 480,
          quantity: 1,
          variant: null,
          addons: "Extra Naan",
          addons_ids: [],
          notes: "",
          tax_rate: 0,
          tax_type: "",
          tax_title: "",
          status: "completed",
        },
        {
          id: 52,
          order_id: 30,
          menu_item_id: 5,
          title: "Rooh Afza Sharbat",
          price: 70,
          quantity: 2,
          variant: null,
          addons: null,
          addons_ids: [],
          notes: "",
          tax_rate: 0,
          tax_type: "",
          tax_title: "",
          status: "completed",
        },
      ],
    },
    {
      id: 31,
      order_number: "ORD-031",
      token_no: 31,
      customer_id: 14,
      customer_name: "Hina Baig",
      table_id: 7,
      table_title: "T-7",
      delivery_type: "dine_in",
      customer_type: "existing",
      is_qr_order: 0,
      status: "completed",
      payment_status: "paid",
      payment_type: "cash",
      net_total: 500,
      tax_total: 85,
      total: 585,
      notes: "",
      created_at: ago(28, 18),
      updated_at: ago(28, 19),
      order_items: [
        {
          id: 53,
          order_id: 31,
          menu_item_id: 16,
          title: "Chicken Biryani",
          price: 380,
          quantity: 1,
          variant: null,
          addons: "Raita",
          addons_ids: [],
          notes: "",
          tax_rate: 0,
          tax_type: "",
          tax_title: "",
          status: "completed",
        },
        {
          id: 54,
          order_id: 31,
          menu_item_id: 9,
          title: "Aloo Tikki (3 pcs)",
          price: 120,
          quantity: 1,
          variant: null,
          addons: null,
          addons_ids: [],
          notes: "",
          tax_rate: 0,
          tax_type: "",
          tax_title: "",
          status: "completed",
        },
      ],
    },
    {
      id: 32,
      order_number: "ORD-032",
      token_no: 32,
      customer_id: 2,
      customer_name: "Fatima Khan",
      table_id: null,
      table_title: null,
      delivery_type: "takeaway",
      customer_type: "existing",
      is_qr_order: 0,
      status: "completed",
      payment_status: "paid",
      payment_type: "easypaisa",
      net_total: 310,
      tax_total: 53,
      total: 363,
      notes: "",
      created_at: ago(30, 14),
      updated_at: ago(30, 14),
      order_items: [
        {
          id: 55,
          order_id: 32,
          menu_item_id: 27,
          title: "Aloo Paratha",
          price: 180,
          quantity: 1,
          variant: null,
          addons: "Butter extra",
          addons_ids: [],
          notes: "",
          tax_rate: 0,
          tax_type: "",
          tax_title: "",
          status: "completed",
        },
        {
          id: 56,
          order_id: 32,
          menu_item_id: 1,
          title: "Doodh Patti Chai",
          price: 80,
          quantity: 1,
          variant: null,
          addons: null,
          addons_ids: [],
          notes: "",
          tax_rate: 0,
          tax_type: "",
          tax_title: "",
          status: "completed",
        },
      ],
    },
    {
      id: 33,
      order_number: "ORD-033",
      token_no: 33,
      customer_id: 19,
      customer_name: "Danyal Farooq",
      table_id: 8,
      table_title: "T-8",
      delivery_type: "dine_in",
      customer_type: "existing",
      is_qr_order: 0,
      status: "completed",
      payment_status: "paid",
      payment_type: "card",
      net_total: 850,
      tax_total: 145,
      total: 995,
      notes: "Rooftop – LUMS alumni meetup",
      created_at: ago(33, 19),
      updated_at: ago(33, 20),
      order_items: [
        {
          id: 57,
          order_id: 33,
          menu_item_id: 12,
          title: "Beef Karahi",
          price: 600,
          quantity: 1,
          variant: "Half",
          addons: null,
          addons_ids: [],
          notes: "",
          tax_rate: 0,
          tax_type: "",
          tax_title: "",
          status: "completed",
        },
        {
          id: 58,
          order_id: 33,
          menu_item_id: 4,
          title: "Cold Coffee",
          price: 220,
          quantity: 1,
          variant: null,
          addons: null,
          addons_ids: [],
          notes: "",
          tax_rate: 0,
          tax_type: "",
          tax_title: "",
          status: "completed",
        },
      ],
    },
    {
      id: 34,
      order_number: "ORD-034",
      token_no: 34,
      customer_id: 22,
      customer_name: "Hira Bashir",
      table_id: 2,
      table_title: "T-2",
      delivery_type: "dine_in",
      customer_type: "existing",
      is_qr_order: 0,
      status: "completed",
      payment_status: "paid",
      payment_type: "cash",
      net_total: 430,
      tax_total: 73,
      total: 503,
      notes: "",
      created_at: ago(36, 12),
      updated_at: ago(36, 13),
      order_items: [
        {
          id: 59,
          order_id: 34,
          menu_item_id: 19,
          title: "Aloo Tikki Burger",
          price: 290,
          quantity: 1,
          variant: null,
          addons: null,
          addons_ids: [],
          notes: "",
          tax_rate: 0,
          tax_type: "",
          tax_title: "",
          status: "completed",
        },
        {
          id: 60,
          order_id: 34,
          menu_item_id: 5,
          title: "Rooh Afza Sharbat",
          price: 70,
          quantity: 2,
          variant: null,
          addons: null,
          addons_ids: [],
          notes: "",
          tax_rate: 0,
          tax_type: "",
          tax_title: "",
          status: "completed",
        },
      ],
    },
    {
      id: 35,
      order_number: "ORD-035",
      token_no: 35,
      customer_id: 16,
      customer_name: "Sana Waheed",
      table_id: 5,
      table_title: "T-5",
      delivery_type: "dine_in",
      customer_type: "existing",
      is_qr_order: 0,
      status: "completed",
      payment_status: "paid",
      payment_type: "jazzcash",
      net_total: 760,
      tax_total: 129,
      total: 889,
      notes: "",
      created_at: ago(38, 13),
      updated_at: ago(38, 14),
      order_items: [
        {
          id: 61,
          order_id: 35,
          menu_item_id: 15,
          title: "Halwa Puri (2 pcs)",
          price: 250,
          quantity: 2,
          variant: null,
          addons: "Chana",
          addons_ids: [],
          notes: "",
          tax_rate: 0,
          tax_type: "",
          tax_title: "",
          status: "completed",
        },
        {
          id: 62,
          order_id: 35,
          menu_item_id: 3,
          title: "Lassi",
          price: 130,
          quantity: 2,
          variant: null,
          addons: null,
          addons_ids: [],
          notes: "",
          tax_rate: 0,
          tax_type: "",
          tax_title: "",
          status: "completed",
        },
      ],
    },
  ];
}

// ── Seed: invoices (for completed+paid orders) ────────────────────────────
function generateSeedInvoices() {
  function ago(days, hour = 14) {
    const dt = new Date();
    dt.setDate(dt.getDate() - days);
    dt.setHours(hour, 0, 0, 0);
    return dt.toISOString();
  }
  return [
    {
      id: 1,
      invoice_number: "INV-001",
      order_ids: [1],
      token_ids: "1",
      customer_id: 1,
      customer_name: "Ahmed Raza",
      net_total: 730,
      tax_total: 124,
      total: 854,
      payment_type: "cash",
      payment_status: "paid",
      created_at: ago(0, 13),
    },
    {
      id: 2,
      invoice_number: "INV-002",
      order_ids: [2],
      token_ids: "2",
      customer_id: 2,
      customer_name: "Fatima Khan",
      net_total: 370,
      tax_total: 63,
      total: 433,
      payment_type: "jazzcash",
      payment_status: "paid",
      created_at: ago(0, 14),
    },
    {
      id: 3,
      invoice_number: "INV-003",
      order_ids: [3],
      token_ids: "3",
      customer_id: 5,
      customer_name: "Hamza Malik",
      net_total: 690,
      tax_total: 117,
      total: 807,
      payment_type: "easypaisa",
      payment_status: "paid",
      created_at: ago(0, 14),
    },
    {
      id: 4,
      invoice_number: "INV-004",
      order_ids: [6],
      token_ids: "6",
      customer_id: 7,
      customer_name: "Bilal Hussain",
      net_total: 620,
      tax_total: 105,
      total: 725,
      payment_type: "card",
      payment_status: "paid",
      created_at: ago(1, 13),
    },
    {
      id: 5,
      invoice_number: "INV-005",
      order_ids: [7],
      token_ids: "7",
      customer_id: 9,
      customer_name: "Muneeb Sheikh",
      net_total: 460,
      tax_total: 78,
      total: 538,
      payment_type: "jazzcash",
      payment_status: "paid",
      created_at: ago(1, 13),
    },
    {
      id: 6,
      invoice_number: "INV-006",
      order_ids: [8],
      token_ids: "8",
      customer_id: 12,
      customer_name: "Maira Iqbal",
      net_total: 510,
      tax_total: 87,
      total: 597,
      payment_type: "cash",
      payment_status: "paid",
      created_at: ago(1, 15),
    },
    {
      id: 7,
      invoice_number: "INV-007",
      order_ids: [10],
      token_ids: "10",
      customer_id: 4,
      customer_name: "Ayesha Siddiqui",
      net_total: 440,
      tax_total: 75,
      total: 515,
      payment_type: "easypaisa",
      payment_status: "paid",
      created_at: ago(2, 14),
    },
    {
      id: 8,
      invoice_number: "INV-008",
      order_ids: [11],
      token_ids: "11",
      customer_id: 19,
      customer_name: "Danyal Farooq",
      net_total: 550,
      tax_total: 94,
      total: 644,
      payment_type: "card",
      payment_status: "paid",
      created_at: ago(2, 14),
    },
    {
      id: 9,
      invoice_number: "INV-009",
      order_ids: [12],
      token_ids: "12",
      customer_id: 6,
      customer_name: "Zara Qureshi",
      net_total: 760,
      tax_total: 129,
      total: 889,
      payment_type: "jazzcash",
      payment_status: "paid",
      created_at: ago(2, 20),
    },
    {
      id: 10,
      invoice_number: "INV-010",
      order_ids: [13],
      token_ids: "13",
      customer_id: 10,
      customer_name: "Nadia Aslam",
      net_total: 330,
      tax_total: 56,
      total: 386,
      payment_type: "cash",
      payment_status: "paid",
      created_at: ago(3, 13),
    },
    {
      id: 11,
      invoice_number: "INV-011",
      order_ids: [14],
      token_ids: "14",
      customer_id: 21,
      customer_name: "Waleed Anwar",
      net_total: 480,
      tax_total: 82,
      total: 562,
      payment_type: "card",
      payment_status: "paid",
      created_at: ago(3, 14),
    },
    {
      id: 12,
      invoice_number: "INV-012",
      order_ids: [15],
      token_ids: "15",
      customer_id: 16,
      customer_name: "Sana Waheed",
      net_total: 590,
      tax_total: 100,
      total: 690,
      payment_type: "cash",
      payment_status: "paid",
      created_at: ago(4, 14),
    },
    {
      id: 13,
      invoice_number: "INV-013",
      order_ids: [16],
      token_ids: "16",
      customer_id: 11,
      customer_name: "Imran Butt",
      net_total: 660,
      tax_total: 112,
      total: 772,
      payment_type: "easypaisa",
      payment_status: "paid",
      created_at: ago(4, 15),
    },
    {
      id: 14,
      invoice_number: "INV-014",
      order_ids: [17],
      token_ids: "17",
      customer_id: 22,
      customer_name: "Hira Bashir",
      net_total: 410,
      tax_total: 70,
      total: 480,
      payment_type: "card",
      payment_status: "paid",
      created_at: ago(5, 13),
    },
    {
      id: 15,
      invoice_number: "INV-015",
      order_ids: [18],
      token_ids: "18",
      customer_id: 13,
      customer_name: "Shahzaib Nawaz",
      net_total: 720,
      tax_total: 122,
      total: 842,
      payment_type: "jazzcash",
      payment_status: "paid",
      created_at: ago(5, 20),
    },
    {
      id: 16,
      invoice_number: "INV-016",
      order_ids: [19],
      token_ids: "19",
      customer_id: 18,
      customer_name: "Maryam Zahid",
      net_total: 940,
      tax_total: 160,
      total: 1100,
      payment_type: "cash",
      payment_status: "paid",
      created_at: ago(6, 20),
    },
    {
      id: 17,
      invoice_number: "INV-017",
      order_ids: [20],
      token_ids: "20",
      customer_id: 8,
      customer_name: "Sara Ahmed",
      net_total: 260,
      tax_total: 44,
      total: 304,
      payment_type: "card",
      payment_status: "paid",
      created_at: ago(7, 13),
    },
    {
      id: 18,
      invoice_number: "INV-018",
      order_ids: [21],
      token_ids: "21",
      customer_id: 15,
      customer_name: "Arsalan Tariq",
      net_total: 780,
      tax_total: 133,
      total: 913,
      payment_type: "easypaisa",
      payment_status: "paid",
      created_at: ago(8, 19),
    },
    {
      id: 19,
      invoice_number: "INV-019",
      order_ids: [22],
      token_ids: "22",
      customer_id: 20,
      customer_name: "Aisha Rehman",
      net_total: 490,
      tax_total: 83,
      total: 573,
      payment_type: "cash",
      payment_status: "paid",
      created_at: ago(9, 14),
    },
    {
      id: 20,
      invoice_number: "INV-020",
      order_ids: [23],
      token_ids: "23",
      customer_id: 1,
      customer_name: "Ahmed Raza",
      net_total: 1160,
      tax_total: 197,
      total: 1357,
      payment_type: "card",
      payment_status: "paid",
      created_at: ago(10, 15),
    },
    {
      id: 21,
      invoice_number: "INV-021",
      order_ids: [24],
      token_ids: "24",
      customer_id: 3,
      customer_name: "Usman Ali",
      net_total: 560,
      tax_total: 95,
      total: 655,
      payment_type: "jazzcash",
      payment_status: "paid",
      created_at: ago(11, 13),
    },
    {
      id: 22,
      invoice_number: "INV-022",
      order_ids: [25],
      token_ids: "25",
      customer_id: 17,
      customer_name: "Talha Mahmood",
      net_total: 810,
      tax_total: 138,
      total: 948,
      payment_type: "cash",
      payment_status: "paid",
      created_at: ago(13, 14),
    },
    {
      id: 23,
      invoice_number: "INV-023",
      order_ids: [26],
      token_ids: "26",
      customer_id: 7,
      customer_name: "Bilal Hussain",
      net_total: 370,
      tax_total: 63,
      total: 433,
      payment_type: "easypaisa",
      payment_status: "paid",
      created_at: ago(15, 14),
    },
    {
      id: 24,
      invoice_number: "INV-024",
      order_ids: [27],
      token_ids: "27",
      customer_id: 4,
      customer_name: "Ayesha Siddiqui",
      net_total: 390,
      tax_total: 66,
      total: 456,
      payment_type: "card",
      payment_status: "paid",
      created_at: ago(17, 19),
    },
    {
      id: 25,
      invoice_number: "INV-025",
      order_ids: [28],
      token_ids: "28",
      customer_id: 6,
      customer_name: "Zara Qureshi",
      net_total: 430,
      tax_total: 73,
      total: 503,
      payment_type: "cash",
      payment_status: "paid",
      created_at: ago(19, 14),
    },
    {
      id: 26,
      invoice_number: "INV-026",
      order_ids: [29],
      token_ids: "29",
      customer_id: 9,
      customer_name: "Muneeb Sheikh",
      net_total: 920,
      tax_total: 156,
      total: 1076,
      payment_type: "jazzcash",
      payment_status: "paid",
      created_at: ago(22, 20),
    },
    {
      id: 27,
      invoice_number: "INV-027",
      order_ids: [30],
      token_ids: "30",
      customer_id: 11,
      customer_name: "Imran Butt",
      net_total: 670,
      tax_total: 114,
      total: 784,
      payment_type: "card",
      payment_status: "paid",
      created_at: ago(25, 14),
    },
    {
      id: 28,
      invoice_number: "INV-028",
      order_ids: [31],
      token_ids: "31",
      customer_id: 14,
      customer_name: "Hina Baig",
      net_total: 500,
      tax_total: 85,
      total: 585,
      payment_type: "cash",
      payment_status: "paid",
      created_at: ago(28, 19),
    },
    {
      id: 29,
      invoice_number: "INV-029",
      order_ids: [32],
      token_ids: "32",
      customer_id: 2,
      customer_name: "Fatima Khan",
      net_total: 310,
      tax_total: 53,
      total: 363,
      payment_type: "easypaisa",
      payment_status: "paid",
      created_at: ago(30, 14),
    },
    {
      id: 30,
      invoice_number: "INV-030",
      order_ids: [33],
      token_ids: "33",
      customer_id: 19,
      customer_name: "Danyal Farooq",
      net_total: 850,
      tax_total: 145,
      total: 995,
      payment_type: "card",
      payment_status: "paid",
      created_at: ago(33, 20),
    },
    {
      id: 31,
      invoice_number: "INV-031",
      order_ids: [34],
      token_ids: "34",
      customer_id: 22,
      customer_name: "Hira Bashir",
      net_total: 430,
      tax_total: 73,
      total: 503,
      payment_type: "cash",
      payment_status: "paid",
      created_at: ago(36, 13),
    },
    {
      id: 32,
      invoice_number: "INV-032",
      order_ids: [35],
      token_ids: "35",
      customer_id: 16,
      customer_name: "Sana Waheed",
      net_total: 760,
      tax_total: 129,
      total: 889,
      payment_type: "jazzcash",
      payment_status: "paid",
      created_at: ago(38, 14),
    },
  ];
}

function generateSeedCustomerAccounts() {
  // Passwords are sha256-hashed "password123" placeholder – actual auth uses the
  // stored hash compared inside auth.controller.js
  return [
    {
      id: 1,
      name: "Ahmed Raza",
      email: "ahmed.raza@nu.edu.pk",
      phone: "03001234567",
      password: "password123",
      role: "customer",
      credit_balance: 250,
      loyalty_points: 140,
      created_at: new Date().toISOString(),
    },
    {
      id: 2,
      name: "Fatima Khan",
      email: "fatima.khan@nu.edu.pk",
      phone: "03121234568",
      password: "password123",
      role: "customer",
      credit_balance: 0,
      loyalty_points: 90,
      created_at: new Date().toISOString(),
    },
    {
      id: 3,
      name: "Usman Ali",
      email: "usman.ali@nu.edu.pk",
      phone: "03211234569",
      password: "password123",
      role: "customer",
      credit_balance: 100,
      loyalty_points: 170,
      created_at: new Date().toISOString(),
    },
    {
      id: 4,
      name: "Ayesha Siddiqui",
      email: "ayesha.siddiqui@nu.edu.pk",
      phone: "03331234570",
      password: "password123",
      role: "customer",
      credit_balance: 50,
      loyalty_points: 60,
      created_at: new Date().toISOString(),
    },
    {
      id: 5,
      name: "Hamza Malik",
      email: "hamza.malik@nu.edu.pk",
      phone: "03451234571",
      password: "password123",
      role: "customer",
      credit_balance: 0,
      loyalty_points: 210,
      created_at: new Date().toISOString(),
    },
    {
      id: 6,
      name: "Zara Qureshi",
      email: "zara.qureshi@lums.edu.pk",
      phone: "03551234572",
      password: "password123",
      role: "customer",
      credit_balance: 200,
      loyalty_points: 50,
      created_at: new Date().toISOString(),
    },
    {
      id: 7,
      name: "Bilal Hussain",
      email: "bilal.hussain@lums.edu.pk",
      phone: "03001234573",
      password: "password123",
      role: "customer",
      credit_balance: 0,
      loyalty_points: 110,
      created_at: new Date().toISOString(),
    },
    {
      id: 8,
      name: "Sara Ahmed",
      email: "sara.ahmed@lums.edu.pk",
      phone: "03121234574",
      password: "password123",
      role: "customer",
      credit_balance: 75,
      loyalty_points: 30,
      created_at: new Date().toISOString(),
    },
    {
      id: 9,
      name: "Muneeb Sheikh",
      email: "muneeb.sheikh@comsats.edu.pk",
      phone: "03211234575",
      password: "password123",
      role: "customer",
      credit_balance: 0,
      loyalty_points: 80,
      created_at: new Date().toISOString(),
    },
    {
      id: 10,
      name: "Nadia Aslam",
      email: "nadia.aslam@comsats.edu.pk",
      phone: "03331234576",
      password: "password123",
      role: "customer",
      credit_balance: 150,
      loyalty_points: 160,
      created_at: new Date().toISOString(),
    },
  ];
}

// ── Seed: OCOS cafe orders (placed online by customers) ───────────────────
function generateSeedCafeOrders() {
  function ago(days, hour = 13) {
    const dt = new Date();
    dt.setDate(dt.getDate() - days);
    dt.setHours(hour, 0, 0, 0);
    return dt.toISOString();
  }
  return [
    {
      id: 1,
      order_number: "OCOS-001",
      customer_id: 1,
      customer_name: "Ahmed Raza",
      customer_email: "ahmed.raza@nu.edu.pk",
      customer_phone: "03001234567",
      items: [
        { menu_item_id: 16, title: "Chicken Biryani", qty: 2, price: 380 },
        { menu_item_id: 3, title: "Lassi", qty: 2, price: 130 },
      ],
      delivery_type: "delivery",
      address: "FAST-NU Campus, Lahore",
      subtotal: 1020,
      tax_total: 173,
      total: 1193,
      status: "delivered",
      payment_method: "jazzcash",
      payment_gateway_ref: "",
      payment_status: "paid",
      notes: "More raita please",
      created_at: ago(0, 12),
      updated_at: ago(0, 13),
    },
    {
      id: 2,
      order_number: "OCOS-002",
      customer_id: 2,
      customer_name: "Fatima Khan",
      customer_email: "fatima.khan@nu.edu.pk",
      customer_phone: "03121234568",
      items: [
        { menu_item_id: 11, title: "Chicken Karahi", qty: 1, price: 550 },
        { menu_item_id: 1, title: "Doodh Patti Chai", qty: 2, price: 80 },
      ],
      delivery_type: "delivery",
      address: "FAST-NU Campus, Lahore",
      subtotal: 710,
      tax_total: 121,
      total: 831,
      status: "delivered",
      payment_method: "easypaisa",
      payment_gateway_ref: "",
      payment_status: "paid",
      notes: "No spice",
      created_at: ago(0, 13),
      updated_at: ago(0, 14),
    },
    {
      id: 3,
      order_number: "OCOS-003",
      customer_id: 5,
      customer_name: "Hamza Malik",
      customer_email: "hamza.malik@nu.edu.pk",
      customer_phone: "03451234571",
      items: [
        { menu_item_id: 20, title: "Zinger Burger", qty: 2, price: 430 },
        { menu_item_id: 8, title: "Masala Fries", qty: 1, price: 190 },
        { menu_item_id: 4, title: "Cold Coffee", qty: 2, price: 220 },
      ],
      delivery_type: "delivery",
      address: "FAST-NU Hostel Block A, Lahore",
      subtotal: 1490,
      tax_total: 253,
      total: 1743,
      status: "preparing",
      payment_method: "card",
      payment_gateway_ref: "",
      payment_status: "paid",
      notes: "Extra jalapeños",
      created_at: ago(0, 17),
      updated_at: ago(0, 17),
    },
    {
      id: 4,
      order_number: "OCOS-004",
      customer_id: 3,
      customer_name: "Usman Ali",
      customer_email: "usman.ali@nu.edu.pk",
      customer_phone: "03211234569",
      items: [{ menu_item_id: 14, title: "Daal Chawal", qty: 3, price: 230 }],
      delivery_type: "delivery",
      address: "FAST-NU Campus, Lahore",
      subtotal: 690,
      tax_total: 117,
      total: 807,
      status: "pending",
      payment_method: "jazzcash",
      payment_gateway_ref: "",
      payment_status: "paid",
      notes: "",
      created_at: ago(0, 18),
      updated_at: ago(0, 18),
    },
    {
      id: 5,
      order_number: "OCOS-005",
      customer_id: 6,
      customer_name: "Zara Qureshi",
      customer_email: "zara.qureshi@lums.edu.pk",
      customer_phone: "03551234572",
      items: [
        { menu_item_id: 22, title: "Seekh Kebab Roll", qty: 2, price: 310 },
        { menu_item_id: 6, title: "Fresh Lime Soda", qty: 2, price: 120 },
      ],
      delivery_type: "delivery",
      address: "LUMS Campus, DHA, Lahore",
      subtotal: 860,
      tax_total: 146,
      total: 1006,
      status: "delivered",
      payment_method: "easypaisa",
      payment_gateway_ref: "",
      payment_status: "paid",
      notes: "Medium spice",
      created_at: ago(1, 13),
      updated_at: ago(1, 14),
    },
    {
      id: 6,
      order_number: "OCOS-006",
      customer_id: 7,
      customer_name: "Bilal Hussain",
      customer_email: "bilal.hussain@lums.edu.pk",
      customer_phone: "03001234573",
      items: [
        { menu_item_id: 13, title: "Nihari", qty: 2, price: 480 },
        { menu_item_id: 1, title: "Doodh Patti Chai", qty: 4, price: 80 },
      ],
      delivery_type: "delivery",
      address: "LUMS Campus, DHA, Lahore",
      subtotal: 1280,
      tax_total: 218,
      total: 1498,
      status: "delivered",
      payment_method: "card",
      payment_gateway_ref: "",
      payment_status: "paid",
      notes: "Extra paya",
      created_at: ago(1, 19),
      updated_at: ago(1, 20),
    },
    {
      id: 7,
      order_number: "OCOS-007",
      customer_id: 9,
      customer_name: "Muneeb Sheikh",
      customer_email: "muneeb.sheikh@comsats.edu.pk",
      customer_phone: "03211234575",
      items: [
        { menu_item_id: 17, title: "Beef Pulao", qty: 2, price: 370 },
        { menu_item_id: 10, title: "Papri Chaat", qty: 2, price: 150 },
      ],
      delivery_type: "delivery",
      address: "COMSATS University, Lahore",
      subtotal: 1040,
      tax_total: 177,
      total: 1217,
      status: "delivered",
      payment_method: "jazzcash",
      payment_gateway_ref: "",
      payment_status: "paid",
      notes: "",
      created_at: ago(2, 12),
      updated_at: ago(2, 13),
    },
    {
      id: 8,
      order_number: "OCOS-008",
      customer_id: 4,
      customer_name: "Ayesha Siddiqui",
      customer_email: "ayesha.siddiqui@nu.edu.pk",
      customer_phone: "03331234570",
      items: [
        { menu_item_id: 15, title: "Halwa Puri (2 pcs)", qty: 2, price: 250 },
        { menu_item_id: 2, title: "Kashmiri Chai", qty: 2, price: 150 },
      ],
      delivery_type: "delivery",
      address: "FAST-NU Campus, Lahore",
      subtotal: 800,
      tax_total: 136,
      total: 936,
      status: "delivered",
      payment_method: "cash",
      payment_gateway_ref: "",
      payment_status: "paid",
      notes: "Extra chana",
      created_at: ago(2, 9),
      updated_at: ago(2, 10),
    },
    {
      id: 9,
      order_number: "OCOS-009",
      customer_id: 10,
      customer_name: "Nadia Aslam",
      customer_email: "nadia.aslam@comsats.edu.pk",
      customer_phone: "03331234576",
      items: [
        { menu_item_id: 21, title: "Chicken Roll", qty: 3, price: 260 },
        { menu_item_id: 5, title: "Rooh Afza Sharbat", qty: 3, price: 70 },
      ],
      delivery_type: "delivery",
      address: "COMSATS University, Lahore",
      subtotal: 990,
      tax_total: 168,
      total: 1158,
      status: "delivered",
      payment_method: "easypaisa",
      payment_gateway_ref: "",
      payment_status: "paid",
      notes: "Extra sauce in rolls",
      created_at: ago(3, 14),
      updated_at: ago(3, 15),
    },
    {
      id: 10,
      order_number: "OCOS-010",
      customer_id: 8,
      customer_name: "Sara Ahmed",
      customer_email: "sara.ahmed@lums.edu.pk",
      customer_phone: "03121234574",
      items: [
        { menu_item_id: 24, title: "Gulab Jamun (2 pcs)", qty: 2, price: 100 },
        { menu_item_id: 25, title: "Kheer", qty: 2, price: 120 },
        { menu_item_id: 2, title: "Kashmiri Chai", qty: 2, price: 150 },
      ],
      delivery_type: "delivery",
      address: "LUMS Campus, DHA, Lahore",
      subtotal: 740,
      tax_total: 126,
      total: 866,
      status: "delivered",
      payment_method: "card",
      payment_gateway_ref: "",
      payment_status: "paid",
      notes: "Sweet-tooth order!",
      created_at: ago(3, 15),
      updated_at: ago(3, 16),
    },
    {
      id: 11,
      order_number: "OCOS-011",
      customer_id: 1,
      customer_name: "Ahmed Raza",
      customer_email: "ahmed.raza@nu.edu.pk",
      customer_phone: "03001234567",
      items: [
        { menu_item_id: 12, title: "Beef Karahi", qty: 1, price: 600 },
        { menu_item_id: 18, title: "Kabuli Pulao", qty: 1, price: 390 },
        { menu_item_id: 3, title: "Lassi", qty: 2, price: 130 },
      ],
      delivery_type: "delivery",
      address: "FAST-NU Gate, Lahore",
      subtotal: 1250,
      tax_total: 213,
      total: 1463,
      status: "delivered",
      payment_method: "jazzcash",
      payment_gateway_ref: "",
      payment_status: "paid",
      notes: "FAST-NU gate delivery",
      created_at: ago(5, 12),
      updated_at: ago(5, 13),
    },
    {
      id: 12,
      order_number: "OCOS-012",
      customer_id: 2,
      customer_name: "Fatima Khan",
      customer_email: "fatima.khan@nu.edu.pk",
      customer_phone: "03121234568",
      items: [
        { menu_item_id: 27, title: "Aloo Paratha", qty: 2, price: 180 },
        { menu_item_id: 1, title: "Doodh Patti Chai", qty: 2, price: 80 },
      ],
      delivery_type: "delivery",
      address: "FAST-NU Campus, Lahore",
      subtotal: 520,
      tax_total: 88,
      total: 608,
      status: "delivered",
      payment_method: "cash",
      payment_gateway_ref: "",
      payment_status: "paid",
      notes: "Extra butter",
      created_at: ago(6, 9),
      updated_at: ago(6, 10),
    },
    {
      id: 13,
      order_number: "OCOS-013",
      customer_id: 5,
      customer_name: "Hamza Malik",
      customer_email: "hamza.malik@nu.edu.pk",
      customer_phone: "03451234571",
      items: [
        { menu_item_id: 9, title: "Aloo Tikki (3 pcs)", qty: 2, price: 120 },
        { menu_item_id: 7, title: "Samosa (2 pcs)", qty: 4, price: 60 },
        { menu_item_id: 6, title: "Fresh Lime Soda", qty: 3, price: 120 },
      ],
      delivery_type: "delivery",
      address: "FAST-NU Hostel Block A, Lahore",
      subtotal: 840,
      tax_total: 143,
      total: 983,
      status: "delivered",
      payment_method: "easypaisa",
      payment_gateway_ref: "",
      payment_status: "paid",
      notes: "Snack box for hostel",
      created_at: ago(7, 16),
      updated_at: ago(7, 17),
    },
    {
      id: 14,
      order_number: "OCOS-014",
      customer_id: 3,
      customer_name: "Usman Ali",
      customer_email: "usman.ali@nu.edu.pk",
      customer_phone: "03211234569",
      items: [
        { menu_item_id: 16, title: "Chicken Biryani", qty: 4, price: 380 },
        { menu_item_id: 26, title: "Gajar Halwa", qty: 2, price: 140 },
      ],
      delivery_type: "delivery",
      address: "FAST-NU CS Department, Lahore",
      subtotal: 1800,
      tax_total: 306,
      total: 2106,
      status: "delivered",
      payment_method: "card",
      payment_gateway_ref: "",
      payment_status: "paid",
      notes: "CS dept group order – FAST-NU",
      created_at: ago(9, 13),
      updated_at: ago(9, 14),
    },
    {
      id: 15,
      order_number: "OCOS-015",
      customer_id: 6,
      customer_name: "Zara Qureshi",
      customer_email: "zara.qureshi@lums.edu.pk",
      customer_phone: "03551234572",
      items: [
        { menu_item_id: 23, title: "Club Sandwich", qty: 2, price: 340 },
        { menu_item_id: 8, title: "Masala Fries", qty: 2, price: 190 },
        { menu_item_id: 4, title: "Cold Coffee", qty: 2, price: 220 },
      ],
      delivery_type: "delivery",
      address: "LUMS Library, DHA, Lahore",
      subtotal: 1500,
      tax_total: 255,
      total: 1755,
      status: "delivered",
      payment_method: "jazzcash",
      payment_gateway_ref: "",
      payment_status: "paid",
      notes: "LUMS library study session order",
      created_at: ago(11, 14),
      updated_at: ago(11, 15),
    },
    {
      id: 16,
      order_number: "OCOS-016",
      customer_id: 9,
      customer_name: "Muneeb Sheikh",
      customer_email: "muneeb.sheikh@comsats.edu.pk",
      customer_phone: "03211234575",
      items: [
        { menu_item_id: 11, title: "Chicken Karahi", qty: 2, price: 1050 },
      ],
      delivery_type: "delivery",
      address: "COMSATS University, Lahore",
      subtotal: 2100,
      tax_total: 357,
      total: 2457,
      status: "cancelled",
      payment_method: "card",
      payment_gateway_ref: "",
      payment_status: "refunded",
      notes: "Full karahi ×2 – cancelled by customer",
      created_at: ago(12, 19),
      updated_at: ago(12, 20),
    },
    {
      id: 17,
      order_number: "OCOS-017",
      customer_id: 10,
      customer_name: "Nadia Aslam",
      customer_email: "nadia.aslam@comsats.edu.pk",
      customer_phone: "03331234576",
      items: [
        { menu_item_id: 19, title: "Aloo Tikki Burger", qty: 3, price: 290 },
        { menu_item_id: 5, title: "Rooh Afza Sharbat", qty: 4, price: 70 },
      ],
      delivery_type: "delivery",
      address: "COMSATS Girls Hostel Wing C, Lahore",
      subtotal: 1150,
      tax_total: 196,
      total: 1346,
      status: "delivered",
      payment_method: "easypaisa",
      payment_gateway_ref: "",
      payment_status: "paid",
      notes: "Girls hostel wing C",
      created_at: ago(14, 13),
      updated_at: ago(14, 14),
    },
    {
      id: 18,
      order_number: "OCOS-018",
      customer_id: 7,
      customer_name: "Bilal Hussain",
      customer_email: "bilal.hussain@lums.edu.pk",
      customer_phone: "03001234573",
      items: [
        { menu_item_id: 13, title: "Nihari", qty: 3, price: 480 },
        { menu_item_id: 15, title: "Halwa Puri (2 pcs)", qty: 2, price: 250 },
      ],
      delivery_type: "delivery",
      address: "LUMS Campus, DHA, Lahore",
      subtotal: 1940,
      tax_total: 330,
      total: 2270,
      status: "delivered",
      payment_method: "jazzcash",
      payment_gateway_ref: "",
      payment_status: "paid",
      notes: "Morning delivery before 9 AM",
      created_at: ago(16, 8),
      updated_at: ago(16, 9),
    },
    {
      id: 19,
      order_number: "OCOS-019",
      customer_id: 4,
      customer_name: "Ayesha Siddiqui",
      customer_email: "ayesha.siddiqui@nu.edu.pk",
      customer_phone: "03331234570",
      items: [
        { menu_item_id: 25, title: "Kheer", qty: 3, price: 120 },
        { menu_item_id: 24, title: "Gulab Jamun (2 pcs)", qty: 3, price: 100 },
      ],
      delivery_type: "delivery",
      address: "FAST-NU Campus, Lahore",
      subtotal: 660,
      tax_total: 112,
      total: 772,
      status: "delivered",
      payment_method: "cash",
      payment_gateway_ref: "",
      payment_status: "paid",
      notes: "Mithai for housemates",
      created_at: ago(18, 16),
      updated_at: ago(18, 17),
    },
    {
      id: 20,
      order_number: "OCOS-020",
      customer_id: 8,
      customer_name: "Sara Ahmed",
      customer_email: "sara.ahmed@lums.edu.pk",
      customer_phone: "03121234574",
      items: [
        { menu_item_id: 22, title: "Seekh Kebab Roll", qty: 1, price: 310 },
        { menu_item_id: 21, title: "Chicken Roll", qty: 1, price: 260 },
        { menu_item_id: 4, title: "Cold Coffee", qty: 1, price: 220 },
      ],
      delivery_type: "delivery",
      address: "LUMS Campus, DHA, Lahore",
      subtotal: 790,
      tax_total: 134,
      total: 924,
      status: "delivered",
      payment_method: "card",
      payment_gateway_ref: "",
      payment_status: "paid",
      notes: "Late night study session order",
      created_at: ago(20, 22),
      updated_at: ago(20, 23),
    },
  ];
}


export function initDB() {
  // Version bump: increment SEED_VERSION to force-reset all data when schema changes
  const SEED_VERSION = "3";
  const storedVersion = localStorage.getItem("ordersync_seed_version");

  if (!localStorage.getItem(DB_KEY) || storedVersion !== SEED_VERSION) {
    // First run or seed version changed – write fresh data
    const db = { ...SEED };
    db.reservations = generateSeedReservations();
    db.orders = generateSeedOrders();
    db.invoices = generateSeedInvoices();
    db.customer_accounts = generateSeedCustomerAccounts();
    db.cafe_orders = generateSeedCafeOrders();
    db.order_items = db.orders.flatMap((o) => o.order_items || []);
    saveDB(db);
    localStorage.setItem("ordersync_seed_version", SEED_VERSION);
  } else {
    // Back-fill only truly missing collections (never overwrite existing data)
    const db = getDB();
    let changed = false;
    const defaults = [
      "users",
      "categories",
      "taxes",
      "payment_types",
      "store_tables",
      "menu_items",
      "customers",
      "orders",
      "order_items",
      "invoices",
      "payments",
      "reservations",
      "devices",
      "customer_accounts",
      "cafe_orders",
    ];
    defaults.forEach((k) => {
      if (db[k] === undefined) {
        db[k] = SEED[k];
        changed = true;
      }
    });
    if (!db.store_setting) {
      db.store_setting = SEED.store_setting;
      changed = true;
    }
    if (!db.print_setting) {
      db.print_setting = SEED.print_setting;
      changed = true;
    }
    if (!db.token_counter) {
      db.token_counter = SEED.token_counter;
      changed = true;
    }
    if (changed) saveDB(db);
  }
}

// ── Helpers ───────────────────────────────────────────────
function nextToken() {
  const db = getDB();
  db.token_counter = db.token_counter || { value: 0 };
  db.token_counter.value += 1;
  const val = db.token_counter.value;
  saveDB(db);
  return val;
}

function ok(data) {
  return Promise.resolve({ status: 200, data });
}

function filterByDateRange(items, dateField, type, from, to) {
  const now = new Date();
  const startOfDay = (d) =>
    new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const endOfDay = (d) =>
    new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);

  let start, end;

  switch (type) {
    case "today":
      start = startOfDay(now);
      end = endOfDay(now);
      break;
    case "yesterday": {
      const y = new Date(now);
      y.setDate(y.getDate() - 1);
      start = startOfDay(y);
      end = endOfDay(y);
      break;
    }
    case "tomorrow": {
      const t = new Date(now);
      t.setDate(t.getDate() + 1);
      start = startOfDay(t);
      end = endOfDay(t);
      break;
    }
    case "last_7days": {
      const s = new Date(now);
      s.setDate(s.getDate() - 7);
      start = startOfDay(s);
      end = endOfDay(now);
      break;
    }
    case "this_month":
      start = new Date(now.getFullYear(), now.getMonth(), 1);
      end = endOfDay(now);
      break;
    case "last_month": {
      const lm = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      start = lm;
      end = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);
      break;
    }
    case "custom":
      start = from ? new Date(from) : new Date(0);
      end = to ? endOfDay(new Date(to)) : endOfDay(now);
      break;
    default:
      return items;
  }

  return items.filter((item) => {
    const d = new Date(item[dateField]);
    return d >= start && d <= end;
  });
}

// ── USERS ─────────────────────────────────────────────────
export const Users = {
  getAll() {
    return col("users").map(({ password, ...u }) => u);
  },
  findByUsername(username) {
    return col("users").find(
      (u) =>
        u.username.toLowerCase() === username.toLowerCase() ||
        u.email.toLowerCase() === username.toLowerCase(),
    );
  },
  add(username, password, name, designation, phone, email, userScopes) {
    const db = getDB();
    db.users = db.users || [];
    if (db.users.find((u) => u.username === username)) {
      throw new Error("Username already exists");
    }
    const user = {
      id: nextId("users"),
      username,
      password,
      name,
      designation,
      phone,
      email,
      role: "staff",
      scope: userScopes || "",
      tenant_id: "local_tenant_001",
      created_at: new Date().toISOString(),
    };
    db.users.push(user);
    saveDB(db);
    const { password: _p, ...safe } = user;
    return safe;
  },
  delete(username) {
    const db = getDB();
    db.users = (db.users || []).filter(
      (u) => u.username !== username && String(u.id) !== String(username),
    );
    saveDB(db);
  },
  updatePassword(username, password) {
    const db = getDB();
    const idx = (db.users || []).findIndex((u) => u.username === username);
    if (idx !== -1) {
      db.users[idx].password = password;
      saveDB(db);
    }
  },
  update(username, name, designation, phone, email, userScopes) {
    const db = getDB();
    const idx = (db.users || []).findIndex((u) => u.username === username);
    if (idx !== -1) {
      db.users[idx] = {
        ...db.users[idx],
        name,
        designation,
        phone,
        email,
        scope: userScopes || "",
      };
      saveDB(db);
      const { password: _p, ...safe } = db.users[idx];
      return safe;
    }
    return null;
  },
};

// ── CUSTOMERS ─────────────────────────────────────────────
export const Customers = {
  getAll({ page = 1, perPage = 10, filter = "" } = {}) {
    let items = col("customers");
    if (filter) {
      const q = filter.toLowerCase();
      items = items.filter(
        (c) =>
          (c.name || "").toLowerCase().includes(q) ||
          (c.phone || "").toLowerCase().includes(q),
      );
    }
    const total = items.length;
    const start = (page - 1) * perPage;
    return {
      customers: items.slice(start, start + perPage),
      total,
      page,
      perPage,
    };
  },
  search(query) {
    if (!query) return [];
    const q = query.toLowerCase();
    return col("customers").filter(
      (c) =>
        (c.name || "").toLowerCase().includes(q) ||
        (c.phone || "").toLowerCase().includes(q),
    );
  },
  add(phone, name, email, birthDate, gender) {
    const db = getDB();
    db.customers = db.customers || [];
    const customer = {
      id: nextId("customers"),
      phone,
      name,
      email,
      birth_date: birthDate || null,
      gender: gender || null,
      visit_count: 0,
      created_at: new Date().toISOString(),
    };
    db.customers.push(customer);
    saveDB(db);
    return customer;
  },
  update(phone, name, email, birthDate, gender) {
    const db = getDB();
    const idx = (db.customers || []).findIndex((c) => c.phone === phone);
    if (idx !== -1) {
      db.customers[idx] = {
        ...db.customers[idx],
        name,
        email,
        birth_date: birthDate,
        gender,
      };
      saveDB(db);
      return db.customers[idx];
    }
    return null;
  },
  delete(id) {
    const db = getDB();
    db.customers = (db.customers || []).filter(
      (c) => String(c.id) !== String(id),
    );
    saveDB(db);
  },
};

// ── MENU ITEMS ────────────────────────────────────────────
export const MenuItems = {
  getAll() {
    const categories = col("categories");
    const taxes = col("taxes");
    return col("menu_items").map((item) => {
      const cat = categories.find((c) => c.id === item.category_id);
      const tax = taxes.find((t) => t.id === item.tax_id);
      return {
        ...item,
        category_title: cat?.title || "",
        tax_title: tax?.title || "",
        tax_rate: tax?.rate || 0,
        tax_type: tax?.type || "percentage",
      };
    });
  },
  getById(id) {
    const items = col("menu_items");
    const item = items.find((i) => String(i.id) === String(id));
    if (!item) return null;
    const categories = col("categories");
    const taxes = col("taxes");
    const cat = categories.find((c) => c.id === item.category_id);
    const tax = taxes.find((t) => t.id === item.tax_id);
    return {
      ...item,
      category_title: cat?.title || "",
      tax_title: tax?.title || "",
      tax_rate: tax?.rate || 0,
      tax_type: tax?.type || "percentage",
    };
  },
  add(title, price, netPrice, categoryId, taxId, imageFile) {
    const db = getDB();
    db.menu_items = db.menu_items || [];
    const categories = db.categories || [];
    const taxes = db.taxes || [];
    const cat = categories.find((c) => String(c.id) === String(categoryId));
    const tax = taxes.find((t) => String(t.id) === String(taxId));
    const item = {
      id: nextId("menu_items"),
      title,
      price: parseFloat(price) || 0,
      net_price: parseFloat(netPrice) || null,
      category_id: categoryId ? parseInt(categoryId) : null,
      category_title: cat?.title || "",
      tax_id: taxId ? parseInt(taxId) : null,
      tax_title: tax?.title || "",
      tax_rate: tax?.rate || 0,
      tax_type: tax?.type || "percentage",
      image: null,
      variants: [],
      addons: [],
      is_active: 1,
      created_at: new Date().toISOString(),
    };
    db.menu_items.push(item);
    saveDB(db);
    return item;
  },
  update(id, title, price, netPrice, categoryId, taxId) {
    const db = getDB();
    const idx = (db.menu_items || []).findIndex(
      (i) => String(i.id) === String(id),
    );
    if (idx !== -1) {
      const categories = db.categories || [];
      const taxes = db.taxes || [];
      const cat = categories.find((c) => String(c.id) === String(categoryId));
      const tax = taxes.find((t) => String(t.id) === String(taxId));
      db.menu_items[idx] = {
        ...db.menu_items[idx],
        title,
        price: parseFloat(price) || 0,
        net_price: parseFloat(netPrice) || null,
        category_id: categoryId ? parseInt(categoryId) : null,
        category_title: cat?.title || "",
        tax_id: taxId ? parseInt(taxId) : null,
        tax_title: tax?.title || "",
        tax_rate: tax?.rate || 0,
        tax_type: tax?.type || "percentage",
      };
      saveDB(db);
      return db.menu_items[idx];
    }
    return null;
  },
  delete(id) {
    const db = getDB();
    db.menu_items = (db.menu_items || []).filter(
      (i) => String(i.id) !== String(id),
    );
    saveDB(db);
  },
  // --- Variants ---
  addVariant(itemId, title, price) {
    const db = getDB();
    const idx = (db.menu_items || []).findIndex(
      (i) => String(i.id) === String(itemId),
    );
    if (idx === -1) throw new Error("Item not found");
    db.menu_items[idx].variants = db.menu_items[idx].variants || [];
    const maxId = db.menu_items[idx].variants.reduce(
      (m, v) => Math.max(m, v.id || 0),
      0,
    );
    const variant = { id: maxId + 1, title, price: parseFloat(price) || 0 };
    db.menu_items[idx].variants.push(variant);
    saveDB(db);
    return db.menu_items[idx];
  },
  updateVariant(itemId, variantId, title, price) {
    const db = getDB();
    const idx = (db.menu_items || []).findIndex(
      (i) => String(i.id) === String(itemId),
    );
    if (idx === -1) throw new Error("Item not found");
    const vIdx = (db.menu_items[idx].variants || []).findIndex(
      (v) => String(v.id) === String(variantId),
    );
    if (vIdx !== -1) {
      db.menu_items[idx].variants[vIdx] = {
        ...db.menu_items[idx].variants[vIdx],
        title,
        price: parseFloat(price) || 0,
      };
    }
    saveDB(db);
    return db.menu_items[idx];
  },
  deleteVariant(itemId, variantId) {
    const db = getDB();
    const idx = (db.menu_items || []).findIndex(
      (i) => String(i.id) === String(itemId),
    );
    if (idx !== -1) {
      db.menu_items[idx].variants = (db.menu_items[idx].variants || []).filter(
        (v) => String(v.id) !== String(variantId),
      );
      saveDB(db);
    }
  },
  // --- Addons ---
  addAddon(itemId, title, price) {
    const db = getDB();
    const idx = (db.menu_items || []).findIndex(
      (i) => String(i.id) === String(itemId),
    );
    if (idx === -1) throw new Error("Item not found");
    db.menu_items[idx].addons = db.menu_items[idx].addons || [];
    const maxId = db.menu_items[idx].addons.reduce(
      (m, a) => Math.max(m, a.id || 0),
      0,
    );
    const addon = { id: maxId + 1, title, price: parseFloat(price) || 0 };
    db.menu_items[idx].addons.push(addon);
    saveDB(db);
    return db.menu_items[idx];
  },
  updateAddon(itemId, addonId, title, price) {
    const db = getDB();
    const idx = (db.menu_items || []).findIndex(
      (i) => String(i.id) === String(itemId),
    );
    if (idx === -1) throw new Error("Item not found");
    const aIdx = (db.menu_items[idx].addons || []).findIndex(
      (a) => String(a.id) === String(addonId),
    );
    if (aIdx !== -1) {
      db.menu_items[idx].addons[aIdx] = {
        ...db.menu_items[idx].addons[aIdx],
        title,
        price: parseFloat(price) || 0,
      };
    }
    saveDB(db);
    return db.menu_items[idx];
  },
  deleteAddon(itemId, addonId) {
    const db = getDB();
    const idx = (db.menu_items || []).findIndex(
      (i) => String(i.id) === String(itemId),
    );
    if (idx !== -1) {
      db.menu_items[idx].addons = (db.menu_items[idx].addons || []).filter(
        (a) => String(a.id) !== String(addonId),
      );
      saveDB(db);
    }
  },
};

// ── SETTINGS ──────────────────────────────────────────────
export const Settings = {
  getStoreSetting() {
    return getDB().store_setting || SEED.store_setting;
  },
  saveStoreSetting(data) {
    const db = getDB();
    db.store_setting = { ...db.store_setting, ...data };
    saveDB(db);
    return db.store_setting;
  },

  getPrintSetting() {
    return getDB().print_setting || SEED.print_setting;
  },
  savePrintSetting(data) {
    const db = getDB();
    db.print_setting = { ...db.print_setting, ...data };
    saveDB(db);
    return db.print_setting;
  },

  getPaymentTypes() {
    return col("payment_types");
  },
  addPaymentType(title, isActive) {
    const db = getDB();
    db.payment_types = db.payment_types || [];
    const pt = {
      id: nextId("payment_types"),
      title,
      is_active: isActive ? 1 : 0,
      created_at: new Date().toISOString(),
    };
    db.payment_types.push(pt);
    saveDB(db);
    return pt;
  },
  deletePaymentType(id) {
    const db = getDB();
    db.payment_types = (db.payment_types || []).filter(
      (p) => String(p.id) !== String(id),
    );
    saveDB(db);
  },
  togglePaymentType(id, isActive) {
    const db = getDB();
    const idx = (db.payment_types || []).findIndex(
      (p) => String(p.id) === String(id),
    );
    if (idx !== -1) {
      db.payment_types[idx].is_active = isActive ? 1 : 0;
      saveDB(db);
      return db.payment_types[idx];
    }
    return null;
  },
  updatePaymentType(id, title, isActive) {
    const db = getDB();
    const idx = (db.payment_types || []).findIndex(
      (p) => String(p.id) === String(id),
    );
    if (idx !== -1) {
      db.payment_types[idx] = {
        ...db.payment_types[idx],
        title,
        is_active: isActive ? 1 : 0,
      };
      saveDB(db);
      return db.payment_types[idx];
    }
    return null;
  },

  getTaxes() {
    return col("taxes");
  },
  addTax(title, rate, type) {
    const db = getDB();
    db.taxes = db.taxes || [];
    const tax = {
      id: nextId("taxes"),
      title,
      rate: parseFloat(rate) || 0,
      type,
      created_at: new Date().toISOString(),
    };
    db.taxes.push(tax);
    saveDB(db);
    return tax;
  },
  deleteTax(id) {
    const db = getDB();
    db.taxes = (db.taxes || []).filter((t) => String(t.id) !== String(id));
    saveDB(db);
  },
  updateTax(id, title, rate, type) {
    const db = getDB();
    const idx = (db.taxes || []).findIndex((t) => String(t.id) === String(id));
    if (idx !== -1) {
      db.taxes[idx] = {
        ...db.taxes[idx],
        title,
        rate: parseFloat(rate) || 0,
        type,
      };
      saveDB(db);
      return db.taxes[idx];
    }
    return null;
  },

  getStoreTables() {
    return col("store_tables");
  },
  addStoreTable(title, floor, seatingCapacity) {
    const db = getDB();
    db.store_tables = db.store_tables || [];
    const t = {
      id: nextId("store_tables"),
      title,
      floor,
      seating_capacity: seatingCapacity,
      created_at: new Date().toISOString(),
    };
    db.store_tables.push(t);
    saveDB(db);
    return t;
  },
  deleteStoreTable(id) {
    const db = getDB();
    db.store_tables = (db.store_tables || []).filter(
      (t) => String(t.id) !== String(id),
    );
    saveDB(db);
  },
  updateStoreTable(id, title, floor, seatingCapacity) {
    const db = getDB();
    const idx = (db.store_tables || []).findIndex(
      (t) => String(t.id) === String(id),
    );
    if (idx !== -1) {
      db.store_tables[idx] = {
        ...db.store_tables[idx],
        title,
        floor,
        seating_capacity: seatingCapacity,
      };
      saveDB(db);
      return db.store_tables[idx];
    }
    return null;
  },

  getCategories() {
    return col("categories");
  },
  addCategory(title) {
    const db = getDB();
    db.categories = db.categories || [];
    const cat = {
      id: nextId("categories"),
      title,
      created_at: new Date().toISOString(),
    };
    db.categories.push(cat);
    saveDB(db);
    return cat;
  },
  deleteCategory(id) {
    const db = getDB();
    db.categories = (db.categories || []).filter(
      (c) => String(c.id) !== String(id),
    );
    saveDB(db);
  },
  updateCategory(id, title) {
    const db = getDB();
    const idx = (db.categories || []).findIndex(
      (c) => String(c.id) === String(id),
    );
    if (idx !== -1) {
      db.categories[idx] = { ...db.categories[idx], title };
      saveDB(db);
      return db.categories[idx];
    }
    return null;
  },

  getDevices() {
    return col("devices");
  },
  removeDevice(deviceId) {
    const db = getDB();
    db.devices = (db.devices || []).filter(
      (d) => String(d.id) !== String(deviceId),
    );
    saveDB(db);
  },
};

// ── POS / ORDERS ──────────────────────────────────────────
export const Orders = {
  getPOSInit() {
    const db = getDB();
    return {
      categories: db.categories || [],
      menuItems: MenuItems.getAll(),
      paymentTypes: Settings.getPaymentTypes().filter((p) => p.is_active),
      printSettings: Settings.getPrintSetting(),
      storeSettings: Settings.getStoreSetting(),
      storeTables: Settings.getStoreTables(),
    };
  },

  createOrder(
    cart,
    deliveryType,
    customerType,
    customerId,
    tableId,
    selectedQrOrderItem,
  ) {
    const db = getDB();
    db.orders = db.orders || [];
    db.order_items = db.order_items || [];

    const tokenNo = nextToken();
    const tables = db.store_tables || [];
    const table = tables.find((t) => String(t.id) === String(tableId));
    const customers = db.customers || [];
    const customer = customers.find((c) => String(c.id) === String(customerId));

    const orderId = nextId("orders");
    let netTotal = 0;
    let taxTotal = 0;

    const orderItems = (cart || []).map((item) => {
      const itemPrice = item.variant ? item.variant.price : item.price;
      const lineNet = itemPrice * item.quantity;
      const taxAmount =
        item.tax_type === "percentage"
          ? lineNet * (item.tax_rate / 100)
          : (item.tax_rate || 0) * item.quantity;
      netTotal += lineNet;
      taxTotal += taxAmount;

      const oiId =
        (db.order_items.length === 0
          ? 1
          : Math.max(...db.order_items.map((oi) => oi.id || 0)) + 1) +
        db.order_items.reduce((acc) => acc, 0);

      return {
        id: Date.now() + Math.random(),
        order_id: orderId,
        menu_item_id: item.id,
        title: item.title,
        price: itemPrice,
        quantity: item.quantity,
        notes: item.notes || "",
        tax_rate: item.tax_rate || 0,
        tax_type: item.tax_type || "percentage",
        tax_title: item.tax_title || "",
        variant: item.variant || null,
        addons: item.addons || [],
        addons_ids: item.addons_ids || [],
        status: "pending",
      };
    });

    const order = {
      id: orderId,
      token_no: tokenNo,
      delivery_type: deliveryType,
      customer_type: customerType,
      customer_id: customerId || null,
      customer_name: customer?.name || null,
      table_id: tableId || null,
      table_title: table?.title || null,
      status: "pending",
      payment_status: "unpaid",
      net_total: parseFloat(netTotal.toFixed(2)),
      tax_total: parseFloat(taxTotal.toFixed(2)),
      total: parseFloat((netTotal + taxTotal).toFixed(2)),
      order_items: orderItems,
      is_qr_order: selectedQrOrderItem ? 1 : 0,
      created_at: new Date().toISOString(),
    };

    db.orders.push(order);
    // also increment customer visit count
    if (customerId) {
      const cIdx = (db.customers || []).findIndex(
        (c) => String(c.id) === String(customerId),
      );
      if (cIdx !== -1) {
        db.customers[cIdx].visit_count =
          (db.customers[cIdx].visit_count || 0) + 1;
      }
    }
    saveDB(db);

    window.dispatchEvent(new Event("orders_updated"));
    return { orderId, tokenNo };
  },

  createOrderAndInvoice(
    cart,
    deliveryType,
    customerType,
    customerId,
    tableId,
    netTotal,
    taxTotal,
    total,
    selectedQrOrderItem,
  ) {
    const { orderId, tokenNo } = Orders.createOrder(
      cart,
      deliveryType,
      customerType,
      customerId,
      tableId,
      selectedQrOrderItem,
    );

    // Update order as paid
    const db = getDB();
    const oIdx = (db.orders || []).findIndex((o) => o.id === orderId);
    if (oIdx !== -1) {
      db.orders[oIdx].status = "completed";
      db.orders[oIdx].payment_status = "paid";
      db.orders[oIdx].net_total =
        parseFloat(netTotal) || db.orders[oIdx].net_total;
      db.orders[oIdx].tax_total =
        parseFloat(taxTotal) || db.orders[oIdx].tax_total;
      db.orders[oIdx].total = parseFloat(total) || db.orders[oIdx].total;
    }

    // Create invoice
    const customers = db.customers || [];
    const customer = customers.find((c) => String(c.id) === String(customerId));
    const invoiceId = nextId("invoices");
    const invoice = {
      id: invoiceId,
      order_ids: [orderId],
      token_ids: String(tokenNo),
      token_no: tokenNo,
      customer_id: customerId || null,
      customer_name: customer?.name || null,
      net_total: parseFloat(netTotal) || 0,
      tax_total: parseFloat(taxTotal) || 0,
      total: parseFloat(total) || 0,
      payment_status: "paid",
      created_at: new Date().toISOString(),
    };
    db.invoices = db.invoices || [];
    db.invoices.push(invoice);
    saveDB(db);

    window.dispatchEvent(new Event("orders_updated"));
    return { orderId, tokenNo, invoiceId };
  },

  getKitchenOrders() {
    const orders = col("orders");
    return orders
      .filter((o) => o.status === "pending" || o.status === "preparing")
      .sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
  },

  getOrdersInit() {
    return {
      printSettings: Settings.getPrintSetting(),
      storeSettings: Settings.getStoreSetting(),
      paymentTypes: Settings.getPaymentTypes(),
    };
  },

  updateOrderItemStatus(orderItemId, status) {
    const db = getDB();
    for (const order of db.orders || []) {
      const oi = (order.order_items || []).find(
        (i) => String(i.id) === String(orderItemId),
      );
      if (oi) {
        oi.status = status;
        // if all items are completed/cancelled, complete the order
        const allDone = order.order_items.every(
          (i) => i.status === "completed" || i.status === "cancelled",
        );
        if (allDone) order.status = "completed";
        break;
      }
    }
    saveDB(db);
    window.dispatchEvent(new Event("orders_updated"));
    return { success: true };
  },

  cancelOrders(orderIds) {
    const db = getDB();
    (db.orders || []).forEach((o) => {
      if (
        orderIds.includes(o.id) ||
        orderIds.map(String).includes(String(o.id))
      ) {
        o.status = "cancelled";
        (o.order_items || []).forEach((i) => {
          i.status = "cancelled";
        });
      }
    });
    saveDB(db);
    window.dispatchEvent(new Event("orders_updated"));
    return { success: true };
  },

  completeOrders(orderIds) {
    const db = getDB();
    (db.orders || []).forEach((o) => {
      if (
        orderIds.includes(o.id) ||
        orderIds.map(String).includes(String(o.id))
      ) {
        o.status = "completed";
        (o.order_items || []).forEach((i) => {
          i.status = "completed";
        });
      }
    });
    saveDB(db);
    window.dispatchEvent(new Event("orders_updated"));
    return { success: true };
  },

  getCompleteOrderPaymentSummary(orderIds) {
    const orders = col("orders").filter(
      (o) =>
        orderIds.includes(o.id) || orderIds.map(String).includes(String(o.id)),
    );
    const netTotal = orders.reduce((s, o) => s + (o.net_total || 0), 0);
    const taxTotal = orders.reduce((s, o) => s + (o.tax_total || 0), 0);
    const total = orders.reduce((s, o) => s + (o.total || 0), 0);
    return { netTotal, taxTotal, total, orders };
  },

  payAndCompleteOrders(orderIds, subTotal, taxTotal, total) {
    const db = getDB();
    (db.orders || []).forEach((o) => {
      if (
        orderIds.includes(o.id) ||
        orderIds.map(String).includes(String(o.id))
      ) {
        o.status = "completed";
        o.payment_status = "paid";
        (o.order_items || []).forEach((i) => {
          i.status = "completed";
        });
      }
    });

    // Create invoice
    const invoiceId = nextId("invoices");
    const tokenIds = (db.orders || [])
      .filter(
        (o) =>
          orderIds.includes(o.id) ||
          orderIds.map(String).includes(String(o.id)),
      )
      .map((o) => o.token_no)
      .join(",");
    const invoice = {
      id: invoiceId,
      order_ids: orderIds,
      token_ids: tokenIds,
      net_total: parseFloat(subTotal) || 0,
      tax_total: parseFloat(taxTotal) || 0,
      total: parseFloat(total) || 0,
      payment_status: "paid",
      created_at: new Date().toISOString(),
    };
    db.invoices = db.invoices || [];
    db.invoices.push(invoice);
    saveDB(db);
    window.dispatchEvent(new Event("orders_updated"));
    return { success: true, invoiceId };
  },

  // QR orders (simplified - treated as regular orders with is_qr_order=1)
  getQROrdersCount() {
    const pendingQR = col("orders").filter(
      (o) => o.is_qr_order === 1 && o.status === "pending",
    );
    return { totalQROrders: pendingQR.length };
  },
  getQROrders() {
    return col("orders").filter(
      (o) => o.is_qr_order === 1 && o.status === "pending",
    );
  },
  cancelAllQROrders() {
    const db = getDB();
    (db.orders || []).forEach((o) => {
      if (o.is_qr_order === 1 && o.status === "pending") {
        o.status = "cancelled";
      }
    });
    saveDB(db);
    window.dispatchEvent(new Event("orders_updated"));
    return { success: true };
  },
  cancelQROrder(orderId, status) {
    const db = getDB();
    const idx = (db.orders || []).findIndex(
      (o) => String(o.id) === String(orderId),
    );
    if (idx !== -1) {
      db.orders[idx].status = status || "cancelled";
    }
    saveDB(db);
    window.dispatchEvent(new Event("orders_updated"));
    return { success: true };
  },
};

// ── RESERVATIONS ──────────────────────────────────────────
export const Reservations = {
  getInit() {
    return { storeTables: Settings.getStoreTables() };
  },
  getAll({ type, from = null, to = null } = {}) {
    let items = col("reservations");
    const tables = col("store_tables");
    items = items.map((r) => {
      const table = tables.find((t) => String(t.id) === String(r.table_id));
      return { ...r, table_title: table?.title || "" };
    });
    if (type) {
      items = filterByDateRange(items, "date", type, from, to);
    }
    return items.sort((a, b) => new Date(a.date) - new Date(b.date));
  },
  search(query) {
    const q = (query || "").toLowerCase();
    const tables = col("store_tables");
    return col("reservations")
      .filter(
        (r) =>
          (r.customer_name || "").toLowerCase().includes(q) ||
          (r.notes || "").toLowerCase().includes(q) ||
          (r.unique_code || "").toLowerCase().includes(q),
      )
      .map((r) => {
        const table = tables.find((t) => String(t.id) === String(r.table_id));
        return { ...r, table_title: table?.title || "" };
      });
  },
  add(customerId, date, tableId, status, notes, peopleCount) {
    const db = getDB();
    db.reservations = db.reservations || [];
    const customers = db.customers || [];
    const customer = customers.find((c) => String(c.id) === String(customerId));
    const tables = db.store_tables || [];
    const table = tables.find((t) => String(t.id) === String(tableId));
    const uniqueCode = "RES" + String(nextId("reservations")).padStart(4, "0");
    const reservation = {
      id: nextId("reservations"),
      customer_id: customerId || null,
      customer_name: customer?.name || null,
      date: date,
      table_id: tableId || null,
      table_title: table?.title || null,
      status: status || "pending",
      notes: notes || "",
      people_count: peopleCount || 1,
      unique_code: uniqueCode,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    db.reservations.push(reservation);
    saveDB(db);
    return reservation;
  },
  delete(id) {
    const db = getDB();
    db.reservations = (db.reservations || []).filter(
      (r) => String(r.id) !== String(id),
    );
    saveDB(db);
  },
  update(id, date, tableId, status, notes, peopleCount) {
    const db = getDB();
    const idx = (db.reservations || []).findIndex(
      (r) => String(r.id) === String(id),
    );
    if (idx !== -1) {
      const tables = db.store_tables || [];
      const table = tables.find((t) => String(t.id) === String(tableId));
      db.reservations[idx] = {
        ...db.reservations[idx],
        date,
        tableId,
        table_id: tableId || null,
        table_title: table?.title || null,
        status: status || "pending",
        notes: notes || "",
        people_count: peopleCount || 1,
        updated_at: new Date().toISOString(),
      };
      saveDB(db);
      return db.reservations[idx];
    }
    return null;
  },
};

// ── INVOICES ──────────────────────────────────────────────
export const Invoices = {
  getAll({ type, from = null, to = null } = {}) {
    let items = col("invoices");
    if (type) {
      items = filterByDateRange(items, "created_at", type, from, to);
    }
    return items.sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at),
    );
  },
  getInit() {
    return {
      printSettings: Settings.getPrintSetting(),
      storeSettings: Settings.getStoreSetting(),
    };
  },
  getOrdersByInvoice(orderIds) {
    const orders = col("orders").filter(
      (o) =>
        orderIds.includes(o.id) || orderIds.map(String).includes(String(o.id)),
    );
    const printSettings = Settings.getPrintSetting();
    const storeSettings = Settings.getStoreSetting();
    return { orders, printSettings, storeSettings };
  },
  search(query) {
    const q = (query || "").toLowerCase();
    return col("invoices").filter(
      (i) =>
        String(i.token_ids || "").includes(q) ||
        (i.customer_name || "").toLowerCase().includes(q) ||
        String(i.id).includes(q),
    );
  },
};

// ── REPORTS ───────────────────────────────────────────────
export const Reports = {
  get({ type, from = null, to = null } = {}) {
    const storeSetting = Settings.getStoreSetting();
    let orders = col("orders").filter(
      (o) => o.status === "completed" || o.payment_status === "paid",
    );
    if (type) {
      orders = filterByDateRange(orders, "created_at", type, from, to);
    }

    const ordersCount = orders.length;
    const netRevenue = orders.reduce((s, o) => s + (o.net_total || 0), 0);
    const taxTotal = orders.reduce((s, o) => s + (o.tax_total || 0), 0);
    const revenueTotal = orders.reduce((s, o) => s + (o.total || 0), 0);
    const averageOrderValue = ordersCount > 0 ? revenueTotal / ordersCount : 0;

    // Top selling items
    const itemCounts = {};
    orders.forEach((o) => {
      (o.order_items || []).forEach((oi) => {
        const key = oi.menu_item_id || oi.title;
        if (!itemCounts[key]) {
          itemCounts[key] = { title: oi.title, count: 0, revenue: 0 };
        }
        itemCounts[key].count += oi.quantity || 1;
        itemCounts[key].revenue += (oi.price || 0) * (oi.quantity || 1);
      });
    });
    const topSellingItems = Object.values(itemCounts)
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)
      .map((i) => ({ ...i, total_quantity: i.count }));

    // Customers
    const customerIds = [
      ...new Set(orders.filter((o) => o.customer_id).map((o) => o.customer_id)),
    ];
    const allCustomers = col("customers");
    const totalCustomers = allCustomers.length;

    // New vs repeated customers (simplified)
    const allOrders = col("orders");
    let newCustomers = 0;
    let repeatedCustomers = 0;
    customerIds.forEach((cid) => {
      const prevOrders = allOrders.filter(
        (o) =>
          String(o.customer_id) === String(cid) &&
          !orders.find((or) => or.id === o.id),
      );
      if (prevOrders.length === 0) {
        newCustomers++;
      } else {
        repeatedCustomers++;
      }
    });

    return {
      ordersCount,
      newCustomers,
      repeatedCustomers,
      currency: storeSetting.currency,
      averageOrderValue: parseFloat(averageOrderValue.toFixed(2)),
      totalCustomers,
      netRevenue: parseFloat(netRevenue.toFixed(2)),
      taxTotal: parseFloat(taxTotal.toFixed(2)),
      topSellingItems,
      revenueTotal: parseFloat(revenueTotal.toFixed(2)),
    };
  },
};

// ── CUSTOMER ACCOUNTS (OCOS portal) ──────────────────────
export const CustomerAccounts = {
  findByEmail(email) {
    return col("customer_accounts").find(
      (c) => c.email.toLowerCase() === email.toLowerCase(),
    );
  },
  register(name, email, password, phone) {
    const db = getDB();
    db.customer_accounts = db.customer_accounts || [];
    if (
      db.customer_accounts.find(
        (c) => c.email.toLowerCase() === email.toLowerCase(),
      )
    ) {
      throw new Error("Email already registered");
    }
    const maxId = db.customer_accounts.reduce(
      (m, c) => Math.max(m, c.id || 0),
      0,
    );
    const account = {
      id: maxId + 1,
      name,
      email,
      password,
      phone: phone || "",
      role: "customer",
      credit_balance: 0,
      created_at: new Date().toISOString(),
    };
    db.customer_accounts.push(account);
    saveDB(db);
    const { password: _p, ...safe } = account;
    return safe;
  },
  login(email, password) {
    const account = CustomerAccounts.findByEmail(email);
    if (!account || account.password !== password) {
      throw new Error("Invalid email or password");
    }
    const { password: _p, ...safe } = account;
    localStorage.setItem("cafe_session", JSON.stringify(safe));
    return safe;
  },
  logout() {
    localStorage.removeItem("cafe_session");
  },
  getSession() {
    try {
      return JSON.parse(localStorage.getItem("cafe_session")) || null;
    } catch {
      return null;
    }
  },
  updateProfile(id, name, phone) {
    const db = getDB();
    const idx = (db.customer_accounts || []).findIndex(
      (c) => String(c.id) === String(id),
    );
    if (idx !== -1) {
      db.customer_accounts[idx] = { ...db.customer_accounts[idx], name, phone };
      saveDB(db);
      const { password: _p, ...safe } = db.customer_accounts[idx];
      // Only update session if this is the currently logged in user
      const currentSession = CustomerAccounts.getSession();
      if (currentSession && currentSession.id === id) {
        localStorage.setItem("cafe_session", JSON.stringify(safe));
      }
      return safe;
    }
    return null;
  },
  addCredit(id, amount) {
    const db = getDB();
    const idx = (db.customer_accounts || []).findIndex(
      (c) => String(c.id) === String(id),
    );
    if (idx !== -1) {
      const currentBalance = db.customer_accounts[idx].credit_balance || 0;
      db.customer_accounts[idx].credit_balance =
        currentBalance + parseFloat(amount);
      saveDB(db);
      const { password: _p, ...safe } = db.customer_accounts[idx];
      const currentSession = CustomerAccounts.getSession();
      if (currentSession && currentSession.id === id) {
        localStorage.setItem("cafe_session", JSON.stringify(safe));
        window.dispatchEvent(new Event("cafe_session"));
      }
      return safe;
    }
    throw new Error("Customer not found");
  },
  deductCredit(id, amount) {
    const db = getDB();
    const idx = (db.customer_accounts || []).findIndex(
      (c) => String(c.id) === String(id),
    );
    if (idx !== -1) {
      const currentBalance = db.customer_accounts[idx].credit_balance || 0;
      if (currentBalance < parseFloat(amount)) {
        throw new Error("Insufficient credit balance");
      }
      db.customer_accounts[idx].credit_balance =
        currentBalance - parseFloat(amount);
      saveDB(db);
      const { password: _p, ...safe } = db.customer_accounts[idx];
      const currentSession = CustomerAccounts.getSession();
      if (currentSession && currentSession.id === id) {
        localStorage.setItem("cafe_session", JSON.stringify(safe));
        window.dispatchEvent(new Event("cafe_session"));
      }
      return safe;
    }
    throw new Error("Customer not found");
  },
};

// ── CAFE ORDERS (OCOS customer-placed orders) ─────────────
export const CafeOrders = {
  create({
    customerId,
    customerName,
    customerEmail,
    customerPhone,
    items,
    deliveryType,
    address,
    paymentMethod,
    paymentGatewayRef,
    subtotal,
    taxTotal,
    total,
  }) {
    const db = getDB();
    db.cafe_orders = db.cafe_orders || [];
    const maxId = db.cafe_orders.reduce((m, o) => Math.max(m, o.id || 0), 0);
    const order = {
      id: maxId + 1,
      customer_id: customerId,
      customer_name: customerName,
      customer_email: customerEmail,
      customer_phone: customerPhone,
      items: items || [],
      delivery_type: deliveryType || "delivery",
      address: address || "",
      payment_method: paymentMethod || "cash",
      payment_gateway_ref: paymentGatewayRef || null,
      payment_status: paymentMethod === "cash" ? "pending" : "paid",
      status: "pending",
      subtotal: parseFloat(subtotal || 0).toFixed(2),
      tax_total: parseFloat(taxTotal || 0).toFixed(2),
      total: parseFloat(total || 0).toFixed(2),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    db.cafe_orders.push(order);
    saveDB(db);
    return order;
  },
  getByCustomer(customerId) {
    return col("cafe_orders")
      .filter((o) => String(o.customer_id) === String(customerId))
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  },
  getById(id) {
    return col("cafe_orders").find((o) => String(o.id) === String(id)) || null;
  },
  updateStatus(id, status) {
    const db = getDB();
    const idx = (db.cafe_orders || []).findIndex(
      (o) => String(o.id) === String(id),
    );
    if (idx !== -1) {
      db.cafe_orders[idx].status = status;
      db.cafe_orders[idx].updated_at = new Date().toISOString();
      saveDB(db);
      return db.cafe_orders[idx];
    }
    return null;
  },
};

// ── DASHBOARD ─────────────────────────────────────────────
export const Dashboard = {
  get() {
    const storeSetting = Settings.getStoreSetting();

    // Today's reservations
    const todayReservations = filterByDateRange(
      col("reservations").map((r) => {
        const tables = col("store_tables");
        const table = tables.find((t) => String(t.id) === String(r.table_id));
        const customers = col("customers");
        const customer = customers.find(
          (c) => String(c.id) === String(r.customer_id),
        );
        return {
          ...r,
          table_title: table?.title || "",
          customer_name: r.customer_name || customer?.name || "Walk-in",
        };
      }),
      "date",
      "today",
      null,
      null,
    );

    const reports = Reports.get({ type: "today" });

    return {
      reservations: todayReservations,
      topSellingItems: reports.topSellingItems,
      ordersCount: reports.ordersCount,
      newCustomerCount: reports.newCustomers,
      repeatedCustomerCount: reports.repeatedCustomers,
      currency: storeSetting.currency,
    };
  },
};
