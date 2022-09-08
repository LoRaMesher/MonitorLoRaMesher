#Instructions
Current instructions of the project located in main branch.
These instructions are only the remains of the inherited previous project, please ignore them, only here for matter of credits to the previous authors.
//Para node
curl -sL https://deb.nodesource.com/setup_14.x | sudo -E bash -
sudo apt-get install -y nodejs

//MongoDB
sudo apt install -y mongodb
npm i express express-handler express-session method-override mongoose passport passport-local bcryptjs connect-flash express-handlebars
npm install dotenv nodemon npm-check-updates -D

npm ls | grep nodemon
LORA_MONGODB_HOST=localhost
LORA_MONGODB_DATABASE=lora-app

>cd myapp_v3
>npm run dev
