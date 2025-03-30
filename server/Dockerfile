FROM node:20

WORKDIR /server

COPY package* .
COPY ./prisma .

RUN npm install

COPY . .

RUN npx prisma generate
RUN npm run build

EXPOSE 3000

CMD ["npx prisma migrate deploy", "node", "dist/http/index.js"]
