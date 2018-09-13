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
