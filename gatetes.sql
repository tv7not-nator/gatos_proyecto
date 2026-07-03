-- CREATE DATABASE IF NOT EXISTS gatos;  USE gatos;

CREATE TABLE IF NOT EXISTS `gatetes` (
    `id` int NOT NULL AUTO_INCREMENT,
    `nombre` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `raza` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `edad` int DEFAULT NULL,
    `sexo` varchar(70) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `color` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `peso` decimal(4,1) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE utf8mb4_unicode_ci;

INSERT INTO `gatetes` (`nombre`, `raza`, `edad`, `sexo`, `color`, `peso`) VALUES
('Milo', 'Siamés', 2, 'M', 'Crema', 4.2),
('Juanito', 'Persa', 5, 'M', 'Negro', 3.8),
('Simba', 'Maine Coon', 4, 'M', 'Café', 7.5),
('Nala', 'Bengalí', 3, 'H', 'Atigrado', 4.9),
('Tom', 'Azul Ruso', 6, 'M', 'Gris', 5.3),
('Mía', 'Sphynx', 1, 'H', 'Rosado', 3.2),
('Oliver', 'Ragdoll', 7, 'M', 'Blanco y gris', 6.8),
('Cleo', 'Angora', 4, 'H', 'Blanco', 4.1),
('Leo', 'Común Europeo', 8, 'M', 'Negro', 5.0),
('Kira', 'British Shorthair', 2, 'H', 'Gris', 4.6);
COMMIT;