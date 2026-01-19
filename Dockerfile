# --- build stage ---
FROM node:20-bullseye AS build
WORKDIR /src

# Install Meteor
RUN curl https://install.meteor.com/ | sh
ENV PATH="/root/.meteor:${PATH}"
ENV METEOR_ALLOW_SUPERUSER=true

COPY . .

# Install deps using Meteor's npm
RUN meteor npm install

# Build server bundle
RUN meteor build --directory /build --server-only

# --- runtime stage ---
FROM node:20-alpine
WORKDIR /app

# Copy built bundle
COPY --from=build /build/bundle /app/bundle

WORKDIR /app/bundle/programs/server
RUN npm install --omit=dev

WORKDIR /app/bundle
ENV PORT=3000
EXPOSE 3000

CMD ["node", "main.js"]
