require 'sinatra'
require 'mandrill'

post '/contact' do
  #MANDRILL_APIKEY env var must be set
  m = Mandrill::API.new ENV['MANDRILL_APIKEY']
  request_origin = request.env['HTTP_ORIGIN']
  accepted_origins = ['http://0.0.0.0:4000', 'http://localhost:4000']

  #If the request is not coming from accept host reject it
  unless accepted_origins.include? request_origin
    halt 500
  end

  message = {
    :subject => 'Streamkeys contact form',
    :from_name => 'Streamkeys',
    :text => "Url: #{params[:url]}\nEmail: #{params[:email]}\nMessage: #{params[:message]}",
    :to => [
      {
        :email => 'minilogo@gmail.com',
        :name => 'Alex'
      }
    ],
    :from_email => 'alex@aegabriel.com'
  }

  response.headers['Access-Control-Allow-Origin'] = request_origin
  sending = m.messages.send message
  halt 200
end
