# Step 1: Build the Angular app
FROM node:12 AS builder

# Set working directory
WORKDIR /app


# Copy the rest of the app and build
COPY . .

# Step 2: Serve app with Nginx
FROM nginx:alpine

# Remove default nginx static files
RUN rm -rf /usr/share/nginx/html/*

# Copy Angular build output to Nginx's html directory
# COPY --from=builder /app/dist/your-app-name /usr/share/nginx/html

# Copy custom nginx config (optional)
# COPY nginx.conf /etc/nginx/nginx.conf

# Expose port
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
