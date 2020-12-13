FROM tootsuite/mastodon:edge as build-dep

USER root

RUN rm -rf /opt/mastodon

# Use bash for the shell
SHELL ["bash", "-c"]

ENV PATH="${PATH}:/opt/ruby/bin:/opt/node/bin"

RUN mkdir -p /var/cache/apt/archives/partial && \
  touch /var/cache/apt/archives/lock && \
  chmod 640 /var/cache/apt/archives/lock

# 結構てきとー
RUN apt update && \
  apt -y install git libicu-dev libidn11-dev \
	libpq-dev libprotobuf-dev protobuf-compiler \
	build-essential bison libyaml-dev libgdbm-dev \
	libreadline-dev libncurses5-dev libffi-dev \
	zlib1g-dev libssl-dev

COPY Gemfile* package.json yarn.lock /opt/mastodon/

RUN cd /opt/mastodon && \
  bundle config set deployment 'true' && \
  bundle config set without 'development test' && \
	bundle install -j$(nproc) && \
	yarn install --pure-lockfile

FROM tootsuite/mastodon:edge

USER root

RUN rm -rf /opt/mastodon

# Copy over all the langs needed for runtime
COPY --from=build-dep /opt/node /opt/node
COPY --from=build-dep /opt/ruby /opt/ruby
COPY --from=build-dep /opt/jemalloc /opt/jemalloc

# Add more PATHs to the PATH
ENV PATH="${PATH}:/opt/ruby/bin:/opt/node/bin:/opt/mastodon/bin"

# Change timezone
RUN echo "Asia/Tokyo" > /etc/localtime

# Install mastodon runtime deps
RUN ln -s /opt/mastodon /mastodon && \
	gem install bundler && \
	rm -rf /var/cache && \
	rm -rf /var/lib/apt/lists/*

# Copy over mastodon source, and dependencies from building, and set permissions
COPY --chown=mastodon:mastodon . /opt/mastodon
COPY --from=build-dep --chown=mastodon:mastodon /opt/mastodon /opt/mastodon
RUN chown mastodon:mastodon /opt/mastodon

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
	OTP_SECRET=precompile_placeholder SECRET_KEY_BASE=precompile_placeholder rails assets:precompile && \
	yarn cache clean && \
	rm -rf /opt/mastodon/node_modules/.cache

# Set the work dir and the container entry point
WORKDIR /opt/mastodon
ENTRYPOINT ["/tini", "--"]
EXPOSE 3000 4000
