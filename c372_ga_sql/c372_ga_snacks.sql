-- MySQL dump 10.13  Distrib 8.0.34, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: c372_ga
-- ------------------------------------------------------
-- Server version	8.0.34

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
-- Table structure for table `snacks`
--

DROP TABLE IF EXISTS `snacks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `snacks` (
  `snackId` int NOT NULL AUTO_INCREMENT,
  `snackname` varchar(45) DEFAULT NULL,
  `price` float DEFAULT NULL,
  `image` varchar(1000) DEFAULT NULL,
  `description` varchar(10000) DEFAULT NULL,
  `size` varchar(45) DEFAULT NULL,
  `quantity` varchar(45) DEFAULT NULL,
  `categoryId` int NOT NULL,
  PRIMARY KEY (`snackId`),
  KEY `fk_category_product` (`categoryId`) /*!80000 INVISIBLE */,
  CONSTRAINT `fk_category_product` FOREIGN KEY (`categoryId`) REFERENCES `category` (`categoryId`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `snacks`
--

LOCK TABLES `snacks` WRITE;
/*!40000 ALTER TABLE `snacks` DISABLE KEYS */;
INSERT INTO `snacks` VALUES (1,'Ice pop',1.5,'ice_pop.jpg','perfect for a sunny day','100','50',3),(3,'Ice Gem',1.5,'ice_gem.jpg','This beautifully colorful traditional snack is well loved by all generations, familiar to many who would grew up with this.','1001','10',2),(4,'Wheel crackers',1.5,'wheel_cracker.jpg','best cracker!','100','50',4),(5,'Apollo Wafer (chocokate)',3.2,'apollo_wafer_choco.jpg','it comesin a pack of 10!','1','10',5),(8,'abc',5.2,'abc_biscuit.jpg','perfect for a sunny day','1','1',2);
/*!40000 ALTER TABLE `snacks` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-12-05 23:23:54
