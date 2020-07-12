@echo off
start sh.exe --login -c "gulp; gulp watch; read -n 1 \"Press le any key.""
start sh.exe --login -c "node app.js; read -n 1 \"Press le any key.""
start "" "http://localhost/"
start explorer.exe "%CD%"
atom ./
