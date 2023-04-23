FROM node:alpine3.17 as build

# Copy Dir
COPY . ./app

# Work to Dir
WORKDIR /app

# Install Node Package
RUN yarn install --immutable
RUN yarn build

FROM node:alpine3.17
COPY --from=build /app/dist /app

EXPOSE 8080
WORKDIR /app

CMD ["node", "./server.js"]
