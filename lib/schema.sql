PRAGMA foreign_keys = ON;
DROP TABLE IF EXISTS reviews;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS burgers;
DROP TABLE IF EXISTS restaurants;
CREATE TABLE IF NOT EXISTS restaurants (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    address TEXT NOT NULL,
    url TEXT NOT NULL,
    image TEXT,
    website TEXT
);
CREATE TABLE IF NOT EXISTS burgers (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    restaurant_id TEXT NOT NULL,
    main_ingredient TEXT NOT NULL,
    amount INTEGER,
    bread TEXT,
    ingredients TEXT,
    more_ingredients TEXT,
    allergens TEXT,
    price REAL,
    taste_rating REAL,
    presentation_rating REAL,
    quality_price_rating REAL,
    image TEXT,
    FOREIGN KEY (restaurant_id) REFERENCES restaurants (id) ON UPDATE CASCADE
);
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL,
    password TEXT NOT NULL,
    email TEXT NOT NULL,
    role TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS reviews (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    burger_id TEXT NOT NULL,
    user_id INTEGER NOT NULL,
    taste_rating REAL NOT NULL,
    presentation_rating REAL NOT NULL,
    quality_price_rating REAL NOT NULL,
    comment TEXT,
    FOREIGN KEY (burger_id) REFERENCES burgers (id) ON UPDATE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users (id) ON UPDATE CASCADE
);