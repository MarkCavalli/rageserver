# rageserver
Open source rage mp role play server

Hello!
All about this server you can read at:
https://rage.mp/forums/topic/1559-open-source-role-play-server/


# Installation guide:
1. Install Ragemp server.
2. Put all files in your project.
3. Run `npm i` by cmd in main directory with "server.exe" excutable script.
4. Server using MySQL as a database. So you have to import sql file in to your database. In database management make one like "ragerp".
   Import sql structure file (rpserver.sql) into it.      
5. Rename  sMailer.js.example and sMysql.js.example to sMailer.js and sMysql.js in ./app/server/,then modify the settings.(More sMailer instructions 
   see https://nodemailer.com/usage/)   
6. Modify files in `app` directory (if you need).
7. Do `npm run build` by cmd in main directory (BESURE DO THIS every time after some improvements in 'app' directory).
8. Start a server

THEN ENJOY.

## Command list (21st of March, 2019)

### Basic - Chat: `/do`
For more information view source code.
### Basic - Chat: `/g`
For more information view source code.
### Basic - Chat: `/me`
For more information view source code.
### Basic - Player: `/pos`
For more information view source code.
### Basic - Player: `/save`
For more information view source code.
### Basic - Weather: `/w`
For more information view source code.
### Basic - Vehicles: `/tp`
For more information view source code.
### Basic - Vehicles: `/v`
For more information view source code.
### Basic - Vehicles: `/veh`
For more information view source code.
### Business - BarberShop: `/createbarbershop`
For more information view source code.
### Business - BarberShop: `/setbscamdata`
For more information view source code.
### Business - Business: `/setbusbuyermenu`
For more information view source code.
### Business - CheapCarDealership: `/createcheapcardealership`
For more information view source code.
### Business - CheapCarDealership: `/setccardealernewcarcoord`
For more information view source code.
### Business - ClothingShop: `/createclothingshop`
For more information view source code.
### Business - ClothingShop: `/setchbuyerstandcoord`
For more information view source code.
### Business - ClothingShop: `/setchcamdata`
For more information view source code.
### Business - CommercialCarDealership: `/createcommercialcardealership`
For more information view source code.
### Business - CommercialCarDealership: `/setcommercialcardealernewcarcoord`
For more information view source code.
### Business - GasStation: `/creategasstation`
For more information view source code.
### Business - GasStation: `/setgasstationcamdata`
For more information view source code.
### Business - GasStation: `/setgasstationfillingpos`
For more information view source code.
### Factions - Hospital: `/sethospitalleader`
For more information view source code.
### Factions - Faction: `/invite`
For more information view source code.
### Factions - Faction: `/setrank`
For more information view source code.
### Factions - Faction: `/uninvite`
For more information view source code.
