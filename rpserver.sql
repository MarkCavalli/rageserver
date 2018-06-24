-- phpMyAdmin SQL Dump
-- version 4.7.7
-- https://www.phpmyadmin.net/
--
-- Хост: 127.0.0.1:3306
-- Время создания: Июн 24 2018 г., 16:41
-- Версия сервера: 5.7.20
-- Версия PHP: 5.5.38

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- База данных: `rpserver`
--

-- --------------------------------------------------------

--
-- Структура таблицы `business`
--

CREATE TABLE `business` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `coord` text NOT NULL,
  `price` int(11) NOT NULL,
  `owner` varchar(255) DEFAULT NULL,
  `margin` int(11) DEFAULT '0',
  `balance` int(11) NOT NULL DEFAULT '0',
  `buyerMenuCoord` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Структура таблицы `cars`
--

CREATE TABLE `cars` (
  `id` int(255) NOT NULL,
  `model` varchar(255) NOT NULL,
  `title` varchar(255) NOT NULL,
  `fuel` float NOT NULL,
  `fuelTank` int(255) NOT NULL,
  `fuelRate` int(255) NOT NULL,
  `price` int(255) NOT NULL,
  `owner` varchar(255) NOT NULL,
  `whoCanOpen` text NOT NULL,
  `primaryColor` text NOT NULL,
  `secondaryColor` text NOT NULL,
  `numberPlate` varchar(10) NOT NULL,
  `coord` text NOT NULL,
  `dim` int(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Структура таблицы `cheapcardealership`
--

CREATE TABLE `cheapcardealership` (
  `id` int(11) NOT NULL,
  `newCarCoord` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Структура таблицы `clothingshop`
--

CREATE TABLE `clothingshop` (
  `id` int(255) NOT NULL,
  `camData` text,
  `buyerStandCoord` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Структура таблицы `faction`
--

CREATE TABLE `faction` (
  `id` int(255) NOT NULL,
  `factionName` varchar(255) DEFAULT NULL,
  `rank` int(2) DEFAULT '0',
  `factionInfo` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Структура таблицы `gasstation`
--

CREATE TABLE `gasstation` (
  `id` int(11) NOT NULL,
  `fillingCoord` text,
  `camData` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Структура таблицы `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) DEFAULT NULL,
  `money` bigint(20) NOT NULL DEFAULT '0',
  `bmoney` bigint(20) NOT NULL DEFAULT '0',
  `tmoney` bigint(20) NOT NULL DEFAULT '0',
  `pmoney` bigint(20) NOT NULL DEFAULT '0',
  `position` text,
  `dim` int(11) NOT NULL DEFAULT '0',
  `signupdate` varchar(255) DEFAULT NULL,
  `lastlogindate` varchar(255) DEFAULT NULL,
  `adminlvl` tinyint(4) NOT NULL DEFAULT '0',
  `hasBusiness` tinyint(1) NOT NULL DEFAULT '0',
  `lang` varchar(3) NOT NULL DEFAULT 'eng',
  `loyality` int(255) NOT NULL DEFAULT '0',
  `health` int(4) NOT NULL DEFAULT '100'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Структура таблицы `userskins`
--

CREATE TABLE `userskins` (
  `id` int(11) NOT NULL,
  `skin` bigint(255) NOT NULL DEFAULT '0',
  `skindata` varchar(15) DEFAULT NULL,
  `facedata` varchar(121) DEFAULT NULL,
  `hats` text,
  `glasses` text,
  `tops` text,
  `legs` text,
  `feet` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Индексы сохранённых таблиц
--

--
-- Индексы таблицы `business`
--
ALTER TABLE `business`
  ADD PRIMARY KEY (`id`);

--
-- Индексы таблицы `cars`
--
ALTER TABLE `cars`
  ADD PRIMARY KEY (`id`);

--
-- Индексы таблицы `cheapcardealership`
--
ALTER TABLE `cheapcardealership`
  ADD PRIMARY KEY (`id`);

--
-- Индексы таблицы `clothingshop`
--
ALTER TABLE `clothingshop`
  ADD PRIMARY KEY (`id`);

--
-- Индексы таблицы `faction`
--
ALTER TABLE `faction`
  ADD PRIMARY KEY (`id`);

--
-- Индексы таблицы `gasstation`
--
ALTER TABLE `gasstation`
  ADD PRIMARY KEY (`id`);

--
-- Индексы таблицы `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- Индексы таблицы `userskins`
--
ALTER TABLE `userskins`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT для сохранённых таблиц
--

--
-- AUTO_INCREMENT для таблицы `business`
--
ALTER TABLE `business`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT для таблицы `cars`
--
ALTER TABLE `cars`
  MODIFY `id` int(255) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT для таблицы `cheapcardealership`
--
ALTER TABLE `cheapcardealership`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT для таблицы `clothingshop`
--
ALTER TABLE `clothingshop`
  MODIFY `id` int(255) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT для таблицы `faction`
--
ALTER TABLE `faction`
  MODIFY `id` int(255) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT для таблицы `gasstation`
--
ALTER TABLE `gasstation`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT для таблицы `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT для таблицы `userskins`
--
ALTER TABLE `userskins`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
