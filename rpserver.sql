-- phpMyAdmin SQL Dump
-- version 4.4.15.9
-- https://www.phpmyadmin.net
--
-- Хост: localhost
-- Время создания: Июл 03 2018 г., 01:07
-- Версия сервера: 5.6.37
-- Версия PHP: 5.6.31

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
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

CREATE TABLE IF NOT EXISTS `business` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `coord` text NOT NULL,
  `price` int(11) NOT NULL,
  `owner` varchar(255) DEFAULT NULL,
  `margin` int(11) DEFAULT '0',
  `balance` int(11) NOT NULL DEFAULT '0',
  `buyerMenuCoord` text
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;

--
-- Дамп данных таблицы `business`
--

INSERT INTO `business` (`id`, `title`, `coord`, `price`, `owner`, `margin`, `balance`, `buyerMenuCoord`) VALUES
(1, 'Clothing Shop', '{"x":10.055,"y":6505.758,"z":31.538,"rot":43.63}', 750000, NULL, 0, 10350, '{"x":4.705,"y":6512.588,"z":31.878,"rot":227.89}'),
(2, 'Cheap Car Dealership', '{"x":-214.972,"y":6218.594,"z":31.491,"rot":43.81}', 1000000, NULL, 0, 0, '{"x":-231.748,"y":6235.291,"z":31.496,"rot":213.53}'),
(3, 'Gas Station', '{"x":-84.393,"y":6405.94,"z":31.64,"rot":56.52}', 1000000, NULL, 0, 4, '{"x":-92.975,"y":6410.063,"z":31.64,"rot":225.32}'),
(4, 'Gas Station', '{"x":-2065.888,"y":-312.843,"z":13.288,"rot":243.99}', 1450000, 'Thomas_Rargard', 12, 0, '{"x":-2073.492,"y":-327.231,"z":13.315,"rot":22.55}'),
(5, 'Gas Station', '{"x":-356.055,"y":-1486.768,"z":30.182,"rot":288.24}', 1500000, NULL, 0, 0, '{"x":-341.779,"y":-1482.968,"z":30.686,"rot":269.92}'),
(6, 'Cheap Car Dealership', '{"x":-28.573,"y":-1104.029,"z":26.422,"rot":91.57}', 2500000, NULL, 0, 0, '{"x":-31.475,"y":-1112.99,"z":26.422,"rot":148.18}');

-- --------------------------------------------------------

--
-- Структура таблицы `cars`
--

CREATE TABLE IF NOT EXISTS `cars` (
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
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

--
-- Структура таблицы `cheapcardealership`
--

CREATE TABLE IF NOT EXISTS `cheapcardealership` (
  `id` int(11) NOT NULL,
  `newCarCoord` text
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;

--
-- Дамп данных таблицы `cheapcardealership`
--

INSERT INTO `cheapcardealership` (`id`, `newCarCoord`) VALUES
(2, '{"x":-240.116,"y":6231.818,"z":31.513,"rot":43.11}'),
(6, '{"x":-50.79,"y":-1110.834,"z":26.015,"rot":74.87}');

-- --------------------------------------------------------

--
-- Структура таблицы `clothingshop`
--

CREATE TABLE IF NOT EXISTS `clothingshop` (
  `id` int(255) NOT NULL,
  `camData` text,
  `buyerStandCoord` text
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

--
-- Дамп данных таблицы `clothingshop`
--

INSERT INTO `clothingshop` (`id`, `camData`, `buyerStandCoord`) VALUES
(1, '{"x":6.069,"y":6508.089,"z":31.878,"rx":0,"ry":0,"rz":133,"viewangle":35}', '{"x":3.333,"y":6505.443,"z":31.878,"rot":308.84}');

-- --------------------------------------------------------

--
-- Структура таблицы `faction`
--

CREATE TABLE IF NOT EXISTS `faction` (
  `id` int(255) NOT NULL,
  `factionName` varchar(255) DEFAULT NULL,
  `factionRank` int(2) DEFAULT '0',
  `factionInfo` text
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

--
-- Дамп данных таблицы `faction`
--

INSERT INTO `faction` (`id`, `factionName`, `factionRank`, `factionInfo`) VALUES
(1, NULL, 0, NULL);

-- --------------------------------------------------------

--
-- Структура таблицы `gasstation`
--

CREATE TABLE IF NOT EXISTS `gasstation` (
  `id` int(11) NOT NULL,
  `fillingCoord` text,
  `camData` text
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;

--
-- Дамп данных таблицы `gasstation`
--

INSERT INTO `gasstation` (`id`, `fillingCoord`, `camData`) VALUES
(3, '{"x":-94.672,"y":6419.113,"z":31.49,"r":6}', '{"x":-101.079,"y":6442.736,"z":33.278,"rz":204.38,"viewangle":30}'),
(4, '{"x":-2096.976,"y":-321.058,"z":13.169,"r":16}', '{"x":-2096.656,"y":-275.962,"z":19.577,"rz":188.36,"viewangle":60}'),
(5, '{"x":-319.639,"y":-1471.784,"z":30.549,"r":15}', '{"x":-287.808,"y":-1461.896,"z":33.199,"rz":113.44,"viewangle":60}');

-- --------------------------------------------------------

--
-- Структура таблицы `users`
--

CREATE TABLE IF NOT EXISTS `users` (
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
  `health` int(4) NOT NULL DEFAULT '100',
  `ip` varchar(24) NOT NULL,
  `skey` varchar(24) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

--
-- Структура таблицы `userskins`
--

CREATE TABLE IF NOT EXISTS `userskins` (
  `id` int(11) NOT NULL,
  `skin` bigint(255) NOT NULL DEFAULT '0',
  `skindata` varchar(15) DEFAULT NULL,
  `facedata` varchar(121) DEFAULT NULL,
  `hats` text,
  `glasses` text,
  `tops` text,
  `legs` text,
  `feet` text
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

--
-- Дамп данных таблицы `userskins`
--

INSERT INTO `userskins` (`id`, `skin`, `skindata`, `facedata`, `hats`, `glasses`, `tops`, `legs`, `feet`) VALUES
(1, 1885233650, '[2,21,2,0.4]', '[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]', '{"number":2,"color":1}', '{"number":2,"color":1}', '{"number":3,"color":14,"underColor":0}', '{"number":0,"color":1}', '{"number":0,"color":0}'),
(2, 1885233650, '[0,21,6,0.5]', '[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]', '{"number":0,"color":0}', '{"number":0,"color":0}', '{"number":0,"color":0,"underColor":0}', '{"number":0,"color":0}', '{"number":0,"color":0}');

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=7;
--
-- AUTO_INCREMENT для таблицы `cars`
--
ALTER TABLE `cars`
  MODIFY `id` int(255) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=2;
--
-- AUTO_INCREMENT для таблицы `cheapcardealership`
--
ALTER TABLE `cheapcardealership`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=7;
--
-- AUTO_INCREMENT для таблицы `clothingshop`
--
ALTER TABLE `clothingshop`
  MODIFY `id` int(255) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=2;
--
-- AUTO_INCREMENT для таблицы `faction`
--
ALTER TABLE `faction`
  MODIFY `id` int(255) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=2;
--
-- AUTO_INCREMENT для таблицы `gasstation`
--
ALTER TABLE `gasstation`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=6;
--
-- AUTO_INCREMENT для таблицы `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=1;
--
-- AUTO_INCREMENT для таблицы `userskins`
--
ALTER TABLE `userskins`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=3;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
