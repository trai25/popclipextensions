#!/usr/bin/ruby

# action identifier from Config.yaml submenu
comment = ENV['POPCLIP_OPTION_CRITICMARKUPCOMMENT'].to_s

commentmarkup = comment == '' ? '' : "{>>#{comment} - #{Time.now.strftime('%F %T')}<<}"

ctrlcmdprefix = '{~~'
ctrlcmdsuffix = '~> ~~}'
ctrlprefix = '{++'
ctrlsuffix = '++}'
cmdprefix = '{--'
cmdsuffix = '--}'
shiftprefix = '{>>'
shiftsuffix = '<<}'
prefix = '{=='
suffix = '==}'

input = ENV['POPCLIP_TEXT']
action = ENV['POPCLIP_ACTION_IDENTIFIER']

case action
when 'delete'
	print "#{cmdprefix}#{input}#{cmdsuffix}#{commentmarkup}"
when 'comment'
	print "#{shiftprefix}#{comment}: #{input}#{shiftsuffix}"
when 'insert'
	print "#{ctrlprefix}#{input}#{ctrlsuffix}#{commentmarkup}"
when 'change'
	print "#{ctrlcmdprefix}#{input}#{ctrlcmdsuffix}#{commentmarkup}"
else # highlight
	print "#{prefix}#{input}#{suffix}#{commentmarkup}"
end
