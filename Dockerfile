# Use an official Node.js runtime as the base image
FROM node:14

# Set the working directory in the container to /app
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install any needed packages specified in package.json
RUN npm install

# Bundle app source inside the Docker image
COPY . .

# Set environment variable for MySQL connection
ENV MYSQL_HOST=mysql
ENV MYSQL_PORT=3307
ENV MYSQL_USER=root
ENV MYSQL_PASSWORD=admin
ENV MYSQL_DB=OneID

# Expose the port that the application will run on
EXPOSE 3000

# Start the application
CMD ["node", "app.js"]