# frozen_string_literal: true

class UnreactionService < BaseService
  include Payloadable

  def call(account, status)
    reaction = Reaction.find_by!(account: account, status: status)
    reaction.destroy!
    create_notification(reaction) if !status.account.local? && status.account.activitypub?
    reaction
  end

  private

  def create_notification(reaction)
    status = reaction.status
    ActivityPub::DeliveryWorker.perform_async(build_json(reaction), reaction.account_id, status.account.inbox_url)
  end

  def build_json(reaction)
    Oj.dump(serialize_payload(reaction, ActivityPub::UndoEmojiReactSerializer))
  end
end
