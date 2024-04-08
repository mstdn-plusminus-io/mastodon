# frozen_string_literal: true

require 'dynamoid'

Dynamoid.configure do |config|
  config.access_key = ENV.fetch('DYNAMODB_AWS_ACCESS_KEY_ID', nil) || ENV.fetch('AWS_ACCESS_KEY_ID', nil)
  config.secret_key = ENV.fetch('DYNAMODB_AWS_SECRET_ACCESS_KEY', nil) || ENV.fetch('AWS_SECRET_ACCESS_KEY', nil)
  config.region = ENV.fetch('DYNAMODB_REGION', 'ap-northeast-1')
  config.namespace = ENV.fetch('DYNAMODB_NAMESPACE', nil)

  raise 'Missing DynamoDB namespace!' if config.access_key.present? && config.secret_key.present? && config.namespace.blank? && Rails.application.config.x.dynamodb_enabled
end

