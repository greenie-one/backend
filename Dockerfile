# NodeJS Version 19
FROM node:alpine3.17

# Copy Dir
COPY . ./app

# Work to Dir
WORKDIR /app

# Install Node Package
RUN yarn install --immutable

EXPOSE 8080

# Cmd script
CMD ["yarn", "start"]
