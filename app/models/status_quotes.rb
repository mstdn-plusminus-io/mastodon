# frozen_string_literal: true

class StatusQuotes
  include Dynamoid::Document

  table name: :status_quotes, key: :status_id

  field :quote_id
  field :original_url
  field :local_url
end
