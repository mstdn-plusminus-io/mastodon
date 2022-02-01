FROM ruby:3.0-bullseye

# Install Node.js
RUN curl -fsSL https://deb.nodesource.com/setup_16.x | bash - && \
    apt-get install -y nodejs && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Create the mastodon user
ARG UID=991
ARG GID=991
SHELL ["/bin/bash", "-o", "pipefail", "-c"]
RUN apt-get update && \
    echo "Etc/UTC" > /etc/localtime && \
    apt-get install -y --no-install-recommends whois wget && \
    addgroup --gid $GID mastodon && \
    useradd -m -u $UID -g $GID -d /opt/mastodon mastodon && \
    echo "mastodon:$(head /dev/urandom | tr -dc A-Za-z0-9 | head -c 24 | mkpasswd -s -m sha-256)" | chpasswd && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Install mastodon build / runtime deps
RUN echo 'debconf debconf/frontend select Noninteractive' | debconf-set-selections
RUN apt-get update && \
    apt-get -y --no-install-recommends install \
    git libicu-dev libidn11-dev \
    libpq-dev libprotobuf-dev protobuf-compiler shared-mime-info \
    libssl1.1 libpq5 imagemagick ffmpeg libjemalloc2 libyaml-0-2 \
    file ca-certificates tzdata libreadline8 gcc tini apt-utils && \
    ln -s /opt/mastodon /mastodon && \
    gem install bundler && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Enable jemalloc
RUN ln -nfs /usr/lib/$(uname -m)-linux-gnu /usr/lib/linux-gnu
ENV LD_PRELOAD=${LD_PRELOAD}:/usr/lib/linux-gnu/libjemalloc.so.2

# Build mastodon, and set permissions
COPY --chown=mastodon:mastodon . /opt/mastodon
RUN npm install -g npm@latest && \
    npm install -g yarn && \
    gem install bundler && \
    apt-get update && \
    apt-get install -y --no-install-recommends && \
    cd /opt/mastodon && \
    bundle config set --local deployment 'true' && \
    bundle config set --local without 'development test' && \
    bundle config set silence_root_warning true && \
    bundle install -j"$(nproc)" && \
    yarn install --pure-lockfile && \
    chown -R mastodon:mastodon /opt/mastodon && \
    npm cache clean --force && \
    yarn cache clean && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Run mastodon services in prod mode
ENV RAILS_ENV="production"
ENV NODE_ENV="production"

# Tell rails to serve static files
ENV RAILS_SERVE_STATIC_FILES="true"
ENV BIND="0.0.0.0"

# Set the run user
USER mastodon

# Precompile assets
RUN cd ~ && \
    OTP_SECRET=precompile_placeholder SECRET_KEY_BASE=precompile_placeholder bundle exec rails assets:precompile && \
    yarn cache clean

# Set the work dir and the container entry point
WORKDIR /opt/mastodon
ENTRYPOINT ["/usr/bin/tini", "--"]
EXPOSE 3000 4000
