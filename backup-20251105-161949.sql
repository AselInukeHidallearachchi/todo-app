-- MySQL dump 10.13  Distrib 9.4.0, for macos15.4 (arm64)
--
-- Host: 127.0.0.1    Database: todo
-- ------------------------------------------------------
-- Server version	9.4.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `attachments`
--

DROP TABLE IF EXISTS `attachments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `attachments` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `task_id` bigint unsigned NOT NULL,
  `uploaded_by` bigint unsigned NOT NULL,
  `original_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `path` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `mime_type` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `size_bytes` bigint unsigned DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `attachments_task_id_foreign` (`task_id`),
  KEY `attachments_uploaded_by_foreign` (`uploaded_by`),
  CONSTRAINT `attachments_task_id_foreign` FOREIGN KEY (`task_id`) REFERENCES `tasks` (`id`) ON DELETE CASCADE,
  CONSTRAINT `attachments_uploaded_by_foreign` FOREIGN KEY (`uploaded_by`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=131 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `attachments`
--

LOCK TABLES `attachments` WRITE;
/*!40000 ALTER TABLE `attachments` DISABLE KEYS */;
INSERT INTO `attachments` VALUES (28,32,1,'Best practices .pdf','attachments/cqBbLQHBD3ybrk8FGRlxVIji94ju7SBaKXSj3b4Z.pdf','application/pdf',387763,'2025-10-23 02:29:16','2025-10-23 02:29:16'),(77,33,1,'Best practices .pdf','attachments/zZb3NluJmX553bV25aNBJbHhTUdpj4uVQw22K3Fp.pdf','application/pdf',387763,'2025-10-23 05:00:52','2025-10-23 05:00:52'),(78,33,1,'Asel Employment Agreement.pdf','attachments/gc3wlHo7DyqSLOo9YhiEE2gz6mVO0meryU6jH0CA.pdf','application/pdf',248422,'2025-10-23 05:00:59','2025-10-23 05:00:59'),(83,34,1,'Asel Employment Agreement.pdf','attachments/4waISnVHucIRt5okMKBhE7p2D0YCbvHy0CPa8IdK.pdf','application/pdf',248422,'2025-10-23 05:09:08','2025-10-23 05:09:08'),(84,34,1,'Asel Initiation of work.pdf','attachments/VE3fo7nCiTDZmF60B99vHqVobAMRBJaTck8Ag7gb.pdf','application/pdf',105198,'2025-10-23 05:09:15','2025-10-23 05:09:15'),(85,35,1,'Asel Initiation of work.pdf','attachments/cZP8Y5OmoSZS8P21Jg5YYIynPl45Z1639SVoWYDR.pdf','application/pdf',105198,'2025-10-23 05:11:49','2025-10-23 05:11:49'),(98,8,1,'Best practices .pdf','attachments/OhPrum1oahgAmTNu4DK6KsKvmIAS6P8SRTD8eyWW.pdf','application/pdf',387763,'2025-10-23 06:01:04','2025-10-23 06:01:04'),(101,8,1,'Asel Initiation of work.pdf','attachments/uHyDiMHIVyF5PTghph60ZWjr44m86eA0OjIhajxo.pdf','application/pdf',105198,'2025-10-23 06:29:12','2025-10-23 06:29:12'),(106,31,3,'Asel Initiation of work.pdf','attachments/0VcRnuFR5jdVHeDoSeep8uf0ce5kKawoJ6Or61xP.pdf','application/pdf',105198,'2025-10-23 06:39:17','2025-10-23 06:39:17'),(107,31,3,'Best practices .pdf','attachments/2LkT4VULhwsGTVwPG5mVvZhZj9SjjaTOHZx3M6t5.pdf','application/pdf',387763,'2025-10-23 06:40:47','2025-10-23 06:40:47'),(108,31,3,'Asel Position Details.pdf','attachments/IeqDITmClemYlhikMpYSE8aAClBd7nZici6ioyTH.pdf','application/pdf',122282,'2025-10-23 06:40:53','2025-10-23 06:40:53'),(109,38,7,'Best practices .pdf','attachments/i2oDHOnnN8gsKWLYcX9xkIAoxYInMl4OvM7o1Ygf.pdf','application/pdf',387763,'2025-10-27 03:13:08','2025-10-27 03:13:08'),(115,36,1,'Asel Employment Agreement.pdf','attachments/criTzsaWe0QKDFWlksjKjQcFdm8MLVoyg5mERZXh.pdf','application/pdf',248422,'2025-10-27 13:36:54','2025-10-27 13:36:54'),(116,36,1,'Best practices .pdf','attachments/QlG7amOSSAN3isbJWPdLkoaZhTKKiuQV5RSo8B8x.pdf','application/pdf',387763,'2025-10-27 13:44:57','2025-10-27 13:44:57'),(117,39,1,'Best practices .pdf','attachments/O9PYTByL8ybFqpNILGG423pQKRmc53H8LmbFiKw6.pdf','application/pdf',387763,'2025-10-28 06:06:17','2025-10-28 06:06:17'),(130,42,1,'Asel Employment Agreement.pdf','attachments/Q4o5UGm9iv9Ao7fJYU9wKkAC9zq2qrQAeKfb6tDQ.pdf','application/pdf',248422,'2025-10-30 22:38:50','2025-10-30 22:38:50');
/*!40000 ALTER TABLE `attachments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cache`
--

DROP TABLE IF EXISTS `cache`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cache` (
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` mediumtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int NOT NULL,
  PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cache`
--

LOCK TABLES `cache` WRITE;
/*!40000 ALTER TABLE `cache` DISABLE KEYS */;
/*!40000 ALTER TABLE `cache` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cache_locks`
--

DROP TABLE IF EXISTS `cache_locks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cache_locks` (
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `owner` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int NOT NULL,
  PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cache_locks`
--

LOCK TABLES `cache_locks` WRITE;
/*!40000 ALTER TABLE `cache_locks` DISABLE KEYS */;
/*!40000 ALTER TABLE `cache_locks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `failed_jobs`
--

DROP TABLE IF EXISTS `failed_jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `failed_jobs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `uuid` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `connection` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `queue` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `exception` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `failed_jobs`
--

LOCK TABLES `failed_jobs` WRITE;
/*!40000 ALTER TABLE `failed_jobs` DISABLE KEYS */;
/*!40000 ALTER TABLE `failed_jobs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `job_batches`
--

DROP TABLE IF EXISTS `job_batches`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `job_batches` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `total_jobs` int NOT NULL,
  `pending_jobs` int NOT NULL,
  `failed_jobs` int NOT NULL,
  `failed_job_ids` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `options` mediumtext COLLATE utf8mb4_unicode_ci,
  `cancelled_at` int DEFAULT NULL,
  `created_at` int NOT NULL,
  `finished_at` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `job_batches`
--

LOCK TABLES `job_batches` WRITE;
/*!40000 ALTER TABLE `job_batches` DISABLE KEYS */;
/*!40000 ALTER TABLE `job_batches` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `jobs`
--

DROP TABLE IF EXISTS `jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jobs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `queue` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `attempts` tinyint unsigned NOT NULL,
  `reserved_at` int unsigned DEFAULT NULL,
  `available_at` int unsigned NOT NULL,
  `created_at` int unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `jobs_queue_index` (`queue`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `jobs`
--

LOCK TABLES `jobs` WRITE;
/*!40000 ALTER TABLE `jobs` DISABLE KEYS */;
/*!40000 ALTER TABLE `jobs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `migrations`
--

DROP TABLE IF EXISTS `migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `migrations` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `migration` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `migrations`
--

LOCK TABLES `migrations` WRITE;
/*!40000 ALTER TABLE `migrations` DISABLE KEYS */;
INSERT INTO `migrations` VALUES (1,'0001_01_01_000000_create_users_table',1),(2,'0001_01_01_000001_create_cache_table',1),(3,'0001_01_01_000002_create_jobs_table',1),(4,'2025_10_13_200846_add_role_to_users_table',1),(5,'2025_10_13_201652_create_tasks_table',1),(6,'2025_10_13_201701_create_attachments_table',1),(7,'2025_10_13_213807_create_personal_access_tokens_table',1),(9,'2025_10_16_051945_add_priority_amd_due_date_to_tasks_table',2),(10,'2025_10_24_045845_create_user_preferences_table',3);
/*!40000 ALTER TABLE `migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `password_reset_tokens`
--

DROP TABLE IF EXISTS `password_reset_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `password_reset_tokens`
--

LOCK TABLES `password_reset_tokens` WRITE;
/*!40000 ALTER TABLE `password_reset_tokens` DISABLE KEYS */;
/*!40000 ALTER TABLE `password_reset_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `personal_access_tokens`
--

DROP TABLE IF EXISTS `personal_access_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `personal_access_tokens` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `tokenable_type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tokenable_id` bigint unsigned NOT NULL,
  `name` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `abilities` text COLLATE utf8mb4_unicode_ci,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`),
  KEY `personal_access_tokens_expires_at_index` (`expires_at`)
) ENGINE=InnoDB AUTO_INCREMENT=214 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `personal_access_tokens`
--

LOCK TABLES `personal_access_tokens` WRITE;
/*!40000 ALTER TABLE `personal_access_tokens` DISABLE KEYS */;
INSERT INTO `personal_access_tokens` VALUES (1,'App\\Models\\User',1,'api','571c4204d8e612f7d3809a0e9682b8850ff7ec08d987961f6241b2742ac576bb','[\"*\"]','2025-10-16 00:44:53',NULL,'2025-10-16 00:37:33','2025-10-16 00:44:53'),(2,'App\\Models\\User',1,'api','20a6b06ea4a6fb7f9e426ea235c3ad8dd83a1b8da89cdde70da09c44d0a9ac9d','[\"*\"]','2025-10-16 01:31:59',NULL,'2025-10-16 00:46:16','2025-10-16 01:31:59'),(3,'App\\Models\\User',1,'api','ec9575c3a6a627ad5614d2c0c0a02c6682252c5121ea9910bc8425b885461931','[\"*\"]','2025-10-16 02:32:40',NULL,'2025-10-16 02:31:35','2025-10-16 02:32:40'),(4,'App\\Models\\User',1,'api','be8cf0119e16086621dbbf2c2b9d50b4582a96c9fa388d4bdb75080f29575c08','[\"*\"]','2025-10-16 02:44:44',NULL,'2025-10-16 02:39:49','2025-10-16 02:44:44'),(5,'App\\Models\\User',1,'api','21dc69506718bae8eadc49cc4287c6fcbd240ae26d7b667e9e9508b3bb4e5c19','[\"*\"]','2025-10-16 03:32:29',NULL,'2025-10-16 02:48:46','2025-10-16 03:32:29'),(6,'App\\Models\\User',1,'api','700d0aac174c41e94610b87f4c83b9d9985642e4d22a27d79ee94904dcf42162','[\"*\"]','2025-10-16 03:45:52',NULL,'2025-10-16 03:32:47','2025-10-16 03:45:52'),(7,'App\\Models\\User',1,'api','506603323ff4838eaacb34ceed46c3d7bf18de56c52eb2f802bb46a2ea7f0b61','[\"*\"]','2025-10-16 04:02:01',NULL,'2025-10-16 04:02:01','2025-10-16 04:02:01'),(8,'App\\Models\\User',1,'api','fe2cc200286db3cd6430d9170a637475f40cf82d7014a31b1cb8805ecaf93c50','[\"*\"]','2025-10-16 04:02:19',NULL,'2025-10-16 04:02:01','2025-10-16 04:02:19'),(9,'App\\Models\\User',1,'api','4143f7aae26c4de0386d59584fd0e179ec05f379b79806f863a2577c8256b2b7','[\"*\"]','2025-10-16 04:12:46',NULL,'2025-10-16 04:11:28','2025-10-16 04:12:46'),(10,'App\\Models\\User',1,'api','ca5e998a0fb4eaf2e36c087f7ced9be530153448ff5e89a3e095768dc4d9ba69','[\"*\"]',NULL,NULL,'2025-10-16 04:25:54','2025-10-16 04:25:54'),(11,'App\\Models\\User',1,'api','9753667ba117df9ef98283a6917da6f6ffc21dc08c3dbca434b22e733765bc62','[\"*\"]','2025-10-16 04:25:57',NULL,'2025-10-16 04:25:55','2025-10-16 04:25:57'),(12,'App\\Models\\User',1,'api','b687f7d5d0170c980542ba95c6e9dc64490dd0d8a5252a883cca19c37eea8307','[\"*\"]','2025-10-16 04:54:03',NULL,'2025-10-16 04:26:22','2025-10-16 04:54:03'),(13,'App\\Models\\User',1,'api','82df85ebbada0197ed5eea7f2f1a335e35b49b528029fb8aa1687a6c4608f16e','[\"*\"]','2025-10-16 05:02:35',NULL,'2025-10-16 04:54:16','2025-10-16 05:02:35'),(14,'App\\Models\\User',1,'api','75e14b15a61c92b39e9ab9743615cab3a1f19e3c9014131ac4461bb003f2a6e1','[\"*\"]','2025-10-16 06:31:53',NULL,'2025-10-16 05:38:03','2025-10-16 06:31:53'),(15,'App\\Models\\User',1,'api','3c30434566e1e651557d9c4b16c96498ebf7959ffc20c1c7fcc6e19208a63229','[\"*\"]','2025-10-16 06:26:05',NULL,'2025-10-16 06:25:49','2025-10-16 06:26:05'),(16,'App\\Models\\User',1,'api','0b25206f685a0fe2f781665e65a93822d1cc2ce9862f95bd1688aa4830975c37','[\"*\"]','2025-10-16 21:01:21',NULL,'2025-10-16 20:55:03','2025-10-16 21:01:21'),(17,'App\\Models\\User',1,'api','16cad50018dbd61dc9ab4c1963677ddff4e829326549507ad6151010561db391','[\"*\"]','2025-10-16 22:11:09',NULL,'2025-10-16 21:02:00','2025-10-16 22:11:09'),(18,'App\\Models\\User',1,'api','3b477f27116f068b64608c46a93145c170bf20f86f2cf4cc6561a4e563012326','[\"*\"]','2025-10-24 00:09:13',NULL,'2025-10-16 22:27:13','2025-10-24 00:09:13'),(19,'App\\Models\\User',1,'api','a93d371bc66af43df102baf12011d67d02146378bdaf372d5cf7a420bbf251eb','[\"*\"]','2025-10-17 00:02:03',NULL,'2025-10-16 23:55:49','2025-10-17 00:02:03'),(20,'App\\Models\\User',2,'api','dc2e395f6b7c5c2cc7fc0220eae8efef85a5b34feeef90115ca055d740a3f595','[\"*\"]','2025-10-17 00:04:31',NULL,'2025-10-17 00:04:20','2025-10-17 00:04:31'),(21,'App\\Models\\User',1,'api','b3aa6fe1bfea4a7d9e68551e82bc61dd8b8318d1d1a078515a240468c539b6af','[\"*\"]','2025-10-17 00:12:59',NULL,'2025-10-17 00:05:08','2025-10-17 00:12:59'),(22,'App\\Models\\User',1,'api','1ec34ff0d7fcff9dcfc45e9e2376528240bb706f01c5773d0f00bc44e60eacd6','[\"*\"]','2025-10-17 00:45:26',NULL,'2025-10-17 00:13:14','2025-10-17 00:45:26'),(23,'App\\Models\\User',1,'api','1b4634ed8b12784fccb22ac606c3261c019da87050325c1280419087ed78b55a','[\"*\"]','2025-10-17 00:49:50',NULL,'2025-10-17 00:46:20','2025-10-17 00:49:50'),(24,'App\\Models\\User',1,'api','1b07b24de572ca4ac4f11a8411b7735878b0318849d858fc9a22db85409a3cde','[\"*\"]','2025-10-17 01:11:03',NULL,'2025-10-17 00:50:05','2025-10-17 01:11:03'),(25,'App\\Models\\User',1,'api','ce89e6dda7d1a2855eb6070ad3cd3f92ce7ec814ff0351a24ebd71534581f96e','[\"*\"]','2025-10-17 01:11:34',NULL,'2025-10-17 01:11:25','2025-10-17 01:11:34'),(26,'App\\Models\\User',3,'api','4d42ae4456d84a0941f72b1db8ebb134d3e518887f2704c6ead1391b0f8862ec','[\"*\"]','2025-10-17 01:12:14',NULL,'2025-10-17 01:12:00','2025-10-17 01:12:14'),(27,'App\\Models\\User',1,'api','896ef06599e894e81b8ec3775a75f2929ec6505e1a68657c58dd3260b2d1776f','[\"*\"]','2025-10-17 02:29:09',NULL,'2025-10-17 01:12:25','2025-10-17 02:29:09'),(28,'App\\Models\\User',1,'api','641cb62a1f3ee50e69dcb17c7759e64987640332c54dceb1f251a48b85615904','[\"*\"]','2025-10-17 02:29:24',NULL,'2025-10-17 02:29:17','2025-10-17 02:29:24'),(29,'App\\Models\\User',1,'api','417f87ca3bd71eace215611c163ea4acfc776d2c8f585bb2c1c00754bb0ec304','[\"*\"]','2025-10-17 03:10:12',NULL,'2025-10-17 03:02:31','2025-10-17 03:10:12'),(30,'App\\Models\\User',1,'api','8aee9ac3ba19531a7c0e18f3432906d819d41fe6381ec18a8880d344f3200122','[\"*\"]','2025-10-17 03:40:40',NULL,'2025-10-17 03:10:23','2025-10-17 03:40:40'),(31,'App\\Models\\User',3,'api','ff174787df550b6c3038d71750b92f97955c9282151623403ed94b465100a6fa','[\"*\"]','2025-10-17 03:41:14',NULL,'2025-10-17 03:40:56','2025-10-17 03:41:14'),(32,'App\\Models\\User',1,'api','faefec8b3203485c65b8609225ae34cd80e8b3085c9bdf50b22d5e24a8fd45f2','[\"*\"]','2025-10-17 03:48:21',NULL,'2025-10-17 03:41:33','2025-10-17 03:48:21'),(33,'App\\Models\\User',3,'api','6cff0d474be93a44eb705bdb15b37ce91e23f780b91aa0866d8f002394f951fb','[\"*\"]','2025-10-17 03:55:31',NULL,'2025-10-17 03:49:51','2025-10-17 03:55:31'),(34,'App\\Models\\User',1,'api','0686a7294dbcdd6bd2355119048920727741d080a781c209131cb4ab6741e6ca','[\"*\"]','2025-10-17 03:56:04',NULL,'2025-10-17 03:55:55','2025-10-17 03:56:04'),(35,'App\\Models\\User',3,'api','cdce420c051bd884a63fb9e12dd54eb249c98e80074d63ce1ac0bb267addeaa1','[\"*\"]','2025-10-17 03:57:02',NULL,'2025-10-17 03:56:19','2025-10-17 03:57:02'),(36,'App\\Models\\User',1,'api','77abb3b1d79ea59c6a97b3779543ef7f26c2967d54b70a9afaa7522e5489f19e','[\"*\"]','2025-10-17 04:02:45',NULL,'2025-10-17 03:58:06','2025-10-17 04:02:45'),(37,'App\\Models\\User',1,'api','5c13786fb0f62dddc5e1aa4e23a2a0eff6424621c705f5528ba837c95465d693','[\"*\"]','2025-10-17 04:03:49',NULL,'2025-10-17 04:03:23','2025-10-17 04:03:49'),(38,'App\\Models\\User',1,'api','b26387aeba6eb91b11d2d08bf3514638cdceba3653a37c8b58ab2940d7a6144b','[\"*\"]','2025-10-17 04:10:31',NULL,'2025-10-17 04:04:07','2025-10-17 04:10:31'),(39,'App\\Models\\User',1,'api','1cca7813bc9f1eacb5ee3a7534de9254bf6a24f2f58ad5cdc6efa2f4aa71e752','[\"*\"]','2025-10-17 04:12:42',NULL,'2025-10-17 04:10:46','2025-10-17 04:12:42'),(40,'App\\Models\\User',1,'api','89e4fec70dd803dca46cd6945ee9024326afea5b69b12f2d19851ff97e601955','[\"*\"]','2025-10-17 04:13:58',NULL,'2025-10-17 04:12:52','2025-10-17 04:13:58'),(41,'App\\Models\\User',1,'api','441d3ac4ff75b9531007ff5d0837ab20f09affa810fa97722bd818ee4e707560','[\"*\"]','2025-10-17 04:14:12',NULL,'2025-10-17 04:14:12','2025-10-17 04:14:12'),(42,'App\\Models\\User',1,'api','e9ad8290508155faa0d2a3f2a4f285e6cad846fc1224fd7654ae9a8869272967','[\"*\"]','2025-10-17 04:14:55',NULL,'2025-10-17 04:14:38','2025-10-17 04:14:55'),(43,'App\\Models\\User',1,'api','0f6b8eac7366fafc23eb748d5b2a34dee55970f0601579436aa8c660b3f2bb00','[\"*\"]','2025-10-17 04:16:43',NULL,'2025-10-17 04:15:06','2025-10-17 04:16:43'),(44,'App\\Models\\User',1,'api','3267fde59c21804f0b337bf552bfbfe42deef759909796d69449dc58a684eb24','[\"*\"]','2025-10-17 04:16:59',NULL,'2025-10-17 04:16:59','2025-10-17 04:16:59'),(45,'App\\Models\\User',1,'api','7f663fa283492d5b04d3bf1aebb87151c841593fd77f7435cb7ec8ba1be1c375','[\"*\"]','2025-10-17 04:20:38',NULL,'2025-10-17 04:17:15','2025-10-17 04:20:38'),(46,'App\\Models\\User',1,'api','8dad456077e6a0310f971284bb4bc04492cc9a9899fc7b7b442ff49b14bae309','[\"*\"]','2025-10-17 04:21:47',NULL,'2025-10-17 04:21:47','2025-10-17 04:21:47'),(47,'App\\Models\\User',3,'api','065a8049706158b1b805d5e0f4c299305a0a66e4a5a19903d26b72c247363278','[\"*\"]','2025-10-17 04:22:03',NULL,'2025-10-17 04:22:03','2025-10-17 04:22:03'),(48,'App\\Models\\User',1,'api','b6f966bd97071748d7373b618054cdeead685890ebf5dc9b698685c2c51b284c','[\"*\"]','2025-10-17 04:22:20',NULL,'2025-10-17 04:22:15','2025-10-17 04:22:20'),(49,'App\\Models\\User',1,'api','ef3d96223a5cf60e2544813e4ee45a80a9486694fb32dc0da0138b7231fc9290','[\"*\"]','2025-10-17 04:25:46',NULL,'2025-10-17 04:25:46','2025-10-17 04:25:46'),(50,'App\\Models\\User',3,'api','73571e318854dde540f0f6029c537021a5ca8544d051dc69fed5ed1a4aa678c8','[\"*\"]','2025-10-17 04:26:05',NULL,'2025-10-17 04:26:05','2025-10-17 04:26:05'),(51,'App\\Models\\User',1,'api','41da5598844efc3e2260d4082fe180a6335ab1d511f486bca69258fbff04756a','[\"*\"]','2025-10-17 05:04:44',NULL,'2025-10-17 05:04:43','2025-10-17 05:04:44'),(52,'App\\Models\\User',1,'api','e5a771c6196b12cbaf5830630fde6c2dca09f63f83a56e9fdf098f72c9d7acf9','[\"*\"]','2025-10-17 05:05:18',NULL,'2025-10-17 05:05:18','2025-10-17 05:05:18'),(53,'App\\Models\\User',1,'api','d514c3d68ea9eec04f54009dda7e4f168146149d751f996efcf40c7808848a4f','[\"*\"]','2025-10-17 05:06:44',NULL,'2025-10-17 05:06:44','2025-10-17 05:06:44'),(54,'App\\Models\\User',1,'api','cb53d3a8e38d52fa1b619f3e0d902946630d1ffa5ef2a64759e710bffb70ac06','[\"*\"]','2025-10-17 05:24:40',NULL,'2025-10-17 05:12:40','2025-10-17 05:24:40'),(55,'App\\Models\\User',1,'api','f380ff2a2828e34fe2111d7c4235d53d34d75004b182be6c0142ae7092816606','[\"*\"]','2025-10-17 05:28:17',NULL,'2025-10-17 05:25:01','2025-10-17 05:28:17'),(56,'App\\Models\\User',1,'api','db64205629a2f678a7e5f1b4cf5370153ae5aeeb957b46f73b7f11dcc42bc2ef','[\"*\"]','2025-10-17 05:31:25',NULL,'2025-10-17 05:28:29','2025-10-17 05:31:25'),(57,'App\\Models\\User',1,'api','9adccd40759c65b75cf1c1f617a44783d7d42fe94f1b6f977df06284a93aa2cb','[\"*\"]','2025-10-17 05:32:53',NULL,'2025-10-17 05:31:46','2025-10-17 05:32:53'),(58,'App\\Models\\User',1,'api','ddd1fff75756b318fc020de28b9ca9deafd59cf042d5419ef9cafe5808079cf0','[\"*\"]','2025-10-17 05:33:11',NULL,'2025-10-17 05:33:11','2025-10-17 05:33:11'),(59,'App\\Models\\User',1,'api','67c52932578d3237efe4c5b54a9cc715d419cad4d7a9845df60bbf63204c9dd2','[\"*\"]',NULL,NULL,'2025-10-17 05:46:40','2025-10-17 05:46:40'),(60,'App\\Models\\User',1,'api','3c179b2efd7785fa938656cbd27e239ccb21624eb65ceb2c6e7980c172d0319e','[\"*\"]','2025-10-17 05:49:37',NULL,'2025-10-17 05:49:37','2025-10-17 05:49:37'),(61,'App\\Models\\User',1,'api','5212182c1d9bc772e11f88245cf84e15b97b42c8ab2653f41bfe21aa33d672cf','[\"*\"]','2025-10-17 05:58:22',NULL,'2025-10-17 05:58:22','2025-10-17 05:58:22'),(62,'App\\Models\\User',1,'api','b21f1734c04d8809c3dbe126fc2cae74583bae325e4afe02ec89c68c56e9354e','[\"*\"]','2025-10-19 13:55:15',NULL,'2025-10-17 06:07:35','2025-10-19 13:55:15'),(63,'App\\Models\\User',1,'api','9e2c9609a7ad80adfc71ca927b7c0505fafb4681ad1b54781fdeaa8959002ca2','[\"*\"]','2025-10-19 13:55:50',NULL,'2025-10-19 13:55:49','2025-10-19 13:55:50'),(64,'App\\Models\\User',1,'api','25a9dba7671b97e57dda20b62309cf5ff12193102647a8135a375b8fec81717d','[\"*\"]','2025-10-19 14:01:36',NULL,'2025-10-19 14:01:36','2025-10-19 14:01:36'),(65,'App\\Models\\User',1,'api','565d1bde98a11f6ad98edfe0685d1c17d3ec220ab8cb182fb77be2ddb1e6bfe8','[\"*\"]','2025-10-19 14:23:52',NULL,'2025-10-19 14:13:30','2025-10-19 14:23:52'),(66,'App\\Models\\User',3,'api','a6f9c39858d4cc6199092f1f8793bf18494ed39d5036e62852a5bf2f891ec71e','[\"*\"]','2025-10-19 14:24:34',NULL,'2025-10-19 14:24:34','2025-10-19 14:24:34'),(67,'App\\Models\\User',1,'api','74d25cccbb379ad789734ac299bc515198e709e4ba45c4c2f77f8467a58eeeed','[\"*\"]','2025-10-19 14:34:49',NULL,'2025-10-19 14:25:06','2025-10-19 14:34:49'),(68,'App\\Models\\User',1,'api','501dc8face614a9113ad139a03cab9fbb5be8a9b1fd3d1c10322f63db54f9185','[\"*\"]','2025-10-19 14:37:49',NULL,'2025-10-19 14:37:08','2025-10-19 14:37:49'),(69,'App\\Models\\User',3,'api','1aeb70c40010bec14af8848f2183eeabcaea49bca948dc3ab968d5ff80b14726','[\"*\"]','2025-10-19 14:38:01',NULL,'2025-10-19 14:38:01','2025-10-19 14:38:01'),(70,'App\\Models\\User',1,'api','ec907bcd537aeba2d59eb09257847818fe4485bc5db6e2974b022ac47043f372','[\"*\"]','2025-10-19 14:53:11',NULL,'2025-10-19 14:38:19','2025-10-19 14:53:11'),(71,'App\\Models\\User',1,'api','0b14d83154e6974b64e582de4d88756aa8ba29a76d1968eacb7503d7ede5f236','[\"*\"]','2025-10-19 15:03:49',NULL,'2025-10-19 14:53:36','2025-10-19 15:03:49'),(72,'App\\Models\\User',1,'api','dcc8e2ba7635d1db18f6a496c74727375a7d9c8c8cee64aaa5201baf4731cfc8','[\"*\"]','2025-10-19 15:08:44',NULL,'2025-10-19 15:04:57','2025-10-19 15:08:44'),(73,'App\\Models\\User',1,'api','f99083d76959caf51ff0f71d4a6ebed4db96228b6ce333e976b8cc527b1d6485','[\"*\"]','2025-10-19 15:17:16',NULL,'2025-10-19 15:09:46','2025-10-19 15:17:16'),(74,'App\\Models\\User',3,'api','4727ea7459bf24ad5e38b4e171ef5a94b535e8730dbb2029e890a32aa0a635ee','[\"*\"]','2025-10-19 15:31:10',NULL,'2025-10-19 15:31:03','2025-10-19 15:31:10'),(75,'App\\Models\\User',1,'api','847eb58b61aae308d3ba7b7f99606c3c38818aa4397b6bfa37a9df0eb2d82631','[\"*\"]','2025-10-19 15:33:47',NULL,'2025-10-19 15:31:23','2025-10-19 15:33:47'),(76,'App\\Models\\User',1,'api','1df9856bb39bcaad3805c547399c230d8fe4b7244909b1856bac9b04ff0c502f','[\"*\"]','2025-10-19 15:37:10',NULL,'2025-10-19 15:37:10','2025-10-19 15:37:10'),(77,'App\\Models\\User',1,'api','03c15e6be9f8cb420479d2e1bc4348fbea0e4f6e919b3c4bfd9cc81f6d0500f3','[\"*\"]','2025-10-19 15:41:15',NULL,'2025-10-19 15:41:02','2025-10-19 15:41:15'),(78,'App\\Models\\User',1,'api','178ea3b4485df8076ff743988ff8fb47ba7858cdf1658fa0a6de249211fbe7f9','[\"*\"]','2025-10-19 22:02:16',NULL,'2025-10-19 21:48:23','2025-10-19 22:02:16'),(79,'App\\Models\\User',1,'api','7b0cb665300a131de41a354f82402fced01cb0db7a3150b249ccc0980e6622d8','[\"*\"]','2025-10-19 22:04:46',NULL,'2025-10-19 22:02:31','2025-10-19 22:04:46'),(80,'App\\Models\\User',1,'api','b61b13d005fa9c158bf753b95b75384ea37052adf4860c5caba24cb031841443','[\"*\"]','2025-10-19 22:07:08',NULL,'2025-10-19 22:07:07','2025-10-19 22:07:08'),(81,'App\\Models\\User',1,'api','00e039a4725c75eadb5f8976965782471e696a2c95287574470ad7dab9f70f28','[\"*\"]','2025-10-19 22:10:46',NULL,'2025-10-19 22:07:21','2025-10-19 22:10:46'),(82,'App\\Models\\User',1,'api','c5cae2abe9a1aa6b1461c3a7bf52529c9cc51dcd809af28e57fda1881678064b','[\"*\"]','2025-10-19 22:11:12',NULL,'2025-10-19 22:11:01','2025-10-19 22:11:12'),(83,'App\\Models\\User',1,'api','aef65d280c5bdc25d02478aaa9222e7c214b6df15933fbadc063942955c89f82','[\"*\"]','2025-10-19 23:43:36',NULL,'2025-10-19 22:11:30','2025-10-19 23:43:36'),(84,'App\\Models\\User',1,'api','49ea6fbc6bd394ec66155c136824648936e49336c503cc0345cdac670b812c31','[\"*\"]','2025-10-20 00:01:21',NULL,'2025-10-19 23:44:20','2025-10-20 00:01:21'),(85,'App\\Models\\User',1,'api','119680dc2076095e164e960de115408cb1927af9cd9e3c179b0d36041845dd24','[\"*\"]','2025-10-20 00:50:52',NULL,'2025-10-20 00:01:38','2025-10-20 00:50:52'),(86,'App\\Models\\User',4,'api','748cdcb182faead55b2b10ff4e0e3f780e8d0ea794eaa03ec50c105f232b72d8','[\"*\"]','2025-10-20 00:53:01',NULL,'2025-10-20 00:51:59','2025-10-20 00:53:01'),(87,'App\\Models\\User',4,'api','36df36dcfaf6015c8000e106cf0c3383c7e3501e2de30a75ca6208430e9ec786','[\"*\"]','2025-10-20 00:54:49',NULL,'2025-10-20 00:54:29','2025-10-20 00:54:49'),(88,'App\\Models\\User',5,'api','de3efca775517a0558fc6361c211299384bd89b8884728df8ece144be184fb7a','[\"*\"]','2025-10-20 01:07:52',NULL,'2025-10-20 00:59:06','2025-10-20 01:07:52'),(89,'App\\Models\\User',1,'api','1d4e81d64d23cba120fec68c8ba747fc4a33b3a4966a8e14464b8bf0c049a323','[\"*\"]','2025-10-20 03:20:07',NULL,'2025-10-20 01:08:05','2025-10-20 03:20:07'),(90,'App\\Models\\User',4,'api','f543c0144c8dc9354f980990332cad437f94b8faa965069fe89d8488cca00637','[\"*\"]','2025-10-20 03:27:57',NULL,'2025-10-20 03:20:23','2025-10-20 03:27:57'),(91,'App\\Models\\User',4,'api','c1471d709bbcc4f94270b9d5fa156b6616856375317580cdf3ff2291ec05a863','[\"*\"]','2025-10-20 03:29:52',NULL,'2025-10-20 03:28:13','2025-10-20 03:29:52'),(92,'App\\Models\\User',4,'api','485e1de53696e672d404cdc8375933f72559d9352a022d3f899ead081a5d6c17','[\"*\"]','2025-10-20 03:32:47',NULL,'2025-10-20 03:30:10','2025-10-20 03:32:47'),(93,'App\\Models\\User',1,'api','ec0bc6c8a06db1ed5473620b0ca5598c162b47737db0f5b22d31f35e0b40173b','[\"*\"]','2025-10-20 03:54:26',NULL,'2025-10-20 03:54:20','2025-10-20 03:54:26'),(94,'App\\Models\\User',1,'api','0d059e3dd196f01e0537b696b7ab8f55e935f9d9514d6cce4dcb66f92ccf0c04','[\"*\"]','2025-10-20 04:02:08',NULL,'2025-10-20 03:55:24','2025-10-20 04:02:08'),(95,'App\\Models\\User',1,'api','dac4123660d7a8acda36107f0d5ccce463bd9ec8f63e45d9a02a2cd457cd2c07','[\"*\"]','2025-10-20 04:03:02',NULL,'2025-10-20 04:02:58','2025-10-20 04:03:02'),(96,'App\\Models\\User',1,'api','a7dd44840f10d6d5720a17e986e175eeb76b5f52922241420abddeab95c1d78b','[\"*\"]','2025-10-20 04:03:55',NULL,'2025-10-20 04:03:52','2025-10-20 04:03:55'),(97,'App\\Models\\User',1,'api','416e09640258890b233453dca1392612e50d9a3fca4a5dff64ba220d600af506','[\"*\"]','2025-10-20 04:04:16',NULL,'2025-10-20 04:04:13','2025-10-20 04:04:16'),(98,'App\\Models\\User',1,'api','fcee1d6c2dab37bbf35c7bb1bf0da627155181722e68650d6d82625e144bc701','[\"*\"]','2025-10-20 04:07:51',NULL,'2025-10-20 04:06:54','2025-10-20 04:07:51'),(99,'App\\Models\\User',1,'api','842ec880efdce714aad8d0830c1693ce982ec6ac4381f1035cc7d44f071dfe33','[\"*\"]','2025-10-20 04:09:56',NULL,'2025-10-20 04:08:11','2025-10-20 04:09:56'),(100,'App\\Models\\User',1,'api','2d70e3257abb604a6328b85e2436f3b661e20c47c49ad27b1529b861bc297f58','[\"*\"]','2025-10-20 04:10:42',NULL,'2025-10-20 04:10:14','2025-10-20 04:10:42'),(101,'App\\Models\\User',1,'api','21c29da1a44af6472cdcff8059c65d4af2a066ff89a1cbf8dd9bc7644c1b4e43','[\"*\"]','2025-10-20 04:15:45',NULL,'2025-10-20 04:11:06','2025-10-20 04:15:45'),(102,'App\\Models\\User',1,'api','3fa0676fe316caa1ccfa51e08a1bf8493244bbf1c3e62a71eceb2aac413e4098','[\"*\"]','2025-10-20 04:17:15',NULL,'2025-10-20 04:16:08','2025-10-20 04:17:15'),(103,'App\\Models\\User',1,'api','a7cf558de122443ee5850a16ceedcc367971e17c00253d593258dbb2441c912c','[\"*\"]','2025-10-20 04:18:13',NULL,'2025-10-20 04:17:33','2025-10-20 04:18:13'),(104,'App\\Models\\User',1,'api','9fe0d1dc9a9d6504f164642df0d35cabe8dc43cdaf0f8bd877f34344887fa3bd','[\"*\"]','2025-10-20 04:19:43',NULL,'2025-10-20 04:18:27','2025-10-20 04:19:43'),(105,'App\\Models\\User',6,'api','9a99e855d7bb38e89db0ae46340058107e673bfa23660f9105c09354ae92927e','[\"*\"]','2025-10-20 04:21:23',NULL,'2025-10-20 04:20:41','2025-10-20 04:21:23'),(106,'App\\Models\\User',1,'api','d0cc51b3507d629e7b4f676881466bf53a9a61c1c93fdd382dbd631db7373c4e','[\"*\"]','2025-10-20 04:28:54',NULL,'2025-10-20 04:21:33','2025-10-20 04:28:54'),(107,'App\\Models\\User',1,'api','14b1515168cd304355603631e8cf3c0bb2c9d75fbd1cbfdb4db3ef2dfe2943e3','[\"*\"]','2025-10-20 05:04:49',NULL,'2025-10-20 04:30:39','2025-10-20 05:04:49'),(108,'App\\Models\\User',1,'api','d884bf3adbb6e273eef97cf93e4708dc7eded66eb0e79b0dd436906663ae5055','[\"*\"]','2025-10-20 06:02:36',NULL,'2025-10-20 05:05:02','2025-10-20 06:02:36'),(109,'App\\Models\\User',1,'api','6d4431b0349274e5f4060e5e4818efec153382f35b181ed30d41d8dba3fc7053','[\"*\"]',NULL,NULL,'2025-10-20 05:15:01','2025-10-20 05:15:01'),(110,'App\\Models\\User',1,'api','35b11109c696a661efb4b484503029536c020a9e525e3a870b4b6c11cce6079a','[\"*\"]',NULL,NULL,'2025-10-20 05:15:11','2025-10-20 05:15:11'),(111,'App\\Models\\User',1,'api','bca3e006bc9df8b881fc723b50cddd917c02d668400b8d309367d29854ef06a6','[\"*\"]',NULL,NULL,'2025-10-20 05:51:00','2025-10-20 05:51:00'),(112,'App\\Models\\User',3,'api','afc3f676191d76efe48e6df22360e7dce06bcf12dd40e989013d194da594c636','[\"*\"]','2025-10-20 06:03:28',NULL,'2025-10-20 06:03:24','2025-10-20 06:03:28'),(113,'App\\Models\\User',1,'api','8320956bfc86059757b7ec980d16a15a33a280eb360d14d0463799a7d8d8b291','[\"*\"]','2025-10-20 06:17:32',NULL,'2025-10-20 06:04:05','2025-10-20 06:17:32'),(114,'App\\Models\\User',1,'api','f3b1c06b1bb9923d2a7f2a4f167fc449f552780a168ba58155f2dd85686c0a75','[\"*\"]','2025-10-20 06:17:56',NULL,'2025-10-20 06:17:48','2025-10-20 06:17:56'),(115,'App\\Models\\User',1,'api','60c479bc232b43602763ae83e61c4028d3ea98b0b96b7ead8177283ae57dab18','[\"*\"]','2025-10-20 06:22:42',NULL,'2025-10-20 06:20:51','2025-10-20 06:22:42'),(116,'App\\Models\\User',1,'api','77c432ce790a8a403d1b67d58f26bf378f7a75c4296bc0b0108a68360102e367','[\"*\"]','2025-10-20 06:25:13',NULL,'2025-10-20 06:22:58','2025-10-20 06:25:13'),(117,'App\\Models\\User',1,'api','bf3f71aec7a222812693556fdc93d6a8d4ee595f4073248df2f625a3295610d9','[\"*\"]','2025-10-20 06:31:19',NULL,'2025-10-20 06:31:19','2025-10-20 06:31:19'),(118,'App\\Models\\User',4,'api','d392aff75dd77f3db244f374a5c35a632201157bb6b5b467bb7f9da2a6606307','[\"*\"]','2025-10-20 06:52:50',NULL,'2025-10-20 06:52:50','2025-10-20 06:52:50'),(119,'App\\Models\\User',4,'api','fe3cf49d8e3b5becd8c6416c373a347f7ec48557ac21414835b02a57628e165b','[\"*\"]','2025-10-20 20:06:29',NULL,'2025-10-20 06:53:35','2025-10-20 20:06:29'),(120,'App\\Models\\User',1,'api','20767104a0d9c879b62d55162e0b23bdaf9c980a5df9d87e05315394046ebad0','[\"*\"]','2025-10-20 22:21:42',NULL,'2025-10-20 22:18:16','2025-10-20 22:21:42'),(121,'App\\Models\\User',1,'api','2feef3fb848a83a9ce1f34d0c5a734a8ecf9fd7ced1ec6c8a3a09ffbf20b0a40','[\"*\"]','2025-10-20 23:17:47',NULL,'2025-10-20 23:17:26','2025-10-20 23:17:47'),(122,'App\\Models\\User',1,'api','db1049696fc3f68ce5b0d27240db2a4d2d7533059ffdc3e3ca2cbbe4920cc1a3','[\"*\"]','2025-10-20 23:18:30',NULL,'2025-10-20 23:18:30','2025-10-20 23:18:30'),(123,'App\\Models\\User',1,'api','f4f8dc5995f84ee286a4b0f017f72fcca6b9c81b5659832aff88b87a83f7517d','[\"*\"]','2025-10-20 23:29:55',NULL,'2025-10-20 23:29:43','2025-10-20 23:29:55'),(124,'App\\Models\\User',1,'api','a531abe5ca1b4d4ad2769320378f7057cb2dfde1cf5e52b96ca52dcdf9aa181d','[\"*\"]','2025-10-20 23:34:02',NULL,'2025-10-20 23:30:22','2025-10-20 23:34:02'),(125,'App\\Models\\User',1,'api','e3418bdeb033db0457658e03199c7507850ee5c9dcffcef063a073bae69a2145','[\"*\"]','2025-10-20 23:34:50',NULL,'2025-10-20 23:34:10','2025-10-20 23:34:50'),(126,'App\\Models\\User',1,'api','2e25ecb72d2fb17703ae47109097f58d89c16fd7d5421b725918f919c0a27b68','[\"*\"]','2025-10-20 23:37:43',NULL,'2025-10-20 23:35:02','2025-10-20 23:37:43'),(127,'App\\Models\\User',1,'api','a1ff43557d8ebf8d37cf8a6f1e492093bd6aecc1cda3f125889a47049ee8a3a3','[\"*\"]','2025-10-20 23:37:51',NULL,'2025-10-20 23:37:51','2025-10-20 23:37:51'),(128,'App\\Models\\User',1,'api','86f851d2566768e131818bf9ea45552f28c6d071b16ec8a5f761f9c65e3fc9b7','[\"*\"]','2025-10-20 23:38:15',NULL,'2025-10-20 23:38:14','2025-10-20 23:38:15'),(129,'App\\Models\\User',1,'api','4bd3a2dba196e305a2b170ed3a1b38530297f61f7c14a876bb4ac45308f12a7d','[\"*\"]','2025-10-20 23:40:04',NULL,'2025-10-20 23:40:04','2025-10-20 23:40:04'),(130,'App\\Models\\User',1,'api','44288af693dd18082ba0620ddb1db6115ffcf5629506df19917b6a013b7538f3','[\"*\"]','2025-10-20 23:48:34',NULL,'2025-10-20 23:41:08','2025-10-20 23:48:34'),(131,'App\\Models\\User',1,'api','5accf2b56c7785f0c75afe4328f0eaeeb4293000bc0b1b4903ac0c06682189c2','[\"*\"]','2025-10-20 23:55:18',NULL,'2025-10-20 23:48:45','2025-10-20 23:55:18'),(132,'App\\Models\\User',1,'api','d50f92ead6a1a265475260f59b413baff010ab4bcb84de988f66db783e0af45a','[\"*\"]','2025-10-20 23:56:14',NULL,'2025-10-20 23:55:34','2025-10-20 23:56:14'),(133,'App\\Models\\User',3,'api','3ae4c9dc6bde4b84b79c04abb09735002b5c13ac77df00706a15f39802bcccbd','[\"*\"]','2025-10-20 23:56:57',NULL,'2025-10-20 23:56:57','2025-10-20 23:56:57'),(134,'App\\Models\\User',3,'api','889d3966ec2390286f82b74d5296bab6ec456fa6b51b4d28ecdd8b9d229a8884','[\"*\"]','2025-10-20 23:57:42',NULL,'2025-10-20 23:57:30','2025-10-20 23:57:42'),(135,'App\\Models\\User',1,'api','ca86f3823270a57a86c7f26e7cac90e579f6d9b531a30eb5f1b286414b83e7c5','[\"*\"]','2025-10-20 23:58:34',NULL,'2025-10-20 23:58:22','2025-10-20 23:58:34'),(136,'App\\Models\\User',3,'api','ddd1777b3dbf2c3c2ed0d2e706e1887815221b356e1930292ad331739efe5cfa','[\"*\"]','2025-10-21 00:00:03',NULL,'2025-10-20 23:58:47','2025-10-21 00:00:03'),(137,'App\\Models\\User',1,'api','ffb5a689785eb89a7fdee84bd0a94f9149f1c5bc3f3de7e38eca7c712ac1eb78','[\"*\"]','2025-10-21 00:00:16',NULL,'2025-10-21 00:00:12','2025-10-21 00:00:16'),(138,'App\\Models\\User',1,'api','a5778c8deefccd0745243c6a709de18f3c2541cc43611799261ba3798434fca9','[\"*\"]','2025-10-21 00:00:55',NULL,'2025-10-21 00:00:45','2025-10-21 00:00:55'),(139,'App\\Models\\User',3,'api','2d5a013ee23b842d9ea6d7bf8eeb73345f375f158ef8fc2b0b927e56dea48c3a','[\"*\"]','2025-10-21 00:44:31',NULL,'2025-10-21 00:44:31','2025-10-21 00:44:31'),(140,'App\\Models\\User',1,'api','6966ba3898bcd067947915640df4de2e20f7a1239b59b1ff7f8850ba1271806a','[\"*\"]','2025-10-21 00:44:51',NULL,'2025-10-21 00:44:43','2025-10-21 00:44:51'),(141,'App\\Models\\User',1,'api','10946cff2f44f4fc96cda232d1ef47b313eb64cbb4e1df3b919802c51671e60b','[\"*\"]','2025-10-21 03:06:44',NULL,'2025-10-21 01:12:39','2025-10-21 03:06:44'),(142,'App\\Models\\User',1,'api','53253f3eea9b540a750bd812500e77bcdc5899066cdc09ebcd0eabe3971f3520','[\"*\"]','2025-10-21 03:22:26',NULL,'2025-10-21 03:07:03','2025-10-21 03:22:26'),(143,'App\\Models\\User',1,'api','2cb16af65d2ee87f969483c31a7e6b2126731f8e52ad96ad8ead66d2b0e00854','[\"*\"]','2025-10-21 03:31:49',NULL,'2025-10-21 03:22:57','2025-10-21 03:31:49'),(144,'App\\Models\\User',1,'api','0dc1ede8de043f042d3d80fb3aa95e611ea49df04e0361c2709ab1e7d9db8085','[\"*\"]','2025-10-21 03:33:32',NULL,'2025-10-21 03:33:25','2025-10-21 03:33:32'),(145,'App\\Models\\User',1,'api','efc2322d4ed069b5eb0541b1102e4cbfbfda2e66bfb8c73c6ab3cf17c803513e','[\"*\"]','2025-10-21 03:56:25',NULL,'2025-10-21 03:35:09','2025-10-21 03:56:25'),(146,'App\\Models\\User',1,'api','bc1b08933ded0f8639223293c9a5d007278017afedac97c5fccaf502f8f83767','[\"*\"]','2025-10-21 03:57:46',NULL,'2025-10-21 03:56:43','2025-10-21 03:57:46'),(147,'App\\Models\\User',1,'api','e4d74f1dda78cb59b19ce3323bedc04c3bd0fad917aee7bdb67c9be04977f30a','[\"*\"]','2025-10-21 04:09:09',NULL,'2025-10-21 04:00:48','2025-10-21 04:09:09'),(148,'App\\Models\\User',1,'api','9c26b1cecbe6f98f1e566dbd8951ac661f254e74541a3ad20694b2d39356462a','[\"*\"]','2025-10-21 05:00:35',NULL,'2025-10-21 04:23:04','2025-10-21 05:00:35'),(149,'App\\Models\\User',1,'api','2158db8ee18a7cc9bc3983d9fa954767d778b57280ff6c855599ba70b084638f','[\"*\"]','2025-10-21 05:11:30',NULL,'2025-10-21 05:00:51','2025-10-21 05:11:30'),(150,'App\\Models\\User',1,'api','9419e82840e4833de2915b2c0bc93190f082055c6df524e264208e7da9d85258','[\"*\"]','2025-10-21 05:19:23',NULL,'2025-10-21 05:12:28','2025-10-21 05:19:23'),(151,'App\\Models\\User',1,'api','827a47b54850095b57245aebb102ce7848903561e0fd127e0cea6d9748f826d5','[\"*\"]','2025-10-21 05:19:53',NULL,'2025-10-21 05:19:35','2025-10-21 05:19:53'),(152,'App\\Models\\User',1,'api','6b038b7c1e614ddf217fb8bb1cbff6c19c8b6e079232957e016c1c152b6218cc','[\"*\"]','2025-10-21 05:22:02',NULL,'2025-10-21 05:20:43','2025-10-21 05:22:02'),(153,'App\\Models\\User',4,'api','ff82a0a1d10e35caaae50df8d72f3c8099f906069cad21148313e17acb3b9b5d','[\"*\"]','2025-10-21 05:23:00',NULL,'2025-10-21 05:22:34','2025-10-21 05:23:00'),(154,'App\\Models\\User',1,'api','514cf1b9b2ebde02e8d4a435e4ce02c5f3ec3ddf647d9170254cc86de716c013','[\"*\"]','2025-10-21 05:42:42',NULL,'2025-10-21 05:23:13','2025-10-21 05:42:42'),(155,'App\\Models\\User',1,'api','56e278165f4719f621ab3dfdef5bc5dd295a17b89b99f434752f4194596f6132','[\"*\"]','2025-10-21 05:26:07',NULL,'2025-10-21 05:25:53','2025-10-21 05:26:07'),(156,'App\\Models\\User',1,'api','cf40281fa131578c526bff533adaad5ecc065266f87734ba2d2d301fd5af8535','[\"*\"]','2025-10-21 05:53:53',NULL,'2025-10-21 05:43:20','2025-10-21 05:53:53'),(157,'App\\Models\\User',1,'api','dff9d78027231c4bb9ff21d15b8822352db210c10adc977947f78ab93064e3fe','[\"*\"]','2025-10-21 05:55:31',NULL,'2025-10-21 05:54:03','2025-10-21 05:55:31'),(158,'App\\Models\\User',1,'api','b82bf7d1301083f849d48d8a23c2c99931b56b5b92e439bd65e65d640269404e','[\"*\"]','2025-10-21 05:56:22',NULL,'2025-10-21 05:55:41','2025-10-21 05:56:22'),(159,'App\\Models\\User',1,'api','b5f7bc37cacc344daf7d0b35da5ee56148254f945e5ceb549009226b879fae88','[\"*\"]','2025-10-21 05:57:06',NULL,'2025-10-21 05:56:58','2025-10-21 05:57:06'),(160,'App\\Models\\User',1,'api','ce7594dbd6b85559455b6157cc819e7d2894f1a6bf74edd618a6065327e1c8b5','[\"*\"]','2025-10-21 05:57:18',NULL,'2025-10-21 05:57:18','2025-10-21 05:57:18'),(161,'App\\Models\\User',4,'api','4581605d0b713fe3fa6acec2c3520698fb8d7e9fed45d3de39635b4ea6be54d1','[\"*\"]','2025-10-21 05:57:31',NULL,'2025-10-21 05:57:31','2025-10-21 05:57:31'),(162,'App\\Models\\User',1,'api','4472808b553b64e2d63daa8e293d15ff3e0890c7564435db77ac603f92aac0ee','[\"*\"]','2025-10-21 06:01:40',NULL,'2025-10-21 05:57:46','2025-10-21 06:01:40'),(163,'App\\Models\\User',3,'api','9f1540465cb90ee97efe60712e6d27bc5216382c8f845a92ac6f3d8a6b093ddc','[\"*\"]','2025-10-21 06:01:54',NULL,'2025-10-21 06:01:54','2025-10-21 06:01:54'),(164,'App\\Models\\User',1,'api','5b55fba07dbd6d8c54be77a4b53efe70f539d88fb1218a5ec3ac740d01190122','[\"*\"]','2025-10-21 06:02:17',NULL,'2025-10-21 06:02:09','2025-10-21 06:02:17'),(165,'App\\Models\\User',4,'api','e5143aa9a438108bd9203d2facb0adc873212dba0a1b6c643e85438f2f410f89','[\"*\"]','2025-10-21 06:03:14',NULL,'2025-10-21 06:02:41','2025-10-21 06:03:14'),(166,'App\\Models\\User',1,'api','425b3aca53176a64d09028e2d08a245fd7bdd87956c4175b11971a84f848c3ff','[\"*\"]','2025-10-21 06:23:58',NULL,'2025-10-21 06:03:24','2025-10-21 06:23:58'),(167,'App\\Models\\User',1,'api','0f4b0280f4b643d2d7d25ae5b4db18bead93fff0e95d9643c83dad9535ca1009','[\"*\"]','2025-10-21 22:08:20',NULL,'2025-10-21 06:34:58','2025-10-21 22:08:20'),(168,'App\\Models\\User',1,'api','120d10d358772c4c93cb8587c126e7ebf4ff7f7e940536d0b17a54b9cc34016f','[\"*\"]','2025-10-21 22:09:28',NULL,'2025-10-21 22:09:18','2025-10-21 22:09:28'),(169,'App\\Models\\User',1,'api','8263018b030a035feff6830915df4c13ba1ac5332b13a3d6d08027a75c71b6cf','[\"*\"]','2025-10-21 23:39:20',NULL,'2025-10-21 23:17:17','2025-10-21 23:39:20'),(170,'App\\Models\\User',1,'api','423991394cdc02d5a0f0247c977cf780f25f1d96b84ded5fa9808caddb5048fa','[\"*\"]','2025-10-22 00:38:52',NULL,'2025-10-22 00:38:35','2025-10-22 00:38:52'),(171,'App\\Models\\User',1,'api','176b0ce42b23f05c77a5405b5b4ec63f9bb174a232a62969f0cbcb14c3e825c4','[\"*\"]','2025-10-22 04:17:01',NULL,'2025-10-22 02:59:25','2025-10-22 04:17:01'),(172,'App\\Models\\User',1,'api','ffa8f00908b13ca644ce2966e5c7cf96cc267fec973c5003cd5058127d8e6211','[\"*\"]','2025-10-22 22:49:31',NULL,'2025-10-22 04:17:12','2025-10-22 22:49:31'),(173,'App\\Models\\User',3,'api','471aff4558195ddc739a55d3377b2b32ba00fdead5d3510defe00efaa57eee3a','[\"*\"]','2025-10-22 22:56:59',NULL,'2025-10-22 22:56:14','2025-10-22 22:56:59'),(174,'App\\Models\\User',1,'api','534397b62802fde9046efc48b96b61b1bb4181576d04eaaa6c5f4ea590664109','[\"*\"]','2025-10-23 06:02:18',NULL,'2025-10-22 22:57:09','2025-10-23 06:02:18'),(175,'App\\Models\\User',3,'api','4eadfd893db924246e0db9cbf5f7d97846c7e5833cfc6f42c152acbb06f33977','[\"*\"]','2025-10-23 06:03:18',NULL,'2025-10-23 06:02:30','2025-10-23 06:03:18'),(176,'App\\Models\\User',1,'api','76e22c34c472d9f1c497b7ed0c620928cd8eb41fd9b981851d0e519e0266fa40','[\"*\"]','2025-10-23 06:30:46',NULL,'2025-10-23 06:03:35','2025-10-23 06:30:46'),(177,'App\\Models\\User',3,'api','86c3db421bc09b2a1b7b5237b71a9959ef8619462a584617ef0d2d9fe3b9343f','[\"*\"]','2025-10-23 06:39:45',NULL,'2025-10-23 06:31:03','2025-10-23 06:39:45'),(178,'App\\Models\\User',3,'api','b16fb1c133fc944a1c3c9d62d1edee39634ccdcab527dde9c52c354b20eee27c','[\"*\"]','2025-10-23 21:37:37',NULL,'2025-10-23 06:39:57','2025-10-23 21:37:37'),(179,'App\\Models\\User',1,'api','23e55267f4c4f43ae4b234e29a1df622ded0505ae4abf7f34a1167f34ee2c1de','[\"*\"]','2025-10-24 03:59:37',NULL,'2025-10-23 21:37:59','2025-10-24 03:59:37'),(180,'App\\Models\\User',7,'api','9c27dd22b71abd4ec95319a55e3955d96c35e07238cfe6f281520d3ce06d8456','[\"*\"]','2025-10-24 04:19:09',NULL,'2025-10-24 04:16:53','2025-10-24 04:19:09'),(181,'App\\Models\\User',1,'api','98b8d0630375f3f08f6e29b10d7fd774a36e4f4f4225906882f965e3f819f10e','[\"*\"]','2025-10-24 06:20:20',NULL,'2025-10-24 06:20:20','2025-10-24 06:20:20'),(182,'App\\Models\\User',1,'api','d3bdf531ec5582bce40bfdf91bc1343bbec9ca5506209b77656cd4d4051d793c','[\"*\"]','2025-10-26 23:51:43',NULL,'2025-10-26 21:37:13','2025-10-26 23:51:43'),(183,'App\\Models\\User',7,'api','727a0ccb9825a44dfc32a3f58d4c6ca8cd5ad3b512220edfe4fbe83c94b48a20','[\"*\"]','2025-10-27 05:25:20',NULL,'2025-10-27 02:42:53','2025-10-27 05:25:20'),(184,'App\\Models\\User',1,'api','f565048b1c0045f898f8a55fbc9a76e7e035a016ba2e7fabdc4c7ed745677b8d','[\"*\"]','2025-10-27 12:42:46',NULL,'2025-10-27 05:27:32','2025-10-27 12:42:46'),(185,'App\\Models\\User',1,'api','99bbafa4865fb5af6ddb5272c795ea82c071e05ab9dbd14e5502d596d83010d4','[\"*\"]','2025-10-31 04:22:54',NULL,'2025-10-27 05:38:51','2025-10-31 04:22:54'),(186,'App\\Models\\User',1,'api','6015b5bccdc44c5962d7c93422f0fe5c51aa70e3fb79cabf1e08dab2514c2e6f','[\"*\"]','2025-10-27 13:10:11',NULL,'2025-10-27 12:43:09','2025-10-27 13:10:11'),(187,'App\\Models\\User',1,'api','16d40f03c819d0b4fe1530a24b390632aa87cc06b63780040be8c69b40d57c76','[\"*\"]','2025-10-28 06:06:35',NULL,'2025-10-27 13:21:59','2025-10-28 06:06:35'),(188,'App\\Models\\User',1,'api','040f8f11d37423562183a885b1da855ead72bac714aa5492e898e61f61cbdf27','[\"*\"]','2025-10-29 00:16:50',NULL,'2025-10-28 21:28:54','2025-10-29 00:16:50'),(189,'App\\Models\\User',1,'api','0022760e5a9fa8e916b0f72fef4e502da2851085ceab33e6e9ce49783e451d07','[\"*\"]','2025-10-30 00:27:53',NULL,'2025-10-29 00:17:02','2025-10-30 00:27:53'),(190,'App\\Models\\User',7,'api','ae4d42faf48f79e43d164d6348393d9b559d26390bfb4502e7971757fe13dbcc','[\"*\"]','2025-10-30 00:28:21',NULL,'2025-10-30 00:28:04','2025-10-30 00:28:21'),(191,'App\\Models\\User',1,'api','1e3fcbccac3db9a92c286be533ceb700d54bf6a15c74963975b0f69ca6f65968','[\"*\"]','2025-10-30 00:43:15',NULL,'2025-10-30 00:28:49','2025-10-30 00:43:15'),(192,'App\\Models\\User',1,'api','8fa6d650ddbff7689be8542c5f9f4bbadc1f7b76cea6739c2cad857a9265db7d','[\"*\"]','2025-10-30 04:15:02',NULL,'2025-10-30 00:43:24','2025-10-30 04:15:02'),(193,'App\\Models\\User',1,'api','4ee54f17373aef0cd0eee7aa1a52928a356502f7e87319e2b30b81dc3525bade','[\"*\"]','2025-10-30 04:22:11',NULL,'2025-10-30 04:15:10','2025-10-30 04:22:11'),(194,'App\\Models\\User',1,'api','f23a5f7b052dd8d8b2453f28bbb1b2f53f62a4d48be2837bcaf2d4530ea55676','[\"*\"]','2025-10-30 04:24:35',NULL,'2025-10-30 04:22:19','2025-10-30 04:24:35'),(195,'App\\Models\\User',1,'api','40b169fbb7c1c6f3a20f8dbfc6535ac4c1aba4ca6651a5e36bc8afd33ec902f5','[\"*\"]','2025-10-30 04:31:12',NULL,'2025-10-30 04:24:42','2025-10-30 04:31:12'),(196,'App\\Models\\User',1,'api','ece4cd3cc88962904697c244355a98b93b88b40a9157e11041ca0f20e1f675d6','[\"*\"]','2025-10-30 04:31:52',NULL,'2025-10-30 04:31:18','2025-10-30 04:31:52'),(197,'App\\Models\\User',1,'api','2f3b0dc91b7da639ef31d726dfe6e64abeabfe1e9f108780e7aa274361d30f53','[\"*\"]','2025-10-30 04:39:26',NULL,'2025-10-30 04:36:59','2025-10-30 04:39:26'),(198,'App\\Models\\User',1,'api','f5c3bc73140de7022baf92f85cdcee444a6286020309bc2b357e3e2081a8e6ce','[\"*\"]','2025-10-30 04:42:03',NULL,'2025-10-30 04:39:33','2025-10-30 04:42:03'),(199,'App\\Models\\User',1,'api','1972e13976ee2ea1f4a9b5099e844a3e7afd8e0e3fbe4bff1d2a1b86a449245b','[\"*\"]','2025-10-30 04:44:53',NULL,'2025-10-30 04:42:08','2025-10-30 04:44:53'),(200,'App\\Models\\User',1,'api','5923225982cd997451029cdfca82dcbdb7b24e6e2b5a5082c1352422211ed524','[\"*\"]','2025-10-30 04:47:26',NULL,'2025-10-30 04:45:00','2025-10-30 04:47:26'),(201,'App\\Models\\User',1,'api','d0b01234be348c0d25b88209693c06c8d06811bc970a5efef90d4a6f21dad2e4','[\"*\"]','2025-10-30 04:48:19',NULL,'2025-10-30 04:47:46','2025-10-30 04:48:19'),(202,'App\\Models\\User',1,'api','b3e33acdb40f6f494d0ee1473a0e653e937518cbc0e82714b5b06294a94b1120','[\"*\"]','2025-10-30 05:33:34',NULL,'2025-10-30 04:48:25','2025-10-30 05:33:34'),(203,'App\\Models\\User',1,'api','7d8d31f6a6f6ae6ed48476c294c4371bac418925d12e4cbf916f9f6e74ae95dd','[\"*\"]','2025-10-30 05:33:48',NULL,'2025-10-30 05:33:48','2025-10-30 05:33:48'),(204,'App\\Models\\User',7,'api','a3a48a36bdc5ad94ed6ce4fa8b2eee7a2ddc6d13d7ce3af3b678255257548d63','[\"*\"]','2025-10-30 05:34:08',NULL,'2025-10-30 05:34:08','2025-10-30 05:34:08'),(205,'App\\Models\\User',3,'api','ef16d0f83c5ba34662e23452201fd05cb834b2d2b4cb574bfb3c4b1f6257efea','[\"*\"]','2025-10-30 05:48:25',NULL,'2025-10-30 05:34:29','2025-10-30 05:48:25'),(206,'App\\Models\\User',1,'api','60d194ac16bff0e312e9c824a1283725a24fa2268b6d3727ecd1ac64ddf64471','[\"*\"]','2025-10-30 05:49:44',NULL,'2025-10-30 05:48:34','2025-10-30 05:49:44'),(207,'App\\Models\\User',1,'api','695f246921c7666a39e293e0dc6d4c34b5632431d363b19e70051dbc3c45b666','[\"*\"]','2025-10-30 05:51:06',NULL,'2025-10-30 05:50:08','2025-10-30 05:51:06'),(208,'App\\Models\\User',1,'api','b5dd44cf369a9c41512f519948f13886e9c1fc9f1bf4c31550e168c4fc48413f','[\"*\"]','2025-10-30 22:55:55',NULL,'2025-10-30 05:53:55','2025-10-30 22:55:55'),(209,'App\\Models\\User',1,'api','f1bc8ca6ac83e0b4640fc4c15299568884ace880ab41a774b6e7261defa8977f','[\"*\"]','2025-10-31 05:24:15',NULL,'2025-10-31 05:23:35','2025-10-31 05:24:15'),(210,'App\\Models\\User',1,'api','6c3860ae716b72d2d9cbe69fbf1ec6b0a533f7f7e1efe57ce543e5b9cc2a99da','[\"*\"]','2025-11-04 23:23:02',NULL,'2025-11-04 23:22:29','2025-11-04 23:23:02'),(211,'App\\Models\\User',7,'api','cb8bf07b7cb743c6e09b943f501a5caf1e2074fbaabd9c2f6bca97fd11ffb57c','[\"*\"]','2025-11-04 23:25:24',NULL,'2025-11-04 23:25:19','2025-11-04 23:25:24'),(212,'App\\Models\\User',3,'api','f2dc2ea1e10fa74673577537094146bf5629289ac0343d4a59e2a09633272fa8','[\"*\"]','2025-11-04 23:25:39',NULL,'2025-11-04 23:25:39','2025-11-04 23:25:39'),(213,'App\\Models\\User',1,'api','c57a471415f55f815150b1e9b1b2a3753d735f15a6d2e67afe106adede1ee233','[\"*\"]','2025-11-05 00:29:11',NULL,'2025-11-04 23:25:50','2025-11-05 00:29:11');
/*!40000 ALTER TABLE `personal_access_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sessions`
--

DROP TABLE IF EXISTS `sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sessions` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` bigint unsigned DEFAULT NULL,
  `ip_address` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_agent` text COLLATE utf8mb4_unicode_ci,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_activity` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `sessions_user_id_index` (`user_id`),
  KEY `sessions_last_activity_index` (`last_activity`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sessions`
--

LOCK TABLES `sessions` WRITE;
/*!40000 ALTER TABLE `sessions` DISABLE KEYS */;
/*!40000 ALTER TABLE `sessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tasks`
--

DROP TABLE IF EXISTS `tasks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tasks` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `title` varchar(120) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `status` enum('todo','in_progress','completed') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'todo',
  `priority` enum('low','medium','high','urgent') COLLATE utf8mb4_unicode_ci DEFAULT 'medium',
  `due_date` date DEFAULT NULL,
  `completed_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `tasks_user_id_foreign` (`user_id`),
  KEY `tasks_status_index` (`status`),
  KEY `tasks_priority_index` (`priority`),
  KEY `tasks_due_date_index` (`due_date`),
  CONSTRAINT `tasks_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=45 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tasks`
--

LOCK TABLES `tasks` WRITE;
/*!40000 ALTER TABLE `tasks` DISABLE KEYS */;
INSERT INTO `tasks` VALUES (2,1,'test priority issue with urgent 3','test priority 3','completed','urgent','2025-10-25',NULL,'2025-10-16 03:07:41','2025-10-16 06:09:42'),(8,1,'test shadcn 2','test shadcn','completed','medium','2025-10-27',NULL,'2025-10-16 06:10:38','2025-10-26 23:51:16'),(11,1,'test delete','test delete','todo','medium','2121-02-01',NULL,'2025-10-16 20:58:46','2025-10-16 20:59:03'),(14,1,'test delete','test delete','todo','medium','2121-02-01',NULL,'2025-10-16 21:02:11','2025-10-16 21:02:21'),(15,1,'test 17 oct','test 17 oct','todo','medium','2121-02-12',NULL,'2025-10-16 21:02:42','2025-10-16 21:02:56'),(16,1,'test date','test date','todo','medium','2121-02-02',NULL,'2025-10-16 21:05:36','2025-10-16 21:07:49'),(18,3,'check','check','completed','high','2025-10-30',NULL,'2025-10-17 01:12:10','2025-10-19 14:16:29'),(19,1,'test UI','test UI','completed','urgent','2025-10-29',NULL,'2025-10-19 14:23:22','2025-10-19 14:38:41'),(20,1,'test new UI','test new UI','todo','medium','2025-10-31',NULL,'2025-10-20 00:03:07','2025-10-20 03:19:26'),(21,1,'date picker update','date picker update','todo','medium','2025-10-24',NULL,'2025-10-20 00:22:20','2025-10-20 01:30:37'),(22,1,'due date issue 1','dvavdav','todo','urgent','2025-10-30',NULL,'2025-10-20 00:23:01','2025-10-20 00:23:30'),(23,1,'test date picker prior date bug','test date picker prior date bug','todo','urgent','2025-10-31',NULL,'2025-10-20 00:37:31','2025-10-20 03:19:48'),(25,4,'date picker issue','select prior date','todo','urgent','2025-10-26',NULL,'2025-10-20 00:52:32','2025-10-20 00:52:53'),(26,5,'test date prior issue','date prior issue','completed','urgent','2025-11-01',NULL,'2025-10-20 00:59:43','2025-10-20 01:01:43'),(27,5,'test date prior issue 2','vdsvdsvds','in_progress','medium','2025-10-24',NULL,'2025-10-20 01:02:13','2025-10-20 01:02:54'),(30,1,'test middlewear 2','middle wear 2','todo','medium','2025-10-25',NULL,'2025-10-20 23:55:58','2025-10-21 01:13:16'),(31,3,'test routesss check 1 oct 23','routesssss oct 23','in_progress','urgent','2025-10-23',NULL,'2025-10-20 23:59:34','2025-10-23 06:40:13'),(32,3,'check admin acess to every task','check admin access','todo','medium','2025-10-23',NULL,'2025-10-22 22:56:45','2025-10-23 00:47:17'),(33,1,'drag and drop 1','cda','todo','medium','2025-10-30',NULL,'2025-10-23 04:32:38','2025-10-23 05:01:18'),(34,1,'drag nd drop 2','cwq','todo','medium','2025-10-24',NULL,'2025-10-23 05:02:08','2025-10-23 05:02:27'),(35,1,'fre','fre','todo','medium','2025-10-23',NULL,'2025-10-23 05:11:34','2025-10-23 05:12:03'),(36,3,'drag and drop','cdadsv','todo','medium','2025-10-23',NULL,'2025-10-23 06:02:46','2025-10-23 06:02:46'),(37,7,'test 1','test 1','todo','medium','2025-10-25',NULL,'2025-10-24 04:17:53','2025-10-24 04:17:53'),(38,7,'test 27 oct','27 oct','todo','urgent','2025-10-27',NULL,'2025-10-27 03:12:54','2025-10-27 03:12:54'),(39,1,'vhj','hm','todo','medium','2025-10-30',NULL,'2025-10-27 12:40:51','2025-10-27 12:41:20'),(40,1,'test old date','test old date','todo','medium','2025-10-30',NULL,'2025-10-30 00:32:01','2025-10-30 00:32:01'),(41,3,'test 30 oct','30 oct','in_progress','low','2025-10-31',NULL,'2025-10-30 05:35:53','2025-10-30 05:35:53'),(42,1,'test 2','oct 30','completed','medium','2025-11-01',NULL,'2025-10-30 05:49:12','2025-10-30 05:49:41'),(44,1,'test 31 oct','31 oct','todo','high',NULL,NULL,'2025-10-31 05:24:13','2025-10-31 05:24:13');
/*!40000 ALTER TABLE `tasks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_preferences`
--

DROP TABLE IF EXISTS `user_preferences`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_preferences` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `daily_digest_enabled` tinyint(1) NOT NULL DEFAULT '0',
  `digest_time` time NOT NULL DEFAULT '06:00:00',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_preferences_user_id_unique` (`user_id`),
  CONSTRAINT `user_preferences_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_preferences`
--

LOCK TABLES `user_preferences` WRITE;
/*!40000 ALTER TABLE `user_preferences` DISABLE KEYS */;
INSERT INTO `user_preferences` VALUES (1,1,1,'03:52:00','2025-10-24 00:05:30','2025-10-27 22:21:40'),(2,7,1,'10:44:00','2025-10-24 04:19:04','2025-10-27 05:18:13'),(3,3,0,'06:00:00','2025-10-30 05:48:15','2025-10-30 05:48:15');
/*!40000 ALTER TABLE `user_preferences` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `remember_token` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `role` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'user',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`),
  KEY `users_role_index` (`role`),
  KEY `users_is_active_index` (`is_active`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'admin','admin@example.com',NULL,'$2y$12$tt.ZEv6Nb2JFxEXd/tKPduh0fiLFjPWRc4n/9O.BIIfJEvgt6eOge',NULL,'2025-10-16 00:37:33','2025-10-17 00:57:41','admin',1),(2,'test','test@exampl.cpm',NULL,'$2y$12$I9Ceb7q7KmbxH1jBYeuSxuFCh.rkSGKGKDinnBEN7DayiSL8bcCMe',NULL,'2025-10-17 00:04:20','2025-10-30 00:39:40','user',0),(3,'check','check@example.com',NULL,'$2y$12$3bfVzea2FKyA.DAoIuv2.eH9h/yoj2dklcjGg7iFPsZt3Lq7hNv3C',NULL,'2025-10-17 01:12:00','2025-10-21 06:01:40','user',1),(4,'datepicker','datepicker@example.com',NULL,'$2y$12$MjLjfMGppDrh0ROVEUNyW.Yu0HUXplZAepAi80Rf69eXa5bvrI8mS',NULL,'2025-10-20 00:51:59','2025-10-21 06:03:32','admin',1),(5,'datepicker2','datepicker2@example.com',NULL,'$2y$12$s56sZFyDdPap9mrQikAYoeXBod4H7sL9MrE0A23FudQCiRkzjbV1C',NULL,'2025-10-20 00:59:06','2025-10-21 05:21:59','user',0),(6,'hardrefresh','hardrefresh@example.com',NULL,'$2y$12$C7rxMjbEtC9b8J0npg3HWOiWPZpwBIAQ5H.AOGL84Nim2sY7CNV86',NULL,'2025-10-20 04:20:41','2025-10-20 04:20:41','user',1),(7,'Asel rightmo','asel.rightmo@gmail.com',NULL,'$2y$12$abpF.4iR3qmWGxsPg2sP9ugeJikFV..j6kLJ1a3BrSnTL57bhSeXG',NULL,'2025-10-24 04:16:53','2025-10-30 00:27:53','admin',1);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-11-05 16:19:50
