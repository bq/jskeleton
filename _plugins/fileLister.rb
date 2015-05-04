module Jekyll

  class FileLister < Liquid::Tag

    def initialize(tag_name, directory, tokens)
      super
      @markup = getMarkup(directory.strip)

    end

    def getMarkup(directory)

      markup = ''

      markup <<  "<select id='select-theme'>"

      Dir[directory + "/*/"].map do |a|

        files = Dir.glob(File.join(directory + "/" + File.basename(a) + "/**", "*.css"))

        if files
          markup << "<option value=\"#{File.basename(a)}\">#{File.basename(a)}</option>"
        end

      end

      markup << "</select>"

      markup

    end

    def render(context)

      "#{@markup}"

    end

  end

end

Liquid::Template.register_tag('file_lister', Jekyll::FileLister)