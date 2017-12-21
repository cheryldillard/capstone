Rails.application.routes.draw do
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  get "/users" => "users#create"

  get "/prescriptions" => "prescriptions#index"
  post "/prescriptions" => "prescriptions#create"
  get "/prescriptions" => "prescriptions#show"
  patch "/prescriptions" => "prescriptions#update"
  delete "/prescriptions" => "prescriptions#destroy"


end
