const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public'), { index: false }));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'store.html'));
});

app.get('/wines', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'wines.html'));
});

app.get('/cellar', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'cellar.html'));
});

// เชื่อมต่อ Database
const db = new sqlite3.Database('./users.db', (err) => {
  if (err) console.error('DB Connection Error:', err.message);
  else console.log('Connected to SQLite Database.');
});

// สร้าง/อัปเดต ตารางข้อมูล
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      full_name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      dob DATE
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS wines (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      winery TEXT,
      name TEXT NOT NULL,
      type TEXT,
      region TEXT,
      country TEXT,
      price REAL,
      rating REAL,
      ratings_count INTEGER DEFAULT 0,
      image TEXT
    )
  `, () => {
    // เพิ่มข้อมูลตัวอย่าง หากยังไม่มีในตาราง
    db.get("SELECT COUNT(*) as count FROM wines", (err, row) => {
      if (row && row.count === 0) {
        const insertStmt = db.prepare(`
          INSERT INTO wines (winery, name, type, region, country, price, rating, ratings_count, image)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);
        insertStmt.run('B Cellars', 'Premiere Napa Valley Cabernet Sauvignon 2006', 'Red', 'Napa Valley', 'USA', 1846, 4.5, 461, 'https://cdn.ct-static.com/labels/2ca3f4be-63bc-4f08-b9ce-3de6d121fdac.jpg');
        insertStmt.run('Bodegas Muga', 'Prado Enea Gran Reserva 1998', 'Red', 'Rioja', 'Spain', 1948, 4.5, 170, 'https://assets.catawiki.nl/assets/2020/9/9/2/0/d/20d3ca86-3a3d-41a3-9cfe-4dcd91340bde.jpg');
        insertStmt.run('Andrew Januik', 'Stone Cairn Cabernet Sauvignon 2013', 'Red', 'Red Mountain', 'USA', 2150, 4.4, 852, 'https://assets.wine.com/winecom/image/upload/184401fbs.jpg');
        insertStmt.run('Domaine Leflaive', 'Chevalier-Montrachet Grand Cru 2018', 'White', 'Burgundy', 'France', 4500, 4.8, 85, 'https://tse2.mm.bing.net/th/id/OIP.wL6LTgXulWv1hXZKh9fIpwAAAA?r=0&rs=1&pid=ImgDetMain&o=7&rm=3');
        insertStmt.run('Cloudy Bay', 'Sauvignon Blanc 2022', 'White', 'Marlborough', 'New Zealand', 1250, 4.3, 1500, 'https://tse4.mm.bing.net/th/id/OIP.7iNXZ7FyCk6Qk-0cvfRUJgHaJ4?r=0&rs=1&pid=ImgDetMain&o=7&rm=3');
        insertStmt.run('Dom Pérignon', 'Vintage Champagne Brut 2013', 'Sparkling', 'Champagne', 'France', 7900, 4.7, 950, 'https://media.nicks.com.au/products/154ef6ae/2013-charles-heidsieck-vintage-brut-champagne.jpg');
        insertStmt.run('Prosecco Superiore', 'Conegliano Valdobbiadene Extra Dry', 'Sparkling', 'Veneto', 'Italy', 950, 4.1, 410, 'https://www.xtrawine.com/cdn/shop/files/astoria-conegliano-valdobbiadene-prosecco-superiore-anniversario-extra-dry-2025_60494_2.webp?v=1773811717&width=1946');
        insertStmt.run('Château d Esclans', 'Whispering Angel Rosé 2022', 'Rosé', 'Provence', 'France', 1450, 4.2, 620, 'https://tse1.mm.bing.net/th/id/OIP.deLrdaLrMFCseFqZnUM2KgHaJ4?r=0&rs=1&pid=ImgDetMain&o=7&rm=3');
        insertStmt.run('Torres', 'De Casta Rosado 2021', 'Rosé', 'Catalonia', 'Spain', 750, 3.9, 190, 'https://tse3.mm.bing.net/th/id/OIP.rroe0LTT55JKWbg_7NTtbgHaX3?r=0&rs=1&pid=ImgDetMain&o=7&rm=3');
        insertStmt.run('Château d Yquem', 'Sauternes Grand Premier Cru 2015', 'Dessert', 'Bordeaux', 'France', 9800, 4.9, 340, 'https://tse1.mm.bing.net/th/id/OIP.7hkHXcsHbFJIzgXbWHPO-wHaHa?r=0&rs=1&pid=ImgDetMain&o=7&rm=3');
        insertStmt.run('Royal Tokaji', 'Aszu 5 Puttonyos 2017', 'Dessert', 'Tokaj', 'Hungary', 3200, 4.6, 210, 'https://tse3.mm.bing.net/th/id/OIP.PtjgBbDIDuAI9xAo2jSJFgAAAA?r=0&rs=1&pid=ImgDetMain&o=7&rm=3');
        insertStmt.run('Taylor Fladgate', '20 Year Old Tawny Port', 'Fortified', 'Douro', 'Portugal', 2450, 4.7, 530, 'https://img.thewhiskyexchange.com/900/port_gra9.jpg');
        insertStmt.run('Sandeman', 'Fine Ruby Port', 'Fortified', 'Porto', 'Portugal', 990, 4.0, 310, 'https://tse2.mm.bing.net/th/id/OIP.stYeLx3ELPCOXROSSllOFwHaLZ?r=0&rs=1&pid=ImgDetMain&o=7&rm=3');
        insertStmt.finalize();
        console.log('Sample wines added to database.');
      }
    });
  });
});

