class AddUserIdToPrescriptions < ActiveRecord::Migration[5.1]
  def change
    add_column :prescriptions, :user_id, :integer
  end
end
