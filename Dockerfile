# ----------------------------
# Build stage (Meteor build)
# ----------------------------
FROM node:20-bullseye AS build
WORKDIR /src

# Install Meteor
RUN curl https://install.meteor.com/ | sh
ENV PATH="/root/.meteor:${PATH}"
ENV METEOR_ALLOW_SUPERUSER=true

# Copy app source
COPY . .

# Install deps and build server bundle
RUN meteor npm install --allow-superuser
RUN meteor build --directory /build --server-only --allow-superuser


# ----------------------------
# Runtime stage (run bundle)
# ----------------------------
FROM node:20-bullseye-slim AS runtime
WORKDIR /app

# Copy built bundle from build stage
COPY --from=build /build/bundle /app/bundle

# Install server dependencies (may require node-gyp => python/make/g++)
WORKDIR /app/bundle/programs/server
RUN apt-get update \
  && apt-get install -y --no-install-recommends python3 make g++ \
  && rm -rf /var/lib/apt/lists/* \
  && npm install --omit=dev

# Runtime configuration
WORKDIR /app/bundle
ENV PORT=3000
EXPOSE 3000

# Run as non-root
RUN useradd -m appuser
USER appuser

CMD ["node", "main.js"]
