Rails.application.routes.draw do
  post "/user_token" => "user_token#create"
  post "/users" => "users#create"
  
  get "/prescriptions" => "prescriptions#index"
  post "/prescriptions" => "prescriptions#create"
  get "/prescriptions/:id" => "prescriptions#show"
  patch "/prescriptions/:id" => "prescriptions#update"
  delete "/prescriptions" => "prescriptions#destroy"

  get "/medications" => "medications#index"

  get "/fda_search" => "fda#search"
end
