class FdaController < ApplicationController
  def search
    search_terms = params[:search]
    response = Unirest.get("https://api.fda.gov/drug/label.json?search=openfda.brand_name:#{search_terms}&limit=1")
    render json: response.body
  end
end
