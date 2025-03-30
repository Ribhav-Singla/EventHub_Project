FROM node:20

WORKDIR /client

COPY package* .

RUN npm install

COPY . .

RUN npm run build

EXPOSE 5173

CMD ["npm", "run", "dev"]