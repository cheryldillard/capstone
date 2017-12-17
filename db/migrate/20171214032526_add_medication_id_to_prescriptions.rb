class AddMedicationIdToPrescriptions < ActiveRecord::Migration[5.1]
  def change
    add_column :prescriptions, :medication_id, :integer
  end
end
