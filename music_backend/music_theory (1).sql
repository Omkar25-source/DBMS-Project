-- MySQL dump 10.13  Distrib 8.0.45, for Win64 (x86_64)
--
-- Host: localhost    Database: music_theory
-- ------------------------------------------------------
-- Server version	8.0.45

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `course_module`
--

DROP TABLE IF EXISTS `course_module`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `course_module` (
  `MODULE_ID` int NOT NULL AUTO_INCREMENT,
  `TITLE` varchar(100) NOT NULL,
  `DESCRIPTION` text,
  `LEVEL` enum('BEGINNER','INTERMEDIATE','ADVANCED') NOT NULL,
  `INSTRUMENT_ID` int NOT NULL,
  `MUSIC_ID` int DEFAULT NULL,
  PRIMARY KEY (`MODULE_ID`),
  KEY `INSTRUMENT_ID` (`INSTRUMENT_ID`),
  KEY `MUSIC_ID` (`MUSIC_ID`),
  CONSTRAINT `course_module_ibfk_1` FOREIGN KEY (`INSTRUMENT_ID`) REFERENCES `instrument` (`INSTRUMENT_ID`) ON DELETE CASCADE,
  CONSTRAINT `course_module_ibfk_2` FOREIGN KEY (`MUSIC_ID`) REFERENCES `music` (`MUSIC_ID`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `course_module`
--

LOCK TABLES `course_module` WRITE;
/*!40000 ALTER TABLE `course_module` DISABLE KEYS */;
INSERT INTO `course_module` VALUES (1,'Basic Guitar Theory','Intro to chords','BEGINNER',1,1),(2,'Piano Scales','Major & Minor scales','INTERMEDIATE',2,2),(3,'Drum Patterns','Rhythm basics','BEGINNER',3,3);
/*!40000 ALTER TABLE `course_module` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `enrollment`
--

DROP TABLE IF EXISTS `enrollment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `enrollment` (
  `USER_ID` int NOT NULL,
  `MODULE_ID` int NOT NULL,
  `ENROLLMENT_DATE` date DEFAULT (curdate()),
  PRIMARY KEY (`USER_ID`,`MODULE_ID`),
  KEY `MODULE_ID` (`MODULE_ID`),
  CONSTRAINT `enrollment_ibfk_1` FOREIGN KEY (`USER_ID`) REFERENCES `user` (`USER_ID`) ON DELETE CASCADE,
  CONSTRAINT `enrollment_ibfk_2` FOREIGN KEY (`MODULE_ID`) REFERENCES `course_module` (`MODULE_ID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `enrollment`
--

LOCK TABLES `enrollment` WRITE;
/*!40000 ALTER TABLE `enrollment` DISABLE KEYS */;
INSERT INTO `enrollment` VALUES (1,1,'2026-04-05'),(3,3,'2026-04-05');
/*!40000 ALTER TABLE `enrollment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `exercise`
--

DROP TABLE IF EXISTS `exercise`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `exercise` (
  `EXERCISE_ID` int NOT NULL AUTO_INCREMENT,
  `QUESTION` text NOT NULL,
  `CORRECT_ANSWER` text NOT NULL,
  `MODULE_ID` int NOT NULL,
  PRIMARY KEY (`EXERCISE_ID`),
  KEY `MODULE_ID` (`MODULE_ID`),
  CONSTRAINT `exercise_ibfk_1` FOREIGN KEY (`MODULE_ID`) REFERENCES `course_module` (`MODULE_ID`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `exercise`
--

LOCK TABLES `exercise` WRITE;
/*!40000 ALTER TABLE `exercise` DISABLE KEYS */;
INSERT INTO `exercise` VALUES (1,'What is a chord?','Combination of notes',1),(2,'Define scale','Sequence of notes',2),(3,'What is rhythm?','Pattern of beats',3);
/*!40000 ALTER TABLE `exercise` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `instrument`
--

DROP TABLE IF EXISTS `instrument`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `instrument` (
  `INSTRUMENT_ID` int NOT NULL AUTO_INCREMENT,
  `INSTRUMENT_NAME` varchar(50) NOT NULL,
  `INSTRUMENT_TYPE` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`INSTRUMENT_ID`),
  UNIQUE KEY `INSTRUMENT_NAME` (`INSTRUMENT_NAME`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `instrument`
--

LOCK TABLES `instrument` WRITE;
/*!40000 ALTER TABLE `instrument` DISABLE KEYS */;
INSERT INTO `instrument` VALUES (1,'Guitar','String'),(2,'Piano','Keyboard'),(3,'Drums','Percussion');
/*!40000 ALTER TABLE `instrument` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `module_concept`
--

DROP TABLE IF EXISTS `module_concept`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `module_concept` (
  `MODULE_ID` int NOT NULL,
  `CONCEPT_ID` int NOT NULL,
  PRIMARY KEY (`MODULE_ID`,`CONCEPT_ID`),
  KEY `CONCEPT_ID` (`CONCEPT_ID`),
  CONSTRAINT `module_concept_ibfk_1` FOREIGN KEY (`MODULE_ID`) REFERENCES `course_module` (`MODULE_ID`) ON DELETE CASCADE,
  CONSTRAINT `module_concept_ibfk_2` FOREIGN KEY (`CONCEPT_ID`) REFERENCES `theory_concept` (`CONCEPT_ID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `module_concept`
--

LOCK TABLES `module_concept` WRITE;
/*!40000 ALTER TABLE `module_concept` DISABLE KEYS */;
INSERT INTO `module_concept` VALUES (1,1),(2,2),(3,3);
/*!40000 ALTER TABLE `module_concept` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `music`
--

DROP TABLE IF EXISTS `music`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `music` (
  `MUSIC_ID` int NOT NULL AUTO_INCREMENT,
  `MUSIC_TYPE` varchar(50) NOT NULL,
  `MUSIC_LANGUAGE` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`MUSIC_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `music`
--

LOCK TABLES `music` WRITE;
/*!40000 ALTER TABLE `music` DISABLE KEYS */;
INSERT INTO `music` VALUES (1,'Classical','English'),(2,'Jazz','English'),(3,'Pop','ENGLISH');
/*!40000 ALTER TABLE `music` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `progress`
--

DROP TABLE IF EXISTS `progress`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `progress` (
  `PROGRESS_ID` int NOT NULL,
  `USER_ID` int NOT NULL,
  `MODULE_ID` int NOT NULL,
  `COMPLETION_STATUS` enum('NOT STARTED','IN PROGRESS','COMPLETED') DEFAULT 'NOT STARTED',
  `SCORE` int DEFAULT NULL,
  `PROGRESS_PERCENTAGE` float DEFAULT NULL,
  PRIMARY KEY (`PROGRESS_ID`,`USER_ID`,`MODULE_ID`),
  KEY `USER_ID` (`USER_ID`),
  KEY `MODULE_ID` (`MODULE_ID`),
  CONSTRAINT `progress_ibfk_1` FOREIGN KEY (`USER_ID`) REFERENCES `user` (`USER_ID`) ON DELETE CASCADE,
  CONSTRAINT `progress_ibfk_2` FOREIGN KEY (`MODULE_ID`) REFERENCES `course_module` (`MODULE_ID`) ON DELETE CASCADE,
  CONSTRAINT `progress_chk_1` CHECK (((`SCORE` >= 0) and (`SCORE` <= 100))),
  CONSTRAINT `progress_chk_2` CHECK (((`PROGRESS_PERCENTAGE` >= 0) and (`PROGRESS_PERCENTAGE` <= 100)))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `progress`
--

LOCK TABLES `progress` WRITE;
/*!40000 ALTER TABLE `progress` DISABLE KEYS */;
INSERT INTO `progress` VALUES (1,1,1,'IN PROGRESS',70,60),(2,2,2,'COMPLETED',85,100),(3,3,3,'NOT STARTED',0,0);
/*!40000 ALTER TABLE `progress` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `theory_concept`
--

DROP TABLE IF EXISTS `theory_concept`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `theory_concept` (
  `CONCEPT_ID` int NOT NULL AUTO_INCREMENT,
  `NAME` varchar(100) NOT NULL,
  `DIFFICULTY` enum('EASY','MEDIUM','HARD') NOT NULL,
  `DESCRIPTION` text,
  PRIMARY KEY (`CONCEPT_ID`),
  UNIQUE KEY `NAME` (`NAME`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `theory_concept`
--

LOCK TABLES `theory_concept` WRITE;
/*!40000 ALTER TABLE `theory_concept` DISABLE KEYS */;
INSERT INTO `theory_concept` VALUES (1,'Chords','EASY','Basic chord structure'),(2,'Scales','MEDIUM','Major and minor scales'),(3,'Rhythm','EASY','Timing and beats');
/*!40000 ALTER TABLE `theory_concept` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-04-05  8:47:00
