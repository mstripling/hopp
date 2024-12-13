FROM node:18-alpine AS build

# Create app directory and set permissions
WORKDIR /app

# Copy package.json and package-lock.json
COPY ./package*.json ./

# Clear npm cache and install dependencies
RUN npm install

COPY . .

EXPOSE 80

# Use correct CMD syntax in JSON array format
CMD ["node", "server/index.js"]
