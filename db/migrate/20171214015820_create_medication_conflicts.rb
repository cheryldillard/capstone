class CreateMedicationConflicts < ActiveRecord::Migration[5.1]
  def change
    create_table :medication_conflicts do |t|
      t.integer :medication1_id
      t.integer :medication2_id

      t.timestamps
    end
  end
end
