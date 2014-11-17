# A sample Guardfile
# More info at https://github.com/guard/guard#readme

guard "jekyll-plus", :serve => true, :extensions => ["js"], :config => ["_config.yml"] do
  watch(%r{code/.*})
end

guard "livereload" do
  watch(%r{build/.*})
end
