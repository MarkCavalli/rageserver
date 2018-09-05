-- phpMyAdmin SQL Dump
-- version 4.7.7
-- https://www.phpmyadmin.net/
--
-- Хост: 127.0.0.1:3306
-- Время создания: Сен 05 2018 г., 13:08
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
-- Структура таблицы `barbershop`
--

CREATE TABLE `barbershop` (
  `id` int(255) NOT NULL,
  `camData` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Структура таблицы `business`
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

-- --------------------------------------------------------

--
-- Структура таблицы `cheapcardealership`
--

CREATE TABLE `cheapcardealership` (
  `id` int(255) NOT NULL,
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
-- Структура таблицы `commercialcardealership`
--

CREATE TABLE `commercialcardealership` (
  `id` int(255) NOT NULL,
  `newCarCoord` text
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
  `id` int(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `firstName` varchar(255) NOT NULL,
  `lastName` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `ip` varchar(255) NOT NULL,
  `regdate` varchar(255) NOT NULL,
  `logdate` varchar(255) DEFAULT NULL,
  `position` text,
  `lang` varchar(10) NOT NULL DEFAULT 'eng',
  `health` int(3) NOT NULL DEFAULT '100',
  `adminlvl` int(2) NOT NULL DEFAULT '0',
  `loyality` int(255) NOT NULL DEFAULT '0',
  `socialclub` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Структура таблицы `usersBody`
--

CREATE TABLE `usersBody` (
  `id` int(255) NOT NULL,
  `gender` varchar(1) DEFAULT NULL,
  `skindata` text,
  `facedata` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Структура таблицы `usersClothes`
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
-- Структура таблицы `usersFaction`
--

CREATE TABLE `usersFaction` (
  `id` int(255) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `rank` int(2) DEFAULT '0',
  `info` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Структура таблицы `usersHeadOverlay`
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
-- Структура таблицы `usersJail`
--

CREATE TABLE `usersJail` (
  `id` int(255) NOT NULL,
  `inside` tinyint(1) NOT NULL DEFAULT '0',
  `time` int(255) NOT NULL DEFAULT '0',
  `violations` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Структура таблицы `usersMoney`
--

CREATE TABLE `usersMoney` (
  `id` int(255) NOT NULL,
  `cash` bigint(255) NOT NULL DEFAULT '1500',
  `bank` bigint(255) NOT NULL DEFAULT '0',
  `tax` bigint(255) NOT NULL DEFAULT '0',
  `fines` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Структура таблицы `vehicles`
--

CREATE TABLE `vehicles` (
  `id` int(255) NOT NULL,
  `model` varchar(255) NOT NULL,
  `title` varchar(255) NOT NULL,
  `fuel` float NOT NULL,
  `fuelTank` int(255) NOT NULL,
  `fuelRate` int(255) NOT NULL,
  `price` int(255) NOT NULL,
  `ownerId` int(255) NOT NULL,
  `whoCanOpen` text NOT NULL,
  `factionName` varchar(255) DEFAULT NULL,
  `primaryColor` text NOT NULL,
  `secondaryColor` text NOT NULL,
  `numberPlate` varchar(10) NOT NULL,
  `coord` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Индексы сохранённых таблиц
--

--
-- Индексы таблицы `barbershop`
--
ALTER TABLE `barbershop`
  ADD PRIMARY KEY (`id`);

--
-- Индексы таблицы `business`
--
ALTER TABLE `business`
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
-- Индексы таблицы `commercialcardealership`
--
ALTER TABLE `commercialcardealership`
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
-- Индексы таблицы `usersBody`
--
ALTER TABLE `usersBody`
  ADD PRIMARY KEY (`id`);

--
-- Индексы таблицы `usersClothes`
--
ALTER TABLE `usersClothes`
  ADD PRIMARY KEY (`id`);

--
-- Индексы таблицы `usersFaction`
--
ALTER TABLE `usersFaction`
  ADD PRIMARY KEY (`id`);

--
-- Индексы таблицы `usersHeadOverlay`
--
ALTER TABLE `usersHeadOverlay`
  ADD PRIMARY KEY (`id`);

--
-- Индексы таблицы `usersJail`
--
ALTER TABLE `usersJail`
  ADD PRIMARY KEY (`id`);

--
-- Индексы таблицы `usersMoney`
--
ALTER TABLE `usersMoney`
  ADD PRIMARY KEY (`id`);

--
-- Индексы таблицы `vehicles`
--
ALTER TABLE `vehicles`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT для сохранённых таблиц
--

--
-- AUTO_INCREMENT для таблицы `barbershop`
--
ALTER TABLE `barbershop`
  MODIFY `id` int(255) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT для таблицы `business`
--
ALTER TABLE `business`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT для таблицы `cheapcardealership`
--
ALTER TABLE `cheapcardealership`
  MODIFY `id` int(255) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT для таблицы `clothingshop`
--
ALTER TABLE `clothingshop`
  MODIFY `id` int(255) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT для таблицы `commercialcardealership`
--
ALTER TABLE `commercialcardealership`
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
  MODIFY `id` int(255) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT для таблицы `usersBody`
--
ALTER TABLE `usersBody`
  MODIFY `id` int(255) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT для таблицы `usersClothes`
--
ALTER TABLE `usersClothes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT для таблицы `usersFaction`
--
ALTER TABLE `usersFaction`
  MODIFY `id` int(255) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT для таблицы `usersHeadOverlay`
--
ALTER TABLE `usersHeadOverlay`
  MODIFY `id` int(255) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT для таблицы `usersJail`
--
ALTER TABLE `usersJail`
  MODIFY `id` int(255) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT для таблицы `usersMoney`
--
ALTER TABLE `usersMoney`
  MODIFY `id` int(255) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT для таблицы `vehicles`
--
ALTER TABLE `vehicles`
  MODIFY `id` int(255) NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
