# Step 1: Use an official PHP image with Apache
FROM php:8.1-apache

# Step 2: Enable Apache mod_rewrite for clean URLs (optional)
RUN a2enmod rewrite

# Step 3: Copy the current directory (backend PHP files) into the container's /var/www/html folder
COPY . /var/www/html/

# Step 4: Set the working directory
WORKDIR /var/www/html

# Step 5: Install Composer (if your PHP project uses dependencies via Composer)
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Step 6: Set appropriate file permissions (optional, adjust if needed)
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html

# Step 7: Expose the default Apache port 80
EXPOSE 80

# Step 8: Start the Apache server
CMD ["apache2-foreground"]
