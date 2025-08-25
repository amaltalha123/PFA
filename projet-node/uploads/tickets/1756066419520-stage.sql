-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Aug 24, 2025 at 05:32 PM
-- Server version: 8.2.0
-- PHP Version: 8.2.13

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `stage`
--

-- --------------------------------------------------------

--
-- Table structure for table `departements`
--

DROP TABLE IF EXISTS `departements`;
CREATE TABLE IF NOT EXISTS `departements` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nom` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `departements`
--

INSERT INTO `departements` (`id`, `nom`, `createdAt`, `updatedAt`) VALUES
(1, 'dept 1', '2025-08-21 12:34:58', '2025-08-21 12:34:58');

-- --------------------------------------------------------

--
-- Table structure for table `documents`
--

DROP TABLE IF EXISTS `documents`;
CREATE TABLE IF NOT EXISTS `documents` (
  `id` int NOT NULL AUTO_INCREMENT,
  `document_attestation` varchar(255) DEFAULT NULL,
  `document_evaluation` varchar(255) DEFAULT NULL,
  `stage_id` int NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `stage_id` (`stage_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `encadrants`
--

DROP TABLE IF EXISTS `encadrants`;
CREATE TABLE IF NOT EXISTS `encadrants` (
  `id` int NOT NULL AUTO_INCREMENT,
  `specialite` varchar(255) DEFAULT NULL,
  `user_id` int DEFAULT NULL,
  `departement_id` int NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_id` (`user_id`),
  KEY `departement_id` (`departement_id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `encadrants`
--

INSERT INTO `encadrants` (`id`, `specialite`, `user_id`, `departement_id`, `createdAt`, `updatedAt`) VALUES
(1, 'bczougc', 2, 1, '2025-08-21 12:35:16', '2025-08-21 12:35:16'),
(9, 'cziyegc', 12, 1, '2025-08-21 19:52:30', '2025-08-21 19:52:30');

-- --------------------------------------------------------

--
-- Table structure for table `evaluations`
--

DROP TABLE IF EXISTS `evaluations`;
CREATE TABLE IF NOT EXISTS `evaluations` (
  `id` int NOT NULL AUTO_INCREMENT,
  `ponctualite` int DEFAULT NULL,
  `autonomie` int DEFAULT NULL,
  `integration` int DEFAULT NULL,
  `qualite_travaille` int DEFAULT NULL,
  `stage_id` int NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `stage_id` (`stage_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `missions`
--

DROP TABLE IF EXISTS `missions`;
CREATE TABLE IF NOT EXISTS `missions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `description` text,
  `done` tinyint(1) DEFAULT '0',
  `stage_id` int NOT NULL,
  `date_limite` datetime NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `stage_id` (`stage_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `notes`
--

DROP TABLE IF EXISTS `notes`;
CREATE TABLE IF NOT EXISTS `notes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `contenue` text,
  `date` date NOT NULL,
  `color` varchar(255) DEFAULT '#3B82F6',
  `stagiaire_id` int NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `stagiaire_id` (`stagiaire_id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `notes`
--

INSERT INTO `notes` (`id`, `contenue`, `date`, `color`, `stagiaire_id`, `createdAt`, `updatedAt`) VALUES
(1, 'vzkhvd caizgv cauefcb', '2025-08-21', '#3B82F6', 1, '2025-08-21 12:39:08', '2025-08-21 12:39:08'),
(4, 'hello hello 11', '2025-08-22', '#8B5CF6', 1, '2025-08-21 12:45:22', '2025-08-21 13:15:15'),
(5, 'bla bla ', '2025-08-09', '#F59E0B', 1, '2025-08-21 13:15:42', '2025-08-21 13:45:17'),
(6, 'amal', '2025-08-30', '#EF4444', 1, '2025-08-21 13:35:27', '2025-08-21 13:45:05');

-- --------------------------------------------------------

--
-- Table structure for table `rapports`
--

DROP TABLE IF EXISTS `rapports`;
CREATE TABLE IF NOT EXISTS `rapports` (
  `id` int NOT NULL AUTO_INCREMENT,
  `contenue` text,
  `fichier` varchar(255) DEFAULT NULL,
  `stage_id` int NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `stage_id` (`stage_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `rapport_evaluations`
--

DROP TABLE IF EXISTS `rapport_evaluations`;
CREATE TABLE IF NOT EXISTS `rapport_evaluations` (
  `id` int NOT NULL AUTO_INCREMENT,
  `presentation_generale` int DEFAULT NULL,
  `stricture_méthodologie` int DEFAULT NULL,
  `contenue_rapport` int DEFAULT NULL,
  `esprit_analyse_synthèse` int DEFAULT NULL,
  `rapport_id` int NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `rapport_id` (`rapport_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `stages`
--

DROP TABLE IF EXISTS `stages`;
CREATE TABLE IF NOT EXISTS `stages` (
  `id` int NOT NULL AUTO_INCREMENT,
  `stagiare_id` int NOT NULL,
  `encadrant_id` int NOT NULL,
  `date_debut` datetime DEFAULT NULL,
  `date_fin` datetime DEFAULT NULL,
  `sujet` text,
  `type_stage` enum('initiation','PFA','PFE') NOT NULL DEFAULT 'initiation',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `stagiare_id` (`stagiare_id`),
  KEY `encadrant_id` (`encadrant_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `stages`
--

INSERT INTO `stages` (`id`, `stagiare_id`, `encadrant_id`, `date_debut`, `date_fin`, `sujet`, `type_stage`, `createdAt`, `updatedAt`) VALUES
(1, 1, 1, '2025-06-25 00:00:00', '2025-08-25 00:00:00', 'vdaoUKFVZC ZEGFVB VEZUKHFGB', 'PFA', '2025-08-21 12:37:45', '2025-08-21 12:37:45');

-- --------------------------------------------------------

--
-- Table structure for table `stagiaires`
--

DROP TABLE IF EXISTS `stagiaires`;
CREATE TABLE IF NOT EXISTS `stagiaires` (
  `id` int NOT NULL AUTO_INCREMENT,
  `ecole` varchar(255) DEFAULT NULL,
  `filiere` varchar(255) DEFAULT NULL,
  `niveau` varchar(255) DEFAULT NULL,
  `cv` varchar(255) DEFAULT NULL,
  `lettre_motivation` varchar(255) DEFAULT NULL,
  `user_id` int NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `stagiaires`
--

INSERT INTO `stagiaires` (`id`, `ecole`, `filiere`, `niveau`, `cv`, `lettre_motivation`, `user_id`, `createdAt`, `updatedAt`) VALUES
(1, 'ENSA', 'GI', '4 ème année', 'uploads\\cvs\\1755779820745-Management (1).pdf', 'uploads\\lettres\\1755779820803-Management (1).pdf', 3, '2025-08-21 12:37:00', '2025-08-21 12:37:00');

-- --------------------------------------------------------

--
-- Table structure for table `tickets`
--

DROP TABLE IF EXISTS `tickets`;
CREATE TABLE IF NOT EXISTS `tickets` (
  `id` int NOT NULL AUTO_INCREMENT,
  `Contenue` text,
  `commentaire_encadrant` text,
  `piece_jointe` varchar(255) DEFAULT NULL,
  `stage_id` int NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `stage_id` (`stage_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nom` varchar(255) NOT NULL,
  `prenom` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','encadrant','stagiaire','user') NOT NULL DEFAULT 'user',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `nom`, `prenom`, `email`, `password`, `role`, `createdAt`, `updatedAt`) VALUES
(1, 'talha', 'amal', 'talha.amal@etu.uae.ac.ma', '$2b$10$uSi21sUKZUgXAPd2U/kPAuPmZvaWsi1.v5l26Uaj1K84BnP0kwCoK', 'admin', '2025-08-21 12:27:20', '2025-08-21 12:27:20'),
(2, 'nada', 'talha', 'tlhamal84@gmail.com', '$2b$10$uSi21sUKZUgXAPd2U/kPAuPmZvaWsi1.v5l26Uaj1K84BnP0kwCoK', 'encadrant', '2025-08-21 12:35:16', '2025-08-21 12:35:16'),
(3, 'talha', 'amal', 'talhaamal204@gmail.com', '$2b$10$uSi21sUKZUgXAPd2U/kPAuPmZvaWsi1.v5l26Uaj1K84BnP0kwCoK', 'stagiaire', '2025-08-21 12:37:00', '2025-08-21 15:43:56'),
(12, 'bcaezgvb', 'cbezolbvf', 'amaltalha1984@gmail.com', '$2b$10$xFMgDGUlRwn2W4Hb3gSOqedcAeWjCMnz4oc83nxOtGi7LuBFWixli', 'encadrant', '2025-08-21 19:52:30', '2025-08-21 19:52:30');

--
-- Constraints for dumped tables
--

--
-- Constraints for table `documents`
--
ALTER TABLE `documents`
  ADD CONSTRAINT `documents_ibfk_1` FOREIGN KEY (`stage_id`) REFERENCES `stages` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `encadrants`
--
ALTER TABLE `encadrants`
  ADD CONSTRAINT `encadrants_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `encadrants_ibfk_2` FOREIGN KEY (`departement_id`) REFERENCES `departements` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `evaluations`
--
ALTER TABLE `evaluations`
  ADD CONSTRAINT `evaluations_ibfk_1` FOREIGN KEY (`stage_id`) REFERENCES `stages` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `missions`
--
ALTER TABLE `missions`
  ADD CONSTRAINT `missions_ibfk_1` FOREIGN KEY (`stage_id`) REFERENCES `stages` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `notes`
--
ALTER TABLE `notes`
  ADD CONSTRAINT `notes_ibfk_1` FOREIGN KEY (`stagiaire_id`) REFERENCES `stagiaires` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `rapports`
--
ALTER TABLE `rapports`
  ADD CONSTRAINT `rapports_ibfk_1` FOREIGN KEY (`stage_id`) REFERENCES `stages` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `rapport_evaluations`
--
ALTER TABLE `rapport_evaluations`
  ADD CONSTRAINT `rapport_evaluations_ibfk_1` FOREIGN KEY (`rapport_id`) REFERENCES `rapports` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `stages`
--
ALTER TABLE `stages`
  ADD CONSTRAINT `stages_ibfk_1` FOREIGN KEY (`stagiare_id`) REFERENCES `stagiaires` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `stages_ibfk_2` FOREIGN KEY (`encadrant_id`) REFERENCES `encadrants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `stagiaires`
--
ALTER TABLE `stagiaires`
  ADD CONSTRAINT `stagiaires_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `tickets`
--
ALTER TABLE `tickets`
  ADD CONSTRAINT `tickets_ibfk_1` FOREIGN KEY (`stage_id`) REFERENCES `stages` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
