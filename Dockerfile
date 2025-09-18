FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
RUN npx expo-cli build:web
EXPOSE 8080
RUN npm install -g serve
CMD ["serve", "-s", "web-build", "-l", "8080"]
