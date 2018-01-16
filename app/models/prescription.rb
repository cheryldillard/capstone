class Prescription < ApplicationRecord
  belongs_to :user
  belongs_to :medication

  def conflict_exists
    user.prescriptions.each do |prescription|
      prescription.medication.conflicts.each do |conflict|
        if conflict[:id] == medication.id
          return true
        end
      end
    end
    return false
  end

  def as_json
    {
      id: id,
      number: number,
      regimen: regimen,
      dosage: dosage,
      medication: medication.as_json,
      obsolete: obsolete,
      conflict: conflict_exists
    }
  end
end
