class User < ApplicationRecord
  has_secure_password

  has_many :prescriptions
  has_many :medications
end
