Rails.application.routes.draw do
  get '/'=>'home#index' #Langing page

  #Tasks routes
  resources :tasks
end
