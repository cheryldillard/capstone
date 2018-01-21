class AddImageToMedications < ActiveRecord::Migration[5.1]
  def change
    add_column :medications, :image, :string
  end
end
