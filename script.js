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
	/*----------------------------------------
		Public Methods
	 ------------------------------------------*/
	var initCalculator = function (p, r, n, resultEl) {
		var result = _calculateMortgage(p, r, n);
		resultEl.innerHTML = result;
	}
	var percentToAmount = function (amount, percent) {
		return ( amount * percent ) / 100;
	}

	var amountToPercent = function (amount, dp) {
		return (dp / amount) * 100;
	}

	var setNewValue = function (amount, el) {
		console.log(amount)
		el.setAttribute('value', amount);
	}

	return {
		initCalculator: initCalculator,
		percentToAmount: percentToAmount,
		amountToPercent: amountToPercent,
		setNewValue: setNewValue
	}
})();
	
/**
 * TODO:
 * 	Create element Percentage
 */
var calculatorElements = {
	formSection: document.querySelector( '.form-section' ),	// reference to form
	loanAmount: document.getElementById( 'amount' ),
	downPayment: document.getElementById( 'downPayment' ), // default 20%
	percentage: document.getElementById( 'percent' ),
	apr: document.getElementById( 'interestApr' ),
	termInYears: document.getElementById( 'termInYears' ),
	resultDiv: document.getElementById( 'results' ),
	getLoanAmountValue: function () {
		return parseFloat( this.loanAmount.value ) || 5000;
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
calculatorElements.loanAmount.addEventListener('keyup', updateValues, false);
calculatorElements.percentage.addEventListener('keyup', updateValues, false);
calculatorElements.apr.addEventListener('keyup', updateValues, false);
calculatorElements.downPayment.addEventListener('keyup', updateValues, false);
calculatorElements.termInYears.addEventListener('change', updateValues, false);

/**
 * TODO: 
 * Create Porcentage for Downpayment
 * Move this function to CalculatorModule
 * @param {HTMLElement} e - Current Element 
 */
function updateValues(e) {
	// temporary var
	var currentElement = e.currentTarget,
		elementName = currentElement.getAttribute('name');

	// initial values
	var initLoan = calculatorElements.getLoanAmountValue(),
		initDownPay = calculatorElements.getDownpaymentValue(),
		initPercent = calculatorElements.getPercentValue(),
		initApr = calculatorElements.getAprValue(),
		initTermInYears = calculatorElements.getTermInYearsValue();
		

	if ( elementName === 'loan' ) {
		var currentAmmount = parseFloat(currentElement.value);
		initLoan = ((currentAmmount <= 5000 || isNaN( currentAmmount )) ? 5000 : currentAmmount) - initDownPay;

	} else if ( elementName === 'dp' ) {
		var dpToPercent, newPercentAmount;
		var currentDown = parseFloat( currentElement.value );
		initDownPay = (!isNaN( currentDown )) ? currentDown : 0;
		console.log('init downpayment: ' + initDownPay)
		dpToPercent = MortgageCalculatorModule.amountToPercent( initLoan, initDownPay );
		console.log('newPercentAmount: ' + dpToPercent);
		newPercentAmount = (!dpToPercent || dpToPercent === 'undefined') ? initPercent : dpToPercent;
		console.log('newPercentAmount: ' + newPercentAmount);
		MortgageCalculatorModule.setNewValue(newPercentAmount, calculatorElements.percentage);

		initLoan = initLoan - newPercentAmount;

	} else if ( elementName === 'percent' ) {
		/**
		 * TODO:
		 * 	step 1: Get percentage / current amount
		 * 	step 2: Get inputs needed
		 * 	step 3: Check if `currentAmount` is NaN - if so, set it to 0
		 * 	step 4: when user types, set new value on `downpayment` field with currentAmount typed
		 * 	step 5: call/invoke `calculator()` with new values
		 * 	step 6: 
		 */
		var newDownPaymentAfterPercent, percentToDp;
		var currentAmmount = parseFloat( currentElement.value );
		currentAmmount = (isNaN(currentAmmount)) ? 0 : currentAmmount;
		percentToDp = MortgageCalculatorModule.percentToAmount(initLoan, currentAmmount);
		newDownPaymentAfterPercent = (!percentToDp || percentToDp === 'undefined') ? initDownPay : percentToDp;
		MortgageCalculatorModule.setNewValue(newDownPaymentAfterPercent, calculatorElements.downPayment);

		initLoan = initLoan - newDownPaymentAfterPercent;


		console.log(initLoan, initApr, initTermInYears)

	} else if ( elementName === 'apr' ) {
		var currentApr = parseFloat( currentElement.value );
		initApr = (currentApr <= 1 || isNaN( currentApr )) ? 1 : currentApr;
		initLoan = initLoan - initDownPay;
	} else if ( elementName === 'dropdown' ) {
		initLoan = initLoan - initDownPay;
		initApr = initApr || 1;
		initTermInYears = parseInt(10, currentElement.value );
	}

	// testing
	console.log(initLoan, initApr, initTermInYears)

	// update results every keyup
	MortgageCalculatorModule.initCalculator( initLoan, initApr, initTermInYears, calculatorElements.resultDiv );
}


currentHomeValue = checkHomeValue(currentElement);

function checkHomeValue(currentEl) {
	if ( _isEmpty(currentEl.value) && _itMatches(currentEl.value) ) {
		_emptyFieldMsg(currentEl);
		
	} else {
		getNextSibling(currentEl, '.error').style.display = 'none';
		currentEl.parentNode.classList.remove( 'has-error' );
		parseFloat( currentElement.value.replace(/,/g, '') ).toFixed(2)
	}
}