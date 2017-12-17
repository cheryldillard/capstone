class MedicationConflict < ApplicationRecord
  belongs_to :prescription
  belongs_to :medication 
end
