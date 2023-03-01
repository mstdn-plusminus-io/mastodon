# frozen_string_literal: true

class UnreactionWorker
  include Sidekiq::Worker

  def perform(account_id, status_id)
    UnreactionService.new.call(Account.find(account_id), Status.find(status_id))
  rescue ActiveRecord::RecordNotFound
    true
  end
end