// ==================== USER AUTH APIS ====================
app.post('/api/signup', (req, res) => {
  const { fullName, email, password, dob } = req.body;
  if (!fullName || !email || !password) return res.status(400).json({ error: 'Please fill in all required fields.' });

  const query = `INSERT INTO users (full_name, email, password, dob) VALUES (?, ?, ?, ?)`;
  db.run(query, [fullName, email, password, dob], function (err) {
    if (err) {
      if (err.message.includes('UNIQUE constraint failed')) return res.status(400).json({ error: 'This email is already registered.' });
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'User registered successfully!', userId: this.lastID });
  });
});

app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  const query = `SELECT * FROM users WHERE email = ? AND password = ?`;
  db.get(query, [email, password], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(401).json({ error: 'Invalid email or password.' });
    res.json({ message: 'Login successful!', user: { id: row.id, fullName: row.full_name, email: row.email } });
  });
});

// ==================== WINES APIS ====================
app.get('/api/wines', (req, res) => {
  let query = 'SELECT * FROM wines WHERE 1=1';
  const params = [];

  const { search, types, minRating, maxPrice, countries, sort } = req.query;

  // Search keyword
  if (search && search.trim() !== '') {
    query += ` AND (name LIKE ? OR winery LIKE ? OR region LIKE ?)`;
    params.push(`%${search.trim()}%`, `%${search.trim()}%`, `%${search.trim()}%`);
  }

  // Filter Types
  if (types && types.trim() !== '') {
    const typeList = types.split(',');
    const placeholders = typeList.map(() => '?').join(',');
    query += ` AND type IN (${placeholders})`;
    params.push(...typeList);
  }

  // Filter Rating
  if (minRating && parseFloat(minRating) > 0) {
    query += ` AND rating >= ?`;
    params.push(parseFloat(minRating));
  }

  // Filter Price Range
  if (maxPrice) {
    query += ` AND price <= ?`;
    params.push(parseFloat(maxPrice));
  }

  // Filter Countries
  if (countries && countries.trim() !== '') {
    const countryList = countries.split(',');
    const placeholders = countryList.map(() => '?').join(',');
    query += ` AND country IN (${placeholders})`;
    params.push(...countryList);
  }

  // Sort Options
  if (sort === 'rating_desc') query += ` ORDER BY rating DESC`;
  else if (sort === 'price_asc') query += ` ORDER BY price ASC`;
  else if (sort === 'price_desc') query += ` ORDER BY price DESC`;
  else query += ` ORDER BY id DESC`;

  db.all(query, params, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// API เพิ่มไวน์ใหม่ (POST)
app.post('/api/wines', (req, res) => {
  const { winery, name, type, region, country, price, rating, ratings_count, image } = req.body;

  const query = `INSERT INTO wines (winery, name, type, region, country, price, rating, ratings_count, image) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  db.run(query, [
    winery || 'Winery',
    name,
    type,
    region,
    country,
    price,
    rating || 5.0,
    ratings_count || 1,
    image || 'https://images.vivino.com/thumbs/0068ba2p910000_300x600.png'
  ], function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json({ id: this.lastID, success: true, message: 'Wine added successfully!' });
    }
  });
});

// API อัปเดตข้อมูลไวน์ (PUT) - รองรับหน้า Edit Wine Collection จาก cellar.html
app.put('/api/wines/:id', (req, res) => {
  const { id } = req.params;
  const { winery, name, type, region, country, price, rating, image } = req.body;

  const query = `
        UPDATE wines 
        SET winery = ?, name = ?, type = ?, region = ?, country = ?, price = ?, rating = ?, image = ? 
        WHERE id = ?
    `;

  db.run(query, [
    winery || 'Winery',
    name,
    type,
    region,
    country,
    price,
    rating || 5.0,
    image || 'https://images.vivino.com/thumbs/0068ba2p910000_300x600.png',
    id
  ], function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
    } else if (this.changes === 0) {
      res.status(404).json({ error: 'Wine not found.' });
    } else {
      res.json({ success: true, message: 'Wine updated successfully!' });
    }
  });
});

// เพิ่ม Route เปิดหน้า Cart
app.get('/cart', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'cart.html'));
});

// เพิ่มตาราง Orders ในฐานข้อมูล (ใส่ไว้ใน db.serialize ใต้ตาราง wines เดิม)
db.run(`
  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_details TEXT,
    total_price REAL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// API Checkout สำหรับบันทึกการชำระเงิน
app.post('/api/checkout', (req, res) => {
  const { items } = req.body;
  if (!items || items.length === 0) return res.status(400).json({ error: 'Cart is empty.' });

  let totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  let detailsStr = JSON.stringify(items);

  const query = `INSERT INTO orders (order_details, total_price) VALUES (?, ?)`;
  db.run(query, [detailsStr, totalPrice], function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json({ success: true, orderId: this.lastID, message: 'Payment successful!' });
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});