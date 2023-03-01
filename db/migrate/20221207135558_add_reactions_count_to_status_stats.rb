class AddReactionsCountToStatusStats < ActiveRecord::Migration[6.1]
  def change
    add_column :status_stats, :reactions_count, :bigint, null: false, default: 0
  end
end
