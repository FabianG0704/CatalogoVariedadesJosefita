-- Script de inicializacion para Variedades Josefita
-- Ejecutar en pgAdmin o psql

CREATE DATABASE bdjosefita;

\c bdjosefita;

CREATE TABLE prendas (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    talla VARCHAR(10) NOT NULL,
    color VARCHAR(30) NOT NULL,
    precio DECIMAL(12,2) NOT NULL,
    categoria VARCHAR(30) NOT NULL DEFAULT 'camisetas',
    genero VARCHAR(10) NOT NULL DEFAULT 'unisex',
    imagen_url VARCHAR(500),
    activo BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    rol VARCHAR(20) NOT NULL DEFAULT 'ADMIN'
);

INSERT INTO usuarios (username, password, rol) VALUES
('josefita', '1234', 'ADMIN');

INSERT INTO prendas (nombre, talla, color, precio, categoria, genero, imagen_url) VALUES
('Camiseta FC Barcelona', 'M', 'Rojo', 50000, 'deportivas', 'hombres', 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=400&q=80'),
('Camiseta Real Madrid', 'L', 'Blanco', 55000, 'deportivas', 'hombres', 'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=400&q=80'),
('Camiseta Basica Blanca', 'M', 'Blanco', 28000, 'camisetas', 'hombres', 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&q=80'),
('Camiseta Negra Slim', 'S', 'Negro', 30000, 'camisetas', 'hombres', 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=400&q=80'),
('Polo Casual Azul', 'M', 'Azul', 32000, 'polos', 'hombres', 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=400&q=80'),
('Blusa Elegante Roja', 'M', 'Rojo', 38000, 'blusas', 'mujeres', 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=400&q=80'),
('Blusa Casual Rosa', 'S', 'Rosa', 34000, 'blusas', 'mujeres', 'https://images.unsplash.com/photo-1551537482-f2075a1d41f2?w=400&q=80'),
('Camiseta Oversize Mujer', 'L', 'Beige', 29000, 'camisetas', 'mujeres', 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400&q=80'),
('Camiseta Deportiva Mujer', 'M', 'Negro', 45000, 'deportivas', 'mujeres', 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&q=80'),
('Polo Clasico Mujer', 'S', 'Blanco', 36000, 'polos', 'mujeres', 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400&q=80');
