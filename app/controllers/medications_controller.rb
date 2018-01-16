class MedicationsController < ApplicationController
  def index 
    if current_user
      medications = current_user.medications
    else
      medications = Medication.all 
    end
    render json: medications.as_json
    # user_search_terms = params[:search]
    # if user_search_terms 
    #   medications = medications 
    # end 
  end 
end
