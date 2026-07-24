#!/usr/bin/perl

# ThisService Perl service script example
# Service type: Filter.
# Revision 1.

# Perl practices:
#  Enables strict mode, requiring that variables are first declared with 'my'.
#  This, along with specifying '-w' in the magic first line, is widely
#  considered good Perl practice.
use strict;

# Unicode considerations:
#  '-CIO' in the magic first line enables Perl to consider STDIN to always
#  contain UTF-8, and to always output to STDOUT in UTF-8.

my $result = "";
my %last_marker = ();	# Store last marker used for each list depth
$last_marker{0} = "";

my $last_leading_space = "";
my $g_tab_width = 4;
my $g_list_level = 0;

my $line;
my $marker;
my $item;
my $leading_space;
my @bullet_cycle = ('*', '-', '+');
my $modifier_flags = $ENV{"POPCLIP_MODIFIER_FLAGS"};
my $is_numbered = ($modifier_flags == 524288) ? 1 : 0;
my $is_clear = ($modifier_flags == 1572864) ? 1 : 0;

sub bullet_marker_for_level {
	my ($level) = @_;
	return $bullet_cycle[$level % scalar(@bullet_cycle)];
}

my @resultLines = split /\n/, $ENV{"POPCLIP_TEXT"};
foreach my $line (@resultLines) {
	next if $line =~ /^[\s\t]*$/;
	if ( $is_numbered ) { # Option, use numbered list
		$line =~ s/^([ \t]*)(\d+\. |[\*\+\-] )?/${1}1. /;
	} elsif ( $is_clear ) { # Command-option, clear list
		$line =~ s/^([ \t]*)(\d+\. |[\*\+\-] )?\s*(.*)/${1}${3}/;
		$result .= $line . "\n";
		next;
	} else {
		$line =~ s/^([ \t]*)(\d+\. |[\*\+\-] )?/${1}* /; # None, use bullet list
	}
	$line =~ /^([ \t]*)([\*\+\-]|\d+\.)(\.?\s*)(.*)/;
	$leading_space = $1;
	$marker = $2;
	$item = " " . $4;

	$leading_space =~ s/\t/    /g;	# Convert tabs to spaces

	if ( $line !~ /^([ \t]*)([\*\+\-]|\d+\.)/) {
		#$result .= "a";
		# not a list line
		$result .= $line;
		$marker = $last_marker{$g_list_level};
	} elsif (length($leading_space) > length($last_leading_space)+3) {
		# New list level
		#$result .= "b";
		$g_list_level++;

		if ($is_numbered) {
			$marker =~ s{
				(\d+)
			}{
				# Reset count
				"1";
			}ex;
		} else {
			$marker = bullet_marker_for_level($g_list_level);
		}

		$last_leading_space = $leading_space;

		$result .= "\t" x $g_list_level;
		$result .= $marker . $item . "\n";
	} elsif (length($leading_space)+3 < length($last_leading_space)) {
		#$result .= "c";
		# back to prior list level
		$g_list_level = length($leading_space) / 4;

		if ($is_numbered) {
			# update marker
			$marker = $last_marker{$g_list_level};
			$marker =~ s{
				(\d+)
			}{
				$1+1;
			}ex;
		} else {
			$marker = bullet_marker_for_level($g_list_level);
		}

		$last_leading_space = $leading_space;

		$result .= "\t" x $g_list_level;
		$result .= $marker . $item . "\n";
	} else {
		# No change in level
		#$result .= "d";

		if ($is_numbered) {
			# update marker if it exists
			if ($last_marker{$g_list_level} ne "") {
				$marker = $last_marker{$g_list_level};
				$marker =~ s{
					(\d+)
				}{
					$1+1;
				}ex;
			}
		} else {
			$marker = bullet_marker_for_level($g_list_level);
		}


		$last_leading_space = $leading_space;

		$result .= "\t" x $g_list_level;
		$result .= $marker . $item . "\n";
	}

		$last_marker{$g_list_level} = $marker;
}

$result =~ s/\n$//;
print $result;
