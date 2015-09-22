require 'sinatra'
require 'mandrill'

post '/contact' do
  puts "[#{Time.now}] - REQUEST FROM: #{request.ip}\n#{request.inspect}"
  #MANDRILL_APIKEY env var must be set
  m = Mandrill::API.new ENV['MANDRILL_APIKEY']
  request_origin = request.env['HTTP_ORIGIN']
  accepted_origins = ['http://www.streamkeys.com', 'http://streamkeys.com', 'http://staging.streamkeys.com', 'http://0.0.0.0:4000', 'http://localhost:4000']

  #If the request is not coming from accepted host reject it
  unless accepted_origins.include? request_origin
    puts "BAD ORIGIN: #{request_origin}"
    halt 500
  end

  #If the request was submitted too quickly it is probably a spambot
  time_diff = Time.now.to_i - (params[:timestamp].to_i / 1000)
  unless time_diff > 4 and time_diff < 3600
    puts "TIMEOUT: #{time_diff}"
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
