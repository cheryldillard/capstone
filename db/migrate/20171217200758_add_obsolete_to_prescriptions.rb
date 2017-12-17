class AddObsoleteToPrescriptions < ActiveRecord::Migration[5.1]
  def change
    add_column :prescriptions, :obsolete, :string
  end
end
