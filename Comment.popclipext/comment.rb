#!/usr/bin/ruby

input = ENV['POPCLIP_TEXT']
action = ENV['POPCLIP_ACTION_IDENTIFIER']

case action
when 'hash'
	print input.split("\n").map {|line|
		"# #{line}"
	}.join("\n")
when 'css'
	space = input.match(/^((?:\n\s*)*)\S.*?((?:\n\s*)*)$/m)
	print "#{space[1]}/* #{input.strip} */#{space[2]}"
when 'slash'
	print input.split("\n").map {|line|
		"// #{line}"
	}.join("\n")
else # html
	space = input.match(/^([\s\n]*)\S.*?([\s\n]*)$/m)
	print "#{space[1]}<!-- #{input.strip} -->#{space[2]}"
end
