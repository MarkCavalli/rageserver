-- phpMyAdmin SQL Dump
-- version 4.8.2
-- https://www.phpmyadmin.net/
-- Rage rp server inicial sql file
-- Host: localhost
-- Generation Time: 2018-08-26 04:01:42
-- Server version： 10.1.29-MariaDB-6
-- PHP Version: 7.0.30-1+ubuntu18.04.1+deb.sury.org+1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `rage_omp_test`
--

-- --------------------------------------------------------

--
-- Table structure `barbershop`
--

CREATE TABLE `barbershop` (
  `id` int(255) NOT NULL,
  `camData` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure `business`
--

CREATE TABLE `business` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `coord` text NOT NULL,
  `price` int(11) NOT NULL,
  `ownerId` int(255) DEFAULT '0',
  `margin` int(11) DEFAULT '0',
  `balance` int(11) NOT NULL DEFAULT '0',
  `buyerMenuCoord` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- 转存表中的数据 `business`
--

INSERT INTO `business` (`id`, `title`, `coord`, `price`, `ownerId`, `margin`, `balance`, `buyerMenuCoord`) VALUES
(1, 'Gas Station', '{\"x\":190.5,\"y\":6609.6,\"z\":31.8,\"rot\":292.4}', 5, 0, 0, 0, '{\"x\":176.8,\"y\":6598.7,\"z\":31.8,\"rot\":359.3}'),
(2, 'Clothing Shop', '{\"x\":5.9,\"y\":6511.4,\"z\":31.9,\"rot\":129}', 5, 0, 0, 0, '{\"x\":4.5,\"y\":6513,\"z\":31.9,\"rot\":123.1}');

-- --------------------------------------------------------

--
-- Table structure `cars`
--

CREATE TABLE `cars` (
  `id` int(255) NOT NULL,
  `model` varchar(255) NOT NULL,
  `title` varchar(255) NOT NULL,
  `fuel` float NOT NULL,
  `fuelTank` int(255) NOT NULL,
  `fuelRate` int(255) NOT NULL,
  `price` int(255) NOT NULL,
  `ownerId` int(255) NOT NULL,
  `whoCanOpen` text NOT NULL,
  `primaryColor` text NOT NULL,
  `secondaryColor` text NOT NULL,
  `numberPlate` varchar(10) NOT NULL,
  `coord` text NOT NULL,
  `dim` int(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure `cheapcardealership`
--

CREATE TABLE `cheapcardealership` (
  `id` int(11) NOT NULL,
  `newCarCoord` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure `clothingshop`
--

CREATE TABLE `clothingshop` (
  `id` int(255) NOT NULL,
  `camData` text,
  `buyerStandCoord` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- 转存表中的数据 `clothingshop`
--

INSERT INTO `clothingshop` (`id`, `camData`, `buyerStandCoord`) VALUES
(2, '{\"x\":10.65,\"y\":6513.36,\"z\":31.88,\"rz\":25.88,\"viewangle\":35}', '{\"x\":7.7,\"y\":6518.6,\"z\":31.9,\"rot\":207.3}');

-- --------------------------------------------------------

--
-- Table structure `faction`
--

CREATE TABLE `faction` (
  `id` int(255) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `rank` int(2) DEFAULT '0',
  `info` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- 转存表中的数据 `faction`
--

INSERT INTO `faction` (`id`, `name`, `rank`, `info`) VALUES
(1, NULL, 0, NULL);

-- --------------------------------------------------------

--
-- Table structure `gasstation`
--

CREATE TABLE `gasstation` (
  `id` int(11) NOT NULL,
  `fillingCoord` text,
  `camData` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- 转存表中的数据 `gasstation`
--

INSERT INTO `gasstation` (`id`, `fillingCoord`, `camData`) VALUES
(1, '{\"x\":176.8,\"y\":6598.7,\"z\":31.85,\"r\":6}', '{\"x\":176.8,\"y\":6598.7,\"z\":33.85,\"rz\":359.3,\"viewangle\":9}');

-- --------------------------------------------------------

--
-- Table structure `jail`
--

CREATE TABLE `jail` (
  `id` int(255) NOT NULL,
  `inside` tinyint(1) NOT NULL DEFAULT '0',
  `time` int(255) NOT NULL DEFAULT '0',
  `violations` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- 转存表中的数据 `jail`
--

INSERT INTO `jail` (`id`, `inside`, `time`, `violations`) VALUES
(1, 0, 0, '[]');

-- --------------------------------------------------------

--
-- Table structure `users`
--

CREATE TABLE `users` (
  `id` int(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `firstName` varchar(255) NOT NULL,
  `lastName` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `ip` varchar(255) NOT NULL,
  `regdate` varchar(255) NOT NULL,
  `logdate` varchar(255) DEFAULT NULL,
  `position` text,
  `dim` int(255) NOT NULL DEFAULT '0',
  `lang` varchar(10) NOT NULL DEFAULT 'eng',
  `health` int(3) NOT NULL DEFAULT '100',
  `adminlvl` int(2) NOT NULL DEFAULT '0',
  `loyality` int(255) NOT NULL DEFAULT '0',
  `socialclub` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure `usersBody`
--

CREATE TABLE `usersBody` (
  `id` int(255) NOT NULL,
  `gender` varchar(1) DEFAULT NULL,
  `skindata` text,
  `facedata` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure `usersClothes`
--

CREATE TABLE `usersClothes` (
  `id` int(11) NOT NULL,
  `hats` text,
  `glasses` text,
  `tops` text,
  `legs` text,
  `feet` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure `usersHeadOverlay`
--

CREATE TABLE `usersHeadOverlay` (
  `id` int(255) NOT NULL,
  `hair` tinyint(2) NOT NULL,
  `hairColor` text NOT NULL,
  `brow` text NOT NULL,
  `beard` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure `usersMoney`
--

CREATE TABLE `usersMoney` (
  `id` int(255) NOT NULL,
  `cash` bigint(255) NOT NULL DEFAULT '1500',
  `bank` bigint(255) NOT NULL DEFAULT '0',
  `tax` bigint(255) NOT NULL DEFAULT '0',
  `fines` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `barbershop`
--
ALTER TABLE `barbershop`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `business`
--
ALTER TABLE `business`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `cars`
--
ALTER TABLE `cars`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `cheapcardealership`
--
ALTER TABLE `cheapcardealership`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `clothingshop`
--
ALTER TABLE `clothingshop`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `faction`
--
ALTER TABLE `faction`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `gasstation`
--
ALTER TABLE `gasstation`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `jail`
--
ALTER TABLE `jail`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `usersBody`
--
ALTER TABLE `usersBody`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `usersClothes`
--
ALTER TABLE `usersClothes`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `usersHeadOverlay`
--
ALTER TABLE `usersHeadOverlay`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `usersMoney`
--
ALTER TABLE `usersMoney`
  ADD PRIMARY KEY (`id`);

--
-- 在导出的表使用AUTO_INCREMENT
--

--
-- AUTO_INCREMENT `barbershop`
--
ALTER TABLE `barbershop`
  MODIFY `id` int(255) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT `business`
--
ALTER TABLE `business`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT `cars`
--
ALTER TABLE `cars`
  MODIFY `id` int(255) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT `cheapcardealership`
--
ALTER TABLE `cheapcardealership`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT `clothingshop`
--
ALTER TABLE `clothingshop`
  MODIFY `id` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT `faction`
--
ALTER TABLE `faction`
  MODIFY `id` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT `gasstation`
--
ALTER TABLE `gasstation`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT `jail`
--
ALTER TABLE `jail`
  MODIFY `id` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT `users`
--
ALTER TABLE `users`
  MODIFY `id` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT `usersBody`
--
ALTER TABLE `usersBody`
  MODIFY `id` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT `usersClothes`
--
ALTER TABLE `usersClothes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT `usersHeadOverlay`
--
ALTER TABLE `usersHeadOverlay`
  MODIFY `id` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT `usersMoney`
--
ALTER TABLE `usersMoney`
  MODIFY `id` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
