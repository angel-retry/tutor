# 英文家教媒合平台
此網站為英文家教媒合平台，可讓家教老師和學生，提供線上的教育服務。該平台提供了註冊、登入、成為老師、瀏覽主頁、互動預約、個人頁面等功能，為用戶提供了便利的線上教育體驗。

## Features - 產品功能
### 註冊/登入/登出
- 使用者可以透過註冊帳號或使用 Google 帳號快速登入。
- 未登入使用者無法使用網站的主要功能，必須先登入才能使用。
- 登入後，用戶可以輕鬆登出帳戶。
### 成為老師
- 使用者可以點選「成為老師」按鈕填寫表單，申請成為平台的認證老師。
- 老師可以設定課程介紹、教學方式和視訓上課連結。
- 老師可以設定每節課的時長和可預約的日子。
### 老師、學生瀏覽首頁
- 使用者可以在主頁瀏覽老師清單和學生排行榜。
- 點擊老師清單中的老師方塊，使用者可以查看老師的資訊、評價和預約上課。
- 使用者可以透過搜尋欄搜尋老師的姓名、課程介紹。
### 用戶互動
- 進入老師頁面後，只限身分為學生的使用者可以查看可預約的上課時間並進行預約。
- 課程只顯示 2 週內可預約的時間段，已預約的時間段將不會顯示。
- 庫成預約成功後，會跳出提示視窗顯示預約資訊。
### 學生身分的使用者查看個人介面
- 學生可以在個人頁面查看未評價的老師，並對老師進行評分和留言。
- 學生可以查看自己學習總時長的排名。
- 學生可以編輯自己的姓名和介紹
### 老師個人頁面
- 老師可以在個人頁面查看新增的預約資訊和學生評價。
- 老師可以編輯自己的姓名、介紹、教學風格和可預約的日子。
### 後台管理
- 管理員可以查看全站使用者列表，但無法進入前台頁面。
- 學生/老師嘗試造訪後台頁面時會被返回。
- 管理者可以搜尋使用者的姓名、信箱、身分查詢使用者資料。

## Screen Photo - 專案畫面
![image](https://github.com/angel-retry/tutor/assets/71422058/031fb6bf-183b-4c8e-9bf6-71405c674d06)
![image](https://github.com/angel-retry/tutor/assets/71422058/faf0edda-bbaa-457d-b518-8be01b9167f1)
![image](https://github.com/angel-retry/tutor/assets/71422058/bb4228ab-2438-401e-ba8e-ad45fb997ee3)

## Installing - 專案安裝流程
1. 請git clone我的專案。
```
https://github.com/angel-retry/tutor.git
```
2. git clone專案後，cd此專案名稱，進入此專案資料夾。
```
cd tutor
```
3. 新增.env檔，輸入SESSION_SECRET，GOOGLE部分請在[https://console.developers.google.com](https://console.developers.google.com)建立專案並建立憑證將資訊存取以下內容，可以參閱此資料[[筆記] 如何建立Google OAuth2 用戶端 ID及使用Passport實作第三方登入驗證By Yi](https://mt5718214.medium.com/%E7%AD%86%E8%A8%98-%E5%A6%82%E4%BD%95%E5%BB%BA%E7%AB%8Bgoogle-oauth2-%E7%94%A8%E6%88%B6%E7%AB%AF-id%E5%8F%8A%E4%BD%BF%E7%94%A8passport%E5%AF%A6%E4%BD%9C%E7%AC%AC%E4%B8%89%E6%96%B9%E7%99%BB%E5%85%A5%E9%A9%97%E8%AD%89-5ec7846dc6ad)。
```
SESSION_SECRET=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_CALLBACK_URL=
```
4. 接下來安裝npm套件，請輸入以下指令開始安裝npm套件。
```
npm install
```
5. 完成安裝npm套件以後，輸入以下指令，載入資料庫檔案。
```
npm run migrate
```
6. 完成安裝npm套件以後，輸入以下指令，載入種子專案。
```
npm run seed
```
7. 載入種子專案完後，輸入以下指令，可啟動專案
```
npm run dev
```
8. 接下來會在terminal看到以下內容，代表伺服器建立成功。
```
[nodemon] restarting due to changes...
[nodemon] restarting due to changes...
[nodemon] starting `node app.js`
Example app listening on http://localhost:3000
```
9.現在可在Chrome進入[http://localhost:3000](http://localhost:3000) 開始使用此網站，可使用以下帳號登入。
- 前台帳號(可在Users資料庫查看哪些帳戶為學生、老師身分)
```
email: user1@example.com
password: 12345678
```
- 後台帳號
```
email: root@example.com
password: 12345678
```
## Development tool - 開發工具
- **[@faker-js/faker](https://www.npmjs.com/package/@faker-js/faker)** v8.4.1
- **[bcryptjs](https://www.npmjs.com/package/bcryptjs)** v2.4.3
- **[connect-flash](https://www.npmjs.com/package/connect-flash)** v0.1.1
- **[dayjs](https://www.npmjs.com/package/dayjs)** v1.11.11
- **[dotenv](https://www.npmjs.com/package/dotenv)** v16.4.5
- **[express](https://www.npmjs.com/package/express)** v4.19.2
- **[express-handlebars](https://www.npmjs.com/package/express-handlebars)** v7.1.2
- **[express-session](https://www.npmjs.com/package/express-session)** v1.18.0
- **[method-override](https://www.npmjs.com/package/method-override)** v3.0.0
- **[multer](https://www.npmjs.com/package/multer)** v1.4.5-lts.1
- **[mysql2](https://www.npmjs.com/package/mysql2)** v3.9.7
- **[passport](https://www.npmjs.com/package/passport)** v0.7.0
- **[passport-google-oauth2](https://www.npmjs.com/package/passport-google-oauth2)** v0.2.0
- **[passport-local](https://www.npmjs.com/package/passport-local)** v1.0.0
- **[sequelize](https://www.npmjs.com/package/sequelize)** v6.37.3
- **[sequelize-cli](https://www.npmjs.com/package/sequelize-cli)** v6.6.2

