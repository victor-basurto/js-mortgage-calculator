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
	/**
	 * Formula:
	 * c = ((6.5 / 100 / 12) * 20000) / (1 - (Math.pow((1+ (6.5/100/12)), (-30 * 12))))
	 * @param {Float} p - Amount Borrowed
	 * @param {Number} r - Interest as a Percentage
	 * @param {Number} n - Term in years
	 * @return Number of Montly Payments
	 */
	var _calculateMortgage = function(p, r, n) {
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
	var roundToNearestHalf = function (amount, precision) {
		return Math.round( amount / precision ) * precision;
	}
	var _percentToAmount = function (amount, percent) {
		var result = ( amount * percent ) / 100;
		return parseInt( result );
	}

	var _amountToPercent = function (amount, dp) {
		var result = (dp / amount) * 100;
		return parseFloat( result ).toFixed( 2 );
	}

	var _setNewValue = function (opts) {
		
		if ( typeof opts !== 'object' ) {
			return;
		}

		if ( opts.newLoan ) {
			opts.loanamountElement.value = opts.newLoan;
			opts.newAmountElement.value = opts.newAmount;
		} else {
			opts.newAmountElement.value = opts.newAmount;
		}
	}
	/*----------------------------------------
		Public Methods
	 ------------------------------------------*/
	/**
	 * Move this function to CalculatorModule
	 * @param {HTMLElement} e - Current Element 
	 */
	var updateValues = function (e) {
		// temporary var
		var currentElement = e.currentTarget,
			elementName = currentElement.getAttribute('name'),
			amounts = {};

		// initial values
		var initHomeValue = calculatorElements.getHomeValue(),
			initLoan = calculatorElements.getLoanAmountValue(),
			initDownPay = calculatorElements.getLoanAmountValue(),
			initPercent = calculatorElements.getPercentValue(),
			initApr = calculatorElements.getAprValue(),
			initTermInYears = calculatorElements.getTermInYearsValue(),
			currentLoanAmount;

		if ( elementName === 'homevalue' ) {
			var currentHomeValue, percentageValue;


			currentHomeValue = parseFloat( currentElement.value ).toFixed(2);
			percentageValue = parseFloat( calculatorElements.getPercentValue() ).toFixed(2);
			amounts.newLoan = currentHomeValue - ((currentHomeValue * percentageValue) / 100);
			amounts.loanamountElement = calculatorElements.loanAmount;
			amounts.newAmount = (currentHomeValue * percentageValue) / 100;
			amounts.newAmountElement = calculatorElements.downPayment;


			_setNewValue( amounts );
			currentLoanAmount = parseInt(calculatorElements.loanAmount.value);
			currentLoanAmount = (!currentLoanAmount || currentLoanAmount === 'undefined' || isNaN(currentLoanAmount)) ? alert('no amoung for loan') : currentLoanAmount;

			console.log(`p: ${initHomeValue} \nr: ${initApr} \nn: ${initTermInYears}`);

		} else if ( elementName === 'loan' ) {
			var currentAmmount = parseFloat(currentElement.value).toFixed(2);
			initHomeValue = ((currentAmmount <= 5000 || isNaN( currentAmmount )) ? 5000 : currentAmmount) - initDownPay;
			console.log(initLoan)
			console.log(`p: ${initHomeValue} \nr: ${initApr} \nn: ${initTermInYears}`);

		} else if ( elementName === 'dp' || elementName === 'percent' || elementName === 'homevalue' ) {
			switch(elementName) {
				case 'dp':
					var dpToPercent, currentDown; 
					currentDown = parseFloat( currentElement.value ).toFixed(2);
					initDownPay = (!isNaN( currentDown )) ? currentDown : 0;
					dpToPercent = _amountToPercent( initLoan, initDownPay );
					currentHomeValue = calculatorElements.getHomeValue();

					amounts.newAmount = (!dpToPercent || dpToPercent === 'undefined') ? initPercent : dpToPercent;
					amounts.newAmountElement = calculatorElements.percentage;

					amounts.newLoan = currentHomeValue - initDownPay;
					amounts.loanamountElement = calculatorElements.loanAmount;

					currentLoanAmount = parseInt(calculatorElements.loanAmount.value);
					currentLoanAmount = (!currentLoanAmount || currentLoanAmount === 'undefined' || isNaN(currentLoanAmount)) ? alert('no amoung for loan') : currentLoanAmount;

					console.log(initLoan)
					break;
				case 'percent':
					var percentToDp, currentAmmount;
					currentAmmount = parseFloat( currentElement.value ).toFixed(2);
					currentAmmount = (isNaN(currentAmmount)) ? 0 : currentAmmount;
					percentToDp = _percentToAmount(calculatorElements.getHomeValue(), currentAmmount);
					amounts.newAmount = (!percentToDp || percentToDp === 'undefined') ? initDownPay : percentToDp;
					amounts.newAmountElement = calculatorElements.downPayment;

					amounts.newLoan = currentHomeValue - initDownPay;
					amounts.loanamountElement = calculatorElements.loanAmount;

					currentLoanAmount = parseInt(calculatorElements.loanAmount.value);
					currentLoanAmount = (!currentLoanAmount || currentLoanAmount === 'undefined' || isNaN(currentLoanAmount)) ? alert('no amoung for loan') : currentLoanAmount;

					break;
			}
			_setNewValue( amounts );
			currentLoanAmount = parseInt(calculatorElements.loanAmount.value);
			currentLoanAmount = (!currentLoanAmount || currentLoanAmount === 'undefined' || isNaN(currentLoanAmount)) ? alert('no amoung for loan') : currentLoanAmount;
			console.log(initLoan)

		} else if ( elementName === 'apr' ) {
			var currentApr = parseFloat( currentElement.value ).toFixed(2);
			initApr = (currentApr <= 1 || isNaN( currentApr )) ? 1 : currentApr;
			currentLoanAmount = parseInt(calculatorElements.loanAmount.value);
			currentLoanAmount = (!currentLoanAmount || currentLoanAmount === 'undefined' || isNaN(currentLoanAmount)) ? alert('no amoung for loan') : currentLoanAmount;
			console.log(initLoan)
			console.log(`p: ${initHomeValue} \nr: ${initApr} \nn: ${initTermInYears}`);
		} else if ( elementName === 'dropdown' ) {
			currentLoanAmount = parseInt(calculatorElements.loanAmount.value);
			currentLoanAmount = (!currentLoanAmount || currentLoanAmount === 'undefined' || isNaN(currentLoanAmount)) ? alert('no amoung for loan') : currentLoanAmount;
			console.log(initLoan)
			initApr = initApr || 1;
			initTermInYears = parseInt(10, currentElement.value );
			console.log(`p: ${initLoan} \nr: ${initApr} \nn: ${initTermInYears}`);
		}

		console.log(`initLoan ${initLoan} \nInitApr ${initApr} \nInitTermInYears ${initTermInYears}`)

		// update results every keyup
		MortgageCalculatorModule.initCalculator( currentLoanAmount, initApr, initTermInYears, calculatorElements.resultDiv );
	}
	var initCalculator = function (p, r, n, resultEl) {
		var result = _calculateMortgage(p, r, n);
		resultEl.innerHTML = result;
	}
	

	return {
		initCalculator: initCalculator,
		updateValues: updateValues
	}
})();
	
