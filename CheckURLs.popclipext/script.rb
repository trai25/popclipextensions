#!/usr/bin/env ruby
require 'open3'

debug = ARGV[0] =~ /(debug|-?d)/ ? true : false

unless debug
  input = ENV['POPCLIP_TEXT']
else
  input =<<ENDINPUT
surrounding text https://brettterpstra.com other text

Today's 9:30 Coffee Break: False Beginnings. (More on the Blog - http://minnesota.publicradio.org/collections/special/columns/music_blog/archive/2010/05/monday_coffee_b_31.shtml)

ENDINPUT
end

output = input.dup
workflow = File.join(__dir__, "PreviewURL.workflow")
urls = input.scan(/((?:(?:http|https):\/\/)[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&amp;:\/~\+#\(\)_]*[\w\-\@^=%&amp;\/~\+#\(\)])?)/mi)

urls.each do |url|

  if url.length == 3

    url = url[0]

    if url =~ /\)/ && url !~ /\(/
      url = url.sub(/\).*?$/,'')
    end

    new_url, error, status = Open3.capture3(
      "/usr/bin/automator", "-i", url, workflow
    )
    warn error unless status.success? || error.empty?
    new_url = new_url.strip
    if status.success? && new_url.length > 0
      output.sub!(/#{url}/,new_url)
    end
  end
end

bundle_id = ENV['POPCLIP_BUNDLE_IDENTIFIER']
if bundle_id && bundle_id.match?(/\A[\w.-]+\z/)
  system(
    "/usr/bin/osascript",
    "-e",
    "tell application id \"#{bundle_id}\" to activate"
  )
end
print output

