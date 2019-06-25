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
	var _percentToAmount = function (amount, percent) {
		return ( amount * percent ) / 100;
	}

	var _amountToPercent = function (amount, dp) {
		return (dp / amount) * 100;
	}

	var _setNewValue = function (amount, el) {
		el.value = amount;
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
			elementName = currentElement.getAttribute('name');

		// initial values
		var initHomeValue = calculatorElements.getHomeValue(),
			initLoan = calculatorElements.getLoanAmountValue(),
			initDownPay = calculatorElements.getDownpaymentValue(),
			initPercent = calculatorElements.getPercentValue(),
			initApr = calculatorElements.getAprValue(),
			initTermInYears = calculatorElements.getTermInYearsValue();

		if ( elementName === 'loan' ) {
			var currentAmmount = parseFloat(currentElement.value);
			initLoan = ((currentAmmount <= 5000 || isNaN( currentAmmount )) ? 5000 : currentAmmount) - initDownPay;

		} else if ( elementName === 'dp' || elementName === 'percent' ) {
			var newPercentOrDownpaymentAmount, elementToChange;
			switch(elementName) {
				case 'dp':
					var dpToPercent, currentDown; 
					currentDown = parseFloat( currentElement.value );
					initDownPay = (!isNaN( currentDown )) ? currentDown : 0;
					dpToPercent = _amountToPercent( initLoan, initDownPay );
					newPercentOrDownpaymentAmount = (!dpToPercent || dpToPercent === 'undefined') ? initPercent : dpToPercent;
					elementToChange = calculatorElements.percentage;
					break;
				case 'percent':
					var percentToDp, currentAmmount;
					currentAmmount = parseFloat( currentElement.value );
					currentAmmount = (isNaN(currentAmmount)) ? 0 : currentAmmount;
					percentToDp = _percentToAmount(initLoan, currentAmmount);
					newPercentOrDownpaymentAmount = (!percentToDp || percentToDp === 'undefined') ? initDownPay : percentToDp;
					elementToChange = calculatorElements.downPayment;;
					break;
			}
			_setNewValue(newPercentOrDownpaymentAmount, elementToChange);
			initLoan = initLoan - newPercentOrDownpaymentAmount;

		} else if ( elementName === 'apr' ) {
			var currentApr = parseFloat( currentElement.value );
			initApr = (currentApr <= 1 || isNaN( currentApr )) ? 1 : currentApr;
			initLoan = initLoan - initDownPay;
		} else if ( elementName === 'dropdown' ) {
			initLoan = initLoan - initDownPay;
			initApr = initApr || 1;
			initTermInYears = parseInt(10, currentElement.value );
		}

		// update results every keyup
		MortgageCalculatorModule.initCalculator( initLoan, initApr, initTermInYears, calculatorElements.resultDiv );
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
		var result =  this.getHomeValue() - ((this.getHomeValue() * this.getPercentValue() ) / 100);
		console.log(result);
		return this.loanAmount.value = result;
	},
	getPercentValue: function () {
		return parseFloat( this.percentage.value ) || 0;
	},
	getDownpaymentValue: function () {
		return parseFloat( this.downPayment.value ) || 0;
	},
	getLoanDownPaymentResult: function () {
		if ( this.getDownpaymentValue() ) {
			return this.getLoanAmountValue() - this.getDownpaymentValue();
		} else {
			return this.getLoanAmountValue();
		}
	},
	getAprValue: function () {
		return parseFloat( this.apr.value ) || 0;
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
calculatorElements.loanAmount.addEventListener('keyup', MortgageCalculatorModule.updateValues, false);
calculatorElements.percentage.addEventListener('keyup', MortgageCalculatorModule.updateValues, false);
calculatorElements.apr.addEventListener('keyup', MortgageCalculatorModule.updateValues, false);
calculatorElements.downPayment.addEventListener('keyup', MortgageCalculatorModule.updateValues, false);
calculatorElements.termInYears.addEventListener('change', MortgageCalculatorModule.updateValues, false);