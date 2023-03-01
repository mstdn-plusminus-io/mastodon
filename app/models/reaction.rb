# frozen_string_literal: true

# == Schema Information
#
# Table name: reactions
#
#  id              :bigint(8)        not null, primary key
#  account_id      :bigint(8)
#  status_id       :bigint(8)
#  name            :string           default(""), not null
#  custom_emoji_id :bigint(8)
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#

class Reaction < ApplicationRecord
  include Paginable

  update_index('statuses', :status)

  belongs_to :account, inverse_of: :reactions
  belongs_to :status, inverse_of: :reactions

  has_one :notification, as: :activity, dependent: :destroy

  validates :status_id, uniqueness: { scope: :account_id }

  belongs_to :custom_emoji, optional: true
  validates :name, presence: true
  validates_with StatusReactionValidator

  before_validation :set_custom_emoji

  before_validation do
    self.status = status.reblog if status&.reblog?
  end

  after_create :increment_cache_counters
  after_destroy :decrement_cache_counters

  private

  def set_custom_emoji
    return if custom_emoji.present?
    self.custom_emoji = CustomEmoji.local.find_by(disabled: false, shortcode: name) if name.present?
  end

  def increment_cache_counters
    status&.increment_count!(:reactions_count)
  end

  def decrement_cache_counters
    return if association(:status).loaded? && status.marked_for_destruction?
    status&.decrement_count!(:reactions_count)
  end
end
