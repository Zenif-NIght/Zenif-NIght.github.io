# Use the official Ruby image as a base
FROM ruby:2.7.0-alpine

# Install necessary development tools
RUN apk add --no-cache \
        build-base \
        libffi-dev

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy Gemfile and Gemfile.lock to the container
COPY Gemfile Gemfile.lock ./

# Install Jekyll and other dependencies
RUN gem install bundler:1.16.1 && bundle install



# Expose Jekyll default port
EXPOSE 4000

# Start Jekyll server
CMD ["bundle", "exec", "jekyll", "serve", "--host", "0.0.0.0"]

# # # open a shell
# CMD ["/bin/sh"]
