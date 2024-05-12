@echo off
cd .\backend\src
start nodemon index.js
cd ..\..\frontend\peoplesync
start npm run ng serve
