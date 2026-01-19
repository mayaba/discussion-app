# syntax=docker/dockerfile:1

ARG NODE_VERSION=14

# ----------------------------
# Build stage (Meteor build)
# ----------------------------
FROM node:${NODE_VERSION}-bullseye AS build
WORKDIR /src

ARG METEOR_RELEASE=2.3.2

# Install Meteor tool (pinned)
RUN curl "https://install.meteor.com/?release=${METEOR_RELEASE}" | sh
ENV PATH="/root/.meteor:${PATH}"
ENV METEOR_ALLOW_SUPERUSER=true

# Copy source
COPY . .

# Install deps + build bundle
RUN meteor npm install --allow-superuser
RUN meteor build --directory /build --server-only --allow-superuser


# ----------------------------
# Runtime stage (run bundle)
# ----------------------------
FROM node:${NODE_VERSION}-bullseye-slim AS runtime
WORKDIR /app

# Copy bundle
COPY --from=build /build/bundle /app/bundle

# Install server deps (native modules like fibers may need build tooling)
WORKDIR /app/bundle/programs/server
RUN apt-get update \
  && apt-get install -y --no-install-recommends python3 make g++ ca-certificates \
  && rm -rf /var/lib/apt/lists/* \
  && npm install --omit=dev --unsafe-perm

# Runtime config
WORKDIR /app/bundle
ENV PORT=3000
EXPOSE 3000

# Run as non-root
RUN useradd -m appuser
USER appuser

CMD ["node", "main.js"]
