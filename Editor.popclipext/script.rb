#!/usr/bin/ruby

include_datetime = ENV['POPCLIP_OPTION_INCLUDEDATETIME']
date = include_datetime.to_i == 1 ? Time.now.strftime(' datetime="%FT%T%z"') : ""
prefix = "<mark>"
suffix = "</mark>"
ctrlprefix = "<ins#{date}>"
ctrlsuffix = "</ins>"
cmdprefix = "<del#{date}>"
cmdsuffix = "</del>"
optprefix = "<!-- "
optsuffix = " -->"

input = ENV['POPCLIP_TEXT']
action = ENV['POPCLIP_ACTION_IDENTIFIER']

space = input.match(/^([\s\n]*)\S.*?([\s\n]*)$/m)
case action
when 'insert'
	print "#{space[1]}#{ctrlprefix}#{input.strip}#{ctrlsuffix}#{space[2]}"
when 'delete'
	print "#{space[1]}#{cmdprefix}#{input.strip}#{cmdsuffix}#{space[2]}"
when 'comment'
	print "#{space[1]}#{optprefix}#{input.strip}#{optsuffix}#{space[2]}"
else
	print "#{space[1]}#{prefix}#{input.strip}#{suffix}#{space[2]}"
end



