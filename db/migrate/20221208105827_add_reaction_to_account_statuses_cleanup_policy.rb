class AddReactionToAccountStatusesCleanupPolicy < ActiveRecord::Migration[6.1]
  def change
    add_column :account_statuses_cleanup_policies, :keep_self_reaction, :boolean, null: false, default: true
    add_column :account_statuses_cleanup_policies, :min_reactions, :integer, null: true
  end
end
