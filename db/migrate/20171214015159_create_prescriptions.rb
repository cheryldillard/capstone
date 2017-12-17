class CreatePrescriptions < ActiveRecord::Migration[5.1]
  def change
    create_table :prescriptions do |t|
      t.string :number
      t.string :dosage
      t.string :regimen

      t.timestamps
    end
  end
end
