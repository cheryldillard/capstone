class UsersController < ApplicationController
  def create
    user = User.new(
      first_name: params[:firstName],
      last_name: params[:lastName],
      email: params[:email],
      password: params[:password],
      password_confirmation: params[:passwordConfirmation]
      ) 
    if user.save 
      render json: {status: 'User created successfully'}, status: :created
    else
      render json: {errors: user.errors.full_messsages}, status: :bad_request
    end
  end
end
