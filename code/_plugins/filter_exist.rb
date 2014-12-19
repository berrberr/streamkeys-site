module Jekyll
  module FilterExist
    def filter_exist(arr, prop)
      return arr.select{ |item| item[prop] }
    end
  end
end

Liquid::Template.register_filter(Jekyll::FilterExist)