/**
 * TODO:
 * 	Create element Percentage
 */
var calculatorElements = {
	formSection: document.querySelector( '.form-section' ),	// reference to form
	homeValue: document.getElementById('home-value'),
	loanAmount: document.getElementById( 'amount' ),
	downPayment: document.getElementById( 'downPayment' ), // default 20%
	percentage: document.getElementById( 'percent' ),
	apr: document.getElementById( 'interestApr' ),
	termInYears: document.getElementById( 'termInYears' ),
	resultDiv: document.getElementById( 'results' ),
	getHomeValue: function() {
		return parseInt(this.homeValue.value) || 0;
	},
	getLoanAmountValue: function () {
		return parseFloat( this.loanAmount.value ).toFixed( 2 ) || 0;
	},
	getLoanAmountCalcValue: function () {
		var result =  this.getHomeValue() - ((this.getHomeValue() * this.getPercentValue() ) / 100);
		console.log(result);
		return this.loanAmount.value = result;
	},
	getPercentValue: function () {
		return parseFloat( this.percentage.value ).toFixed(2) || 0;
	},
	getDownpaymentValue: function () {
		return parseFloat( this.downPayment.value ).toFixed( 2 ) || 0;
	},
	getDownpaymentCalcValue: function () {
		var result = (this.getHomeValue() * this.getPercentValue() ) / 100;
		this.downPayment.value = result;
	},
	getLoanDownPaymentResult: function () {
		if ( this.getDownpaymentCalcValue() ) {
			return this.getLoanAmountCalcValue() - this.getDownpaymentCalcValue();
		} else {
			return this.getLoanAmountCalcValue();
		}
	},
	getAprValue: function () {
		return parseFloat( this.apr.value ).toFixed(2) || 0;
	},
	getTermInYearsValue: function () {
		return parseInt( 10, this.termInYears.value );
	},

	errors: {
		/**
		 * TODO:
		 * 	Set errors
		 */
	}
}

/**
 * Initialize Results
 */
MortgageCalculatorModule.initCalculator(
	calculatorElements.getLoanDownPaymentResult(), 
	calculatorElements.getAprValue(), 
	calculatorElements.getTermInYearsValue(),
	calculatorElements.resultDiv
);

/**
 * Event Listeners for each input
 */
calculatorElements.homeValue.addEventListener('keyup', MortgageCalculatorModule.updateValues, false);
calculatorElements.loanAmount.addEventListener('keyup', MortgageCalculatorModule.updateValues, false);
calculatorElements.percentage.addEventListener('keyup', MortgageCalculatorModule.updateValues, false);
calculatorElements.apr.addEventListener('keyup', MortgageCalculatorModule.updateValues, false);
calculatorElements.downPayment.addEventListener('keyup', MortgageCalculatorModule.updateValues, false);
calculatorElements.termInYears.addEventListener('change', MortgageCalculatorModule.updateValues, false);