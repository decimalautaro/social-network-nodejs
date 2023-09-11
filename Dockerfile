FROM node:16.20.1

RUN npm install -g ts-node

WORKDIR /usr/src/app

COPY package*.json ./

COPY . .

RUN npm install

EXPOSE 8000

#  develop
CMD [ "npm", "run","dev" ]  

# CMD [ "npm", "start" ]  // production  
