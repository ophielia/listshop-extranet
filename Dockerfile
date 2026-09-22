# Stage 1: Build the Angular application
FROM node:14-slim AS build-stage

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the application
# We use the same output path as before to keep it consistent
RUN npm run build -- --prod --output-path=./dist/out

# Stage 2: Serve the application with Nginx
FROM nginx:stable-alpine

# Copy the build output from the build-stage
COPY --from=build-stage /app/dist/out/ /usr/share/nginx/html

# Copy a custom nginx configuration for SPA routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
