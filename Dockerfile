# Use the official PHP image with Apache
FROM php:8.1-apache

# Set the working directory in the container
WORKDIR /var/www/html

# Copy the current directory contents into the container at /var/www/html
COPY . .

# Ensure permissions are correct
RUN chown -R www-data:www-data /var/www/html

EXPOSE 80

# Start the Apache server
CMD ["apache2-foreground"]
