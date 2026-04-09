-- ============================================================
-- Music Theory Learning System — Full Database Setup
-- Run this file to create and populate all tables
-- ============================================================

CREATE DATABASE IF NOT EXISTS music_theory;
USE music_theory;

SET FOREIGN_KEY_CHECKS = 0;

-- ── 1. USER ──────────────────────────────────────────────────
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `USER_ID`   int          NOT NULL AUTO_INCREMENT,
  `F_NAME`    varchar(50)  NOT NULL,
  `L_NAME`    varchar(50)  NOT NULL,
  `EMAIL_ID`  varchar(100) NOT NULL,
  `USER_PASS` varchar(255) NOT NULL,
  `LEVEL`     enum('BEGINNER','INTERMEDIATE','ADVANCED') DEFAULT 'BEGINNER',
  `CREATED_AT` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`USER_ID`),
  UNIQUE KEY `EMAIL_ID` (`EMAIL_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4;

INSERT INTO `user` VALUES
  (1,'Alice','Smith','alice@example.com','pass123','BEGINNER', NOW()),
  (2,'Bob','Jones','bob@example.com','pass456','INTERMEDIATE', NOW()),
  (3,'Carol','Lee','carol@example.com','pass789','ADVANCED', NOW());

-- ── 2. INSTRUMENT ─────────────────────────────────────────────
DROP TABLE IF EXISTS `instrument`;
CREATE TABLE `instrument` (
  `INSTRUMENT_ID`   int         NOT NULL AUTO_INCREMENT,
  `INSTRUMENT_NAME` varchar(50) NOT NULL,
  `INSTRUMENT_TYPE` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`INSTRUMENT_ID`),
  UNIQUE KEY `INSTRUMENT_NAME` (`INSTRUMENT_NAME`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4;

INSERT INTO `instrument` VALUES
  (1,'Guitar','String'),
  (2,'Piano','Keyboard'),
  (3,'Drums','Percussion');

-- ── 3. USER_INSTRUMENT (M:N junction) ─────────────────────────
DROP TABLE IF EXISTS `user_instrument`;
CREATE TABLE `user_instrument` (
  `USER_ID`       int NOT NULL,
  `INSTRUMENT_ID` int NOT NULL,
  PRIMARY KEY (`USER_ID`,`INSTRUMENT_ID`),
  KEY `INSTRUMENT_ID` (`INSTRUMENT_ID`),
  CONSTRAINT `ui_fk1` FOREIGN KEY (`USER_ID`)       REFERENCES `user`       (`USER_ID`)       ON DELETE CASCADE,
  CONSTRAINT `ui_fk2` FOREIGN KEY (`INSTRUMENT_ID`) REFERENCES `instrument` (`INSTRUMENT_ID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `user_instrument` VALUES (1,1),(2,2),(3,3);

-- ── 4. MUSIC ──────────────────────────────────────────────────
DROP TABLE IF EXISTS `music`;
CREATE TABLE `music` (
  `MUSIC_ID`       int         NOT NULL AUTO_INCREMENT,
  `MUSIC_TYPE`     varchar(50) NOT NULL,
  `MUSIC_LANGUAGE` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`MUSIC_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4;

INSERT INTO `music` VALUES
  (1,'Classical','English'),
  (2,'Jazz','English'),
  (3,'Pop','English');

-- ── 5. THEORY_CONCEPT ─────────────────────────────────────────
DROP TABLE IF EXISTS `theory_concept`;
CREATE TABLE `theory_concept` (
  `CONCEPT_ID`  int          NOT NULL AUTO_INCREMENT,
  `NAME`        varchar(100) NOT NULL,
  `DIFFICULTY`  enum('EASY','MEDIUM','HARD') NOT NULL,
  `DESCRIPTION` text,
  PRIMARY KEY (`CONCEPT_ID`),
  UNIQUE KEY `NAME` (`NAME`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4;

INSERT INTO `theory_concept` VALUES
  (1,'Chords','EASY','Basic chord structure'),
  (2,'Scales','MEDIUM','Major and minor scales'),
  (3,'Rhythm','EASY','Timing and beats');

-- ── 6. COURSE_MODULE ──────────────────────────────────────────
DROP TABLE IF EXISTS `course_module`;
CREATE TABLE `course_module` (
  `MODULE_ID`     int          NOT NULL AUTO_INCREMENT,
  `TITLE`         varchar(100) NOT NULL,
  `DESCRIPTION`   text,
  `LEVEL`         enum('BEGINNER','INTERMEDIATE','ADVANCED') NOT NULL,
  `INSTRUMENT_ID` int          NOT NULL,
  `MUSIC_ID`      int          DEFAULT NULL,
  PRIMARY KEY (`MODULE_ID`),
  KEY `INSTRUMENT_ID` (`INSTRUMENT_ID`),
  KEY `MUSIC_ID` (`MUSIC_ID`),
  CONSTRAINT `cm_fk1` FOREIGN KEY (`INSTRUMENT_ID`) REFERENCES `instrument` (`INSTRUMENT_ID`) ON DELETE CASCADE,
  CONSTRAINT `cm_fk2` FOREIGN KEY (`MUSIC_ID`)      REFERENCES `music`      (`MUSIC_ID`)      ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4;

INSERT INTO `course_module` VALUES
  (1,'Basic Guitar Theory','Intro to chords','BEGINNER',1,1),
  (2,'Piano Scales','Major & Minor scales','INTERMEDIATE',2,2),
  (3,'Drum Patterns','Rhythm basics','BEGINNER',3,3);

-- ── 7. EXERCISE ───────────────────────────────────────────────
DROP TABLE IF EXISTS `exercise`;
CREATE TABLE `exercise` (
  `EXERCISE_ID`    int  NOT NULL AUTO_INCREMENT,
  `QUESTION`       text NOT NULL,
  `CORRECT_ANSWER` text NOT NULL,
  `MODULE_ID`      int  NOT NULL,
  PRIMARY KEY (`EXERCISE_ID`),
  KEY `MODULE_ID` (`MODULE_ID`),
  CONSTRAINT `ex_fk1` FOREIGN KEY (`MODULE_ID`) REFERENCES `course_module` (`MODULE_ID`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4;

INSERT INTO `exercise` VALUES
  (1,'What is a chord?','Combination of notes',1),
  (2,'Define scale','Sequence of notes',2),
  (3,'What is rhythm?','Pattern of beats',3);

-- ── 8. MODULE_CONCEPT (M:N junction) ─────────────────────────
DROP TABLE IF EXISTS `module_concept`;
CREATE TABLE `module_concept` (
  `MODULE_ID`  int NOT NULL,
  `CONCEPT_ID` int NOT NULL,
  PRIMARY KEY (`MODULE_ID`,`CONCEPT_ID`),
  KEY `CONCEPT_ID` (`CONCEPT_ID`),
  CONSTRAINT `mc_fk1` FOREIGN KEY (`MODULE_ID`)  REFERENCES `course_module`  (`MODULE_ID`)  ON DELETE CASCADE,
  CONSTRAINT `mc_fk2` FOREIGN KEY (`CONCEPT_ID`) REFERENCES `theory_concept` (`CONCEPT_ID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `module_concept` VALUES (1,1),(2,2),(3,3);

-- ── 9. ENROLLMENT (M:N junction) ──────────────────────────────
DROP TABLE IF EXISTS `enrollment`;
CREATE TABLE `enrollment` (
  `USER_ID`         int  NOT NULL,
  `MODULE_ID`       int  NOT NULL,
  `ENROLLMENT_DATE` date DEFAULT (CURDATE()),
  PRIMARY KEY (`USER_ID`,`MODULE_ID`),
  KEY `MODULE_ID` (`MODULE_ID`),
  CONSTRAINT `en_fk1` FOREIGN KEY (`USER_ID`)   REFERENCES `user`          (`USER_ID`)   ON DELETE CASCADE,
  CONSTRAINT `en_fk2` FOREIGN KEY (`MODULE_ID`) REFERENCES `course_module` (`MODULE_ID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `enrollment` VALUES (1,1,CURDATE()),(3,3,CURDATE());

-- ── 10. PROGRESS (Weak entity) ────────────────────────────────
DROP TABLE IF EXISTS `progress`;
CREATE TABLE `progress` (
  `PROGRESS_ID`         int   NOT NULL AUTO_INCREMENT,
  `USER_ID`             int   NOT NULL,
  `MODULE_ID`           int   NOT NULL,
  `COMPLETION_STATUS`   enum('NOT STARTED','IN PROGRESS','COMPLETED') DEFAULT 'NOT STARTED',
  `SCORE`               int   DEFAULT NULL,
  `PROGRESS_PERCENTAGE` float DEFAULT NULL,
  PRIMARY KEY (`PROGRESS_ID`),
  KEY `USER_ID`   (`USER_ID`),
  KEY `MODULE_ID` (`MODULE_ID`),
  CONSTRAINT `pr_fk1` FOREIGN KEY (`USER_ID`)   REFERENCES `user`          (`USER_ID`)   ON DELETE CASCADE,
  CONSTRAINT `pr_fk2` FOREIGN KEY (`MODULE_ID`) REFERENCES `course_module` (`MODULE_ID`) ON DELETE CASCADE,
  CONSTRAINT `pr_chk1` CHECK ((`SCORE` >= 0) AND (`SCORE` <= 100)),
  CONSTRAINT `pr_chk2` CHECK ((`PROGRESS_PERCENTAGE` >= 0) AND (`PROGRESS_PERCENTAGE` <= 100))
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4;

INSERT INTO `progress` VALUES
  (1,1,1,'IN PROGRESS',70,60),
  (2,2,2,'COMPLETED',85,100),
  (3,3,3,'NOT STARTED',0,0);

SET FOREIGN_KEY_CHECKS = 1;

-- ============================================================
-- Setup complete! Tables: user, instrument, user_instrument,
-- music, theory_concept, course_module, exercise,
-- module_concept, enrollment, progress
-- ============================================================
