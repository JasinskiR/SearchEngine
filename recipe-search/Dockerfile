FROM node:18-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

# Add axios to dependencies and update package.json
RUN npm install axios --save

COPY . .

EXPOSE 3000

# Install dependencies at startup to ensure all are available
CMD ["sh", "-c", "npm install && npm start"]