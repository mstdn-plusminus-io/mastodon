class CreateReactions < ActiveRecord::Migration[6.1]
  def change
    create_table :reactions do |t|
      t.belongs_to :account, foreign_key: { on_delete: :cascade }
      t.belongs_to :status, foreign_key: { on_delete: :cascade }

      t.string :name, null: false, default: ''
      t.belongs_to :custom_emoji, foreign_key: { on_delete: :cascade }

      t.timestamps
    end

    add_index :reactions, [:account_id, :status_id, :name], unique: true, name: :index_reactions_on_account_id_and_status_id
  end
end
