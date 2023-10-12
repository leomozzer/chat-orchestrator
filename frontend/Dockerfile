# Use an official Nginx runtime as a parent image
FROM nginx:alpine

# Copy your HTML file into the Nginx container
COPY ./index.html /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]