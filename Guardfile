# A sample Guardfile
# More info at https://github.com/guard/guard#readme

guard "jekyll-plus", :serve => true, :extensions => ["js", "rb"], :config => ["_config.yml"] do
  watch(%r{code/([^.].*)\.(js|html|sass|scss|yml|erb)})
end

guard "livereload" do
  watch(%r{build/.*})
end
