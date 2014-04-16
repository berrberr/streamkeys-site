# A sample Guardfile
# More info at https://github.com/guard/guard#readme

guard "jekyll-plus", :serve => true, :config => ['_config.yml'] do
  watch /.*/
  ignore /^_site/, /sinatra/
end

guard 'livereload' do
  watch /.*/
end
