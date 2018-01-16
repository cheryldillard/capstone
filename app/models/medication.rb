class Medication < ApplicationRecord
  has_many :prescriptions
  # has_many :medication_conflicts

  def conflicts
    result = []
    MedicationConflict.where(medication1_id: id).each do |medication_conflict| 
      medication = Medication.find_by(id: medication_conflict.medication2_id)
      result << {id: medication.id, name: medication.name}
    end
    MedicationConflict.where(medication2_id: id).each do |medication_conflict| 
      medication = Medication.find_by(id: medication_conflict.medication1_id)
      result << {id: medication.id, name: medication.name}
    end
    result
  end

  def as_json
    {
      id: id,
      name: name,
      description: description,
      conflicts: conflicts
    }
  end
end
