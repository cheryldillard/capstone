class MedicationConflict < ApplicationRecord
  belongs_to :medication1, class_name: "Medication"
  belongs_to :medication2, class_name: "Medication"
end
