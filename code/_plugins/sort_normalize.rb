module Jekyll
  module SortNormalize
    def sort_normalize(arr, prop)
      arr.sort_by{ |item| item[prop].downcase }
    end
  end
end

Liquid::Template.register_filter(Jekyll::SortNormalize)
