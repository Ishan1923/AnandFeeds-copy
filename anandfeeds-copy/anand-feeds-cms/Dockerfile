FROM node:18-alpine

WORKDIR /srv/app

# Install dependencies
COPY package.json ./
COPY package-lock.json* ./
RUN npm ci --silent || npm install

# Copy source
COPY . .

# Build Strapi admin
RUN npm run build

ENV NODE_ENV=production
EXPOSE 1337

CMD ["npm", "start"]
