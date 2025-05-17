# Use nginx as a lightweight web server for static content
FROM nginx:alpine

# Copy the application files to the nginx html directory
COPY . /usr/share/nginx/html/

# Remove the default nginx configuration
RUN rm /etc/nginx/conf.d/default.conf

# Add custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/

# Expose port 80
EXPOSE 80

# Start nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]
