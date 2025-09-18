FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npx expo export -p web
RUN npm install -g serve
ENV PORT=8080
CMD ["serve", "-s", "dist", "-l", "8080"]
EXPOSE 8080
