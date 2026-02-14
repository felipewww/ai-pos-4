FROM node:20-alpine

WORKDIR /usr/src/app
COPY package*.json ./

RUN #npm install
RUN npm install -g typescript
RUN npm install -g nodemon
RUN #npm run build

#COPY . .

#EXPOSE 3000

#CMD ["npm", "run", "start:dev"]
