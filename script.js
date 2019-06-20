var MortgageCalculatorModule = (function () {
	/*----------------------------------------
		Private Methods
	 ------------------------------------------*/
	/**
	 * Convert Percent into Decimal
	 * @param {Number} percent - Number from percentage input
	 * @return decimal
	 */
	var _percentToDecimal = function( percent ) {
		return ( percent / 12 ) / 100;
	}

	/**
	 * Convert years into months
	 * @param {Number} year - year form input field 
	 * @return Months in Numbers
	 */
	var _yearsToMonth = function( year ) {
		return year * 12;
	}

	/*----------------------------------------
		Public Methods
	 ------------------------------------------*/
	/**
	 * Formula:
	 * c = ((6.5 / 100 / 12) * 20000) / (1 - (Math.pow((1+ (6.5/100/12)), (-30 * 12))))
	 * @param {Float} p - Amount Borrowed
	 * @param {Number} r - Interest as a Percentage
	 * @param {Number} n - Term in years
	 * @return Number of Montly Payments
	 */
	var calculateMortgage = function(p, r, n) {
		// convert this percentage to a decimal
		r = _percentToDecimal( r );
	
		// convert years to months
		n = _yearsToMonth( n );
	
		// payments raw (type long)
		var pmt = (r * p) / (1 - (Math.pow((1 + r), (-n))));
	
		// fix decimals - display only two decimals
		monthlyPayments = parseFloat( pmt.toFixed(2) );
	
		// return number of payments
		return monthlyPayments;
	}

	return {
		calculateMortgage: calculateMortgage
	}

})();
	
// // Calculator Button
// var button = document.getElementById( 'calculate' );
// button.addEventListener('click', function () {
// 	/**
// 	 * DOM Variables
// 	 */
// 	var loanAmount =  document.getElementById('amount').value,
// 		downPayment = document.getElementById('downPayment').value,
// 		apr = document.getElementById('interestApr').value,
// 		termInYears = document.getElementById('termInYears').value,
// 		resultDiv = document.getElementById('results'),
// 		result;

// 	loanAmount = parseFloat( loanAmount );
// 	downPayment = parseFloat( downPayment );
// 	apr = parseFloat( apr );
// 	termInYears = parseInt( termInYears );

// 	// substract downpayment if there is value on downpayment field
// 	if ( downPayment ) {
// 		loanAmount = loanAmount - downPayment;
// 	}

// 	result = MortgageCalculatorModule.calculateMortgage( loanAmount, apr, termInYears );
// 	resultDiv.innerHTML = result;
// });

var calculatorValues = {
	loanAmount: document.getElementById('amount'),
	downPayment: document.getElementById('downPayment'),
	apr: document.getElementById('interestApr'),
	termInYears: document.getElementById('termInYears'),
	resultDiv: document.getElementById('results')
}
var loanAmountValue = calculatorValues.loanAmount.addEventListener('keyup', getValues);
var downPaymentValue = calculatorValues.downPayment.addEventListener('keyup', getValues);
var aprValue = calculatorValues.apr.addEventListener('keyup', getValues);
var termInYearsValue = parseInt(calculatorValues.termInYears.value);

// if ( downPayment ) {
// 	loanAmountValue = loanAmountValue - downPayment;
// }
// var result = MortgageCalculatorModule.calculateMortgage( loanAmountValue, aprValue, termInYearsValue );
// calculatorValues.resultDiv.innerHTML = result;



function getValues(e) {
	var loan, down, apr;
	var currentElement = e.target.getAttribute('id');
	if ( currentElement === 'amount' ) {
		loan = (loan) ? e.target.value : 5000;
	} else if ( currentElement === 'downPayment' ) {
		down = (down) ? e.target.value : 1000;
		loan = loan - down;
	} else if ( currentElement === 'interestApr' ) {
		apr = e.target.value || 4.5;
	}

	var result = MortgageCalculatorModule.calculateMortgage(loan, apr, termInYearsValue);
	calculatorValues.resultDiv.innerHTML = result;
}

