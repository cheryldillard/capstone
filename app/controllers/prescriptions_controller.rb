class PrescriptionsController < ApplicationController
  def index 
    prescriptions = Prescription.all 
    render json: prescriptions.as_json
    # user_search_terms = params[:search]
    # if user_search_terms 
    #   prescriptions = prescriptions 
    # end 
  end 

  def create 
    prescription = Prescription.new(
      number: params[:inputNumber],
      dosage: params[:inputDosage],
      regimen: params[:inputRegimen],
      medication_id: 1,  #params["id"]
      user_id: current_user.id,
      obsolete: false
      )
    if prescription.save
      render json: prescription.as_json
    else
      render json: {errors: prescription.errors.full_messages}, status: bad_request
    end
  end 

  # def show 
  #   prescription_id = params["id"]
  #   prescription = Prescription.find_by(id: prescription_id)
  #   render json: prescription.as_json
  # end  

  # def update
  #   if current_user #&& current_user.admin
  #     prescription_id = params["id"]
  #     prescription = Prescription.find_by(id: prescription_id)
  #     prescription.number = params["input_number"] || prescription.number
  #     prescription.dosage = params["dosage"] || prescription.dosage
  #     prescription.regimen = params["regimen"] || prescription.regimen
  #     if prescription.save
  #       render json: prescription.as_json
  #     else
  #       render json: {errors: prescription.errors.full_messages}, status: :bad_request
  #     end
    # else
    #   render json: {errors: "Not Authorized"}, status: unauthorized
  #   end
  # end 

  # def destroy
  #   if current_user #&&current_user.admin
  #     prescription_id = params["id"]
  #     prescription = Prescription.find_by(id: prescription_id)
  #     prescription.destroy
  #     render json: {message: "Prescription successfully deleted!"}
  #   # else
  #   #   render json: {errors: "Not Authorized!"}, status: unauthorized
  #   end
  # end
end
