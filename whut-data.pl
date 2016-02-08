print "Content-type: text/html\n\n";
use Win32::ODBC;
use Time::Local 'timelocal_nocheck';
use CGI::Carp;
$PostTo = lc($ENV{SCRIPT_NAME});
(@List) = split(/\//, $PostTo);
foreach $part (@List) {$PostTo = lc($part)}
$FileDIR = lc($ENV{PATH_TRANSLATED});
$FileDIR =~ s/$PostTo//g;
#$FileDIR = Cwd -> getcwd()."/cgi-bin/gshop";

$Path = $FileDIR;
#require("$FileDIR/G.cfg");
require ("$Path/clientmodule_new.pl");
require ("$Path/dfdm.pm");
my $mydb = Win32::ODBC->new($DSN);
my $index = 0;
my $PreviousUniqueId = "";
$PledgeID = 390753;
$SQL = "SELECT top 20
	IsNull([BFIRST], '')		as [First Name],
	IsNull([BLAST], '')		as [Last Name],
	IsNull(TRANSACT.[PHONE], '')	as [Phone Number],
	IsNull(DXCUSTOMER.[EMAIL],'')	as [Email Address],
	IsNull(TRANSACT.[A1], '')	as [Address],
	IsNull(TRANSACT.[A2], '')	as [Address Continued],
	IsNull(TRANSACT.[CITY], '')	as [City],
	IsNull(TRANSACT.[STATE], '') 	as [State],
	IsNull(TRANSACT.[ZIP], '')	as [Zip Code],
	IsNull([CARDTYPE], '')		as [Credit Card Type],
	IsNull([CARDNUMBER], '')	as [Credit Card Number],
	IsNull([CARDEXPMONTH], '')	as [Expiration Month],
	IsNull([CARDEXPYEAR], '')	as [Expiration Year],
	IsNull([AMOUNT], '0.00')	as [Pledge Amount],
	IsNull([TIMESTAMP], '')		as [Time Stamp],
	IsNull([USERID], '')		as [Unique Id],
	IsNull([EXTRADATA],'') as [Data]
FROM DXCUSTOMER
LEFT JOIN [TRANSACT] ON [TRANSACT].[SESSIONID] = DXCUSTOMER.USERID
WHERE PLEDGEID = 4693563 AND [TIMESTAMP] > '2-14-2012'
order by [TIMESTAMP]";

print "
<!DOCTYPE html>
<html>
	<title>
		Customer Report
	</title>
	<body>
		<table>
			<thead>
				<tr>
					<th>
						#
					</th>
					<th>
						First Name
					</th>
					<th>
						Last Name
					</th>
					<th>
						Phone Number
					</th>
					<th>
						Email Address
					</th>
					<th>
						Address
					</th>
					<th>
						Address Continued
					</th>
					<th>
						City
					</th>
					<th>
						State
					</th>
					<th>
						Zip Code
					</th>
					<th>
						Credit Card Type
					</th>
					<th>
						Credit Card Number
					</th>
					<th>
						Expiration Month
					</th>
					<th>
						Expiration Year
					</th>
					<th>
						Pledge Amount
					</th>
					<th>
						Time Stamp
					</th>
					<th>
						Unique Id
					</th>
					<th>
						Telephone
					</th>
				</tr>
			</thead>
			<tbody>";
if ($mydb->Sql($SQL)) {	&error("GSHOP.002");}
while ($mydb->FetchRow()) {
    undef %SQLData;
	%SQLData = $mydb->DataHash();	
	
	if($PreviousUniqueId eq $SQLData{'Unique Id'})
	{
		next;
	}
	
	$index++;
	$PreviousUniqueId = $SQLData{'Unique Id'};
	

	undef @NVPair;
	undef $n;
	undef $v;
	undef %EXHASH;
	$i++;
	
		(@NVPair) = split(/\|/, $SQLData{'Data'});
	foreach $pair (@NVPair) {
		
		($n, @v) = split (/\:/, $pair);
		$n =uc($n);
		if ($EXHASH{$n} ne '') {next}
		undef $v;
		$vi = 0;
		foreach (@v) {$v .= "$v[$vi] : ";$vi++;}
		substr($v, -3) = "";
		
		if ($n eq 'SALUTATION') {$BlankCount{$i}++;}
		if ($n eq 'CALL CENTER NAME') {$BlankCount{$i}++;}
		if ($n eq 'TEST_PLEDGE') {$BlankCount{$i}++;}
		if ($n eq 'Q_3746526') {
			#print "$v becomes: ";
			#if ($v =~ m/\)/) {($_x, $v) = split(/\) /, $v);}
			$v =~ s/\''/'/g;
			if (substr($v, 1, 1) eq ')') {substr($v, 0, 2) = ""}
			if (substr($v, 2, 1) eq ')') {substr($v, 0, 3) = ""}
			#print "$v<BR>";
			if ($n ne 'BILLING_LAST_NAME' && $n ne 'SHIPPING_LAST_NAME') {$v = &ucf($v);}
			else {$v = &ucf($v,1);}
			}
		if ($n eq '') {$BlankCount{$i}++; $n = "$BlankHash{$BlankCount{$i}}"}
		#if ($n eq '') {print "<h2><font color=red>BLANK CAUGHT [$n: $v]<br></font></h2>";}
		$v = lc($v);
		$v =~ s/\,//g;
		if (lc($v) eq 'none' || lc($v) eq 'n/a' || lc($v) eq 'notgiven' || lc($v) eq 'not given') {$v = ""}
		if (length($v) == 1 && $v eq '.') {
			if ($n ne 'BILLING_ADDRESS') {$v = ""}
			elsif ($n eq 'BILLING_ADDRESS') {$v = "REFUSED"}
			}
		$EXHASH{$n} = ucfirst($v);
		#print "$n: $v<br>";
		}

	
	print "
<tr>
	<td>
		$index.
	</td>
	<td>
		$SQLData{'First Name'}
	</td>
	<td>
		$SQLData{'Last Name'}
	</td>
	<td>
		$EXHASH{'BILLING_TELEPHONE_1'}-$EXHASH{'BILLING_TELEPHONE_2'}-$EXHASH{'BILLING_TELEPHONE_3'}
	</td>
	<td>
		$SQLData{'Email Address'} / $EXHASH{'EMAIL(ON ALL CALLERS)'}
	</td>
	<td>
		$SQLData{'Address'}
	</td>
	<td>
		$SQLData{'Address Continued'}
	</td>
	<td>
		$SQLData{'City'}
	</td>
	<td>
		$SQLData{'State'}
	</td>
	<td>
		$SQLData{'Zip Code'}
	</td>
	<td>
		$SQLData{'Credit Card Type'}
	</td>
	<td>
		$SQLData{'Credit Card Number'}
	</td>
	<td>
		$SQLData{'Expiration Month'}
	</td>
	<td>
		$SQLData{'Expiration Year'}
	</td>
	<td>
		$SQLData{'Pledge Amount'}
	</td>
	<td>
		$SQLData{'Time Stamp'}
	</td>
	<td>
		$SQLData{'Unique Id'}
	</td>
</tr>";
}

print "			</tbody>
		</table>
	</body>
</html>";


