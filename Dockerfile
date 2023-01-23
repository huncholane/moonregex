FROM node:18-alpine
WORKDIR /app
RUN npm install -g serve
COPY package.json .
RUN npm install
COPY . .
CMD ["npm", "run", "dev"]