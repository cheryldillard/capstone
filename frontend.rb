require "unirest" 
require "pp"


while true
  system "clear"
  puts "Your Personal Prescription Manager! Select an option:"
  puts "[signup] Signup (create a user)"
  puts "[login] Log in (create a jwt)" 
  puts "[logout] Log out (destroy the jwt)"
  puts
  puts "[1] Enter a Prescription"
  puts "[2] Show all Prescriptions"
  puts
  puts "[q] Quit"

  input_option = gets.chomp
  if input_option == "1" 
    params = {}
    print "Enter prescription number: "
    params[:number] = gets.chomp
    print "Enter prescription dosage: " 
    params[:dosage] = gets.chomp
    print "New prescription regimen: "
    params[:regimen] = gets.chomp
    response = Unirest.post("http://localhost:3000/prescriptions", parameters: params)
    prescription = response.body
    if prescription["errors"]
      puts "Please re-enter"
    else
      puts "Prescrioption entered successfully."
      pp prescription
    end

  elsif input_option == "2"
    response = Unirest.get("http://localhost:3000/prescriptions")
    prescriptions = response.body 
    pp prescriptions 


  elsif input_option == "signup"
    print "Enter first_name:"
    input_first_name = gets.chomp
    print "Enter last_name:"
    input_last_name = gets.chomp
    print "Enter Email: "
    input_email = gets.chomp
    print "Enter Password: "
    input_password = gets.chomp
    print "Password confirmation: "
    input_password_confirmation = gets.chomp
    response = Unirest.post("http://localhost:3000/users", parameters: {
        first_name: input_first_name,
        last_name: input_last_name,
        email: input_email,
        password: input_password,
        password_confirmation: input_password_confirmation
    }
    )
    pp response.body

  elsif input_option == "login"
    print "Enter Email: "
    input_email = gets.chomp 
    print "Enter Password: " 
    input_password = gets.chomp 
    response = Unirest.post(
      "http://localhost:3000/user_token", 
      parameters: {
        auth: {
          email: input_email, 
          password: input_password
        }
      }
    )
    #Save the JSON web token from the response
    jwt = response.body["jwt"]
    Unirest.default_header("Authorization", "Bearer #{jwt}")
    pp response.body

  elsif input_option == "log out" 
    jwt = ""
    Unirest.clear_default_headers()
    puts "Logged out successfully!"    

  elsif input_option == "q"
    puts "Goodbye!"
    break
  end
  puts 
  puts "Press enter to continue"
  gets.chomp
end
