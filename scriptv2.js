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

	/**
	 * Round to nearest half.... Currently not in use
	 * @param {Float} percentage - current percentage 
	 * @param {Float} precision - desired nearest 
	 */
	var _roundToNearestHalf = function (percentage, precision) {
		var result = Math.round( percentage / precision ) * precision;
		return result;
	}

	/**
	 * Get new amount from percentage and current home value
	 * @param {Integer} amount - Current Home Value
	 * @param {Float} percent - Current Percentage
	 * @return {Integer} result - new integer value
	 */
	var _percentToAmount = function (amount, percent) {
		var result = ( amount * percent ) / 100;
		return parseInt( result );
	}

	/**
	 * Convert amount and downpayment into Percentage
	 * @param {Integer} amount - Current Home Value
	 * @param {Integer} dp - Current Downpayment
	 * @return {Float} result - new percentage
	 */
	var _amountToPercent = function (amount, dp) {
		// get only 2 decimals
		var result =  parseFloat( (dp / amount) * 100 ).toFixed( 2 );
		
		// if value is greater than 1.00
		// then round it to the nearest 50c
		if ( result >= 1.00 ) {
			return result = Math.round( result / 0.5 ) * 0.5;
		}
		return result;
	}

	/**
	 * function receives an object and mofied an element after evalute the results
	 * @param {Object} opts - values for newloan, newamount, and element to be modified
	 */
	var _setNewValue = function (opts) {
		console.log(opts)
		var newAmount = opts.newAmount.toLocaleString();
		var newLoan = opts.newLoan.toLocaleString();
		// return if no object is received
		if ( typeof opts !== 'object' ) return;

		// if newloan and newamount exists
		if ( opts.newLoan >= 0 ) {
			opts.loanamountElement.value = newLoan;
			opts.newAmountElement.value = newAmount;
		} else {
			opts.newAmountElement.value = newAmount;
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

		if ( e.which >= 37 && e.which <= 40 ) return;
		this.value = this.value.replace(/\D/g, '')
			.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

		/**
		 * TODO: Remove alerts and set errors
		 */
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
			currentHomeValue,
			currentLoanAmount;

		if ( elementName === 'homevalue' ) {

			var  percentageValue;
			currentHomeValue = (_isEmpty(currentElement.value) && _itMatches(currentElement.value)) ? _emptyFieldMsg(currentElement) : (currentElement.nextElementSibling.style.display = 'none', currentElement.parentNode.classList.remove( 'has-error' ), parseFloat( currentElement.value.replace(/,/g, '') ).toFixed(2));
			percentageValue = parseFloat( calculatorElements.getPercentValue() ).toFixed(2);
			amounts.newLoan = currentHomeValue - ((currentHomeValue * percentageValue) / 100);
			amounts.loanamountElement = calculatorElements.loanAmount;
			amounts.newAmount = (currentHomeValue * percentageValue) / 100;
			amounts.newAmountElement = calculatorElements.downPayment;

			console.log(amounts)

			_setNewValue( amounts );
			currentLoanAmount = parseInt(calculatorElements.loanAmount.value.replace(/,/g, ''));
		} else if ( elementName === 'loan' ) {
			/**
			 * TODO: enable Loan Amount Input Field
			 * 	Loan amount is disabled for now
			 */
			var currentAmmount = parseFloat(currentElement.value).toFixed(2);
			initHomeValue = ((currentAmmount <= 5000 || isNaN( currentAmmount )) ? 5000 : currentAmmount) - initDownPay;
			console.log(initLoan)
			

		} else if ( elementName === 'dp' || elementName === 'percent' || elementName === 'homevalue' ) {
			switch(elementName) {
				case 'dp':
					var dpToPercent, currentDown; 
					currentHomeValue = calculatorElements.getHomeValue();
					currentDown = (_isEmpty(currentElement.value) ? _emptyFieldMsg(currentElement) : _checkDownPaymentAmount(currentElement.value, currentHomeValue, currentElement));
					
					initDownPay = (!isNaN( currentDown )) ? currentDown : 0;
					
					amounts.newLoan = currentHomeValue - initDownPay;
					amounts.loanamountElement = calculatorElements.loanAmount;

					dpToPercent = _amountToPercent( currentHomeValue, initDownPay );

					amounts.newAmount = (!dpToPercent || dpToPercent === 'undefined') ? 0 : dpToPercent;
					amounts.newAmountElement = calculatorElements.percentage;


					currentLoanAmount = parseInt(calculatorElements.loanAmount.value.replace(/,/g, ''));
					

					break;
				case 'percent':
					/**
					 * TODO: if Percentage is modified
					 * 	then downpayment
					 * 	then loan amount
					 * 	then results
					 * 	then errors
					 */
					var percentToDp, currentAmmount;
					currentAmmount = (_isEmpty(currentElement.value)) ? _emptyFieldMsg(currentElement) : _checkPercentageAmount(currentElement.value, currentElement);
					currentAmmount = (isNaN(currentAmmount)) ? 0 : currentAmmount;
					currentHomeValue = calculatorElements.getHomeValue();
					percentToDp = _percentToAmount(currentHomeValue, currentAmmount);
					amounts.newAmount = (!percentToDp || percentToDp === 'undefined') ? initDownPay : percentToDp;
					amounts.newAmountElement = calculatorElements.downPayment;

					amounts.newLoan = currentHomeValue - percentToDp;
					amounts.loanamountElement = calculatorElements.loanAmount;

					currentLoanAmount = parseInt(calculatorElements.loanAmount.value.replace(/,/g, ''));
					

					break;
			}
			_setNewValue( amounts );
			currentLoanAmount = parseInt(calculatorElements.loanAmount.value.replace(/,/g, ''));
			

		} else if ( elementName === 'apr' ) {
			/**
			 * TODO: if APR is modified
			 * 	then results
			 */
			var currentApr = (_isEmpty( currentElement.value )) ? _emptyFieldMsg( currentElement ) : _checkAPRAmount( currentElement.value, currentElement );
			initApr = (currentApr <= 1 || isNaN( currentApr )) ? 1 : currentApr;
			currentLoanAmount = parseInt(calculatorElements.loanAmount.value.replace(/,/g, ''));
			
			// console.log(initLoan)
			
		} else if ( elementName === 'dropdown' ) {
			/**
			 * TODO: if Dropdown is modified
			 * 	then results
			 */
			currentLoanAmount = parseInt(calculatorElements.loanAmount.value.replace(/,/g, ''));
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

	/**
	 * Initialize calculator with default values
	 * @param {Integer} p - Current Loan Amount
	 * @param {Float} r - Current APR
	 * @param {Integer} n - Current Term In Years
	 * @param {HTMLElement} resultEl - element to be modified
	 */
	var initCalculator = function (p, r, n, resultEl) {
		var result = _calculateMortgage(p, r, n);
		resultEl.innerHTML = result.toLocaleString('USD', {
			style: 'currency',
			currency: 'USD'
		});
	}

	/*----------------------------------------
		Errors Checker
	 ------------------------------------------*/
	var _isEmpty = function (elVal) {
		var isEmpty = (!elVal || elVal.length < 1) ? true : false;
		return isEmpty;
	}
	var _emptyFieldMsg = function (el) {
		var errorEl = el.nextElementSibling;
		var errorGroup = el.parentNode;
		errorEl.style.display = 'block';
		errorEl.innerHTML = calculatorElements.errors.emptyField;
		errorGroup.classList.add( 'has-error' );
	}
	/**
	 * 
	 * @param {*} downpayment 
	 * @param {*} homevalue 
	 * @param {*} el 
	 */
	var _checkDownPaymentAmount = function (downpayment, homevalue, el) {
		var errorEl = el.nextElementSibling;
		var currentValue = parseInt( downpayment.replace(/,/g, '') );
		var errorGroup = el.parentNode;

		if ( currentValue > homevalue ) {
			errorGroup.classList.add( 'has-error' );
			errorEl.style.display = 'block';
			errorEl.innerHTML = calculatorElements.errors.downPaymentErrors.greaterThanHomeValueMsg;
		} else {
			errorEl.style.display = 'none';
			errorGroup.classList.remove( 'has-error' );
			return currentValue;
		}
	}

	var _checkPercentageAmount = function (percentage, el) {
		var errorEl = el.nextElementSibling;
		var currentValue = parseFloat( percentage ).toFixed( 2 );
		var errorGroup = el.parentNode;

		if ( percentage > 100 ) {
			errorGroup.classList.add( 'has-error' );
			errorEl.style.display = 'block';
			errorEl.innerHTML = calculatorElements.errors.percentErrors.greaterThanOneHundred;
		} else {
			errorEl.style.display = 'none';
			errorGroup.classList.remove( 'has-error' );
			return currentValue;
		}
	}

	var _checkAPRAmount = function (apr, el) {
		var errorEl = el.nextElementSibling;
		var currentValue = parseFloat( apr ).toFixed( 2 );
		var errorGroup = el.parentNode;

		if ( apr > 50 ) {
			errorGroup.classList.add( 'has-error' );
			errorEl.style.display = 'block';
			errorEl.innerHTML = calculatorElements.errors.aprErrors.greaterThanFifty;
		} else {
			errorEl.style.display = 'none';
			errorGroup.classList.remove( 'has-error' );
			return currentValue;
		}
	}

	var _itMatches = function (str) {
		var regex = /^\d+$/g;
		var result = regex.test( str );
		if ( result ) {
			return result;
		} else {

			return;
		}
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
		return parseInt(this.homeValue.value.replace(/,/g, '')) || 0;
	},
	getLoanAmountValue: function () {
		return parseFloat( this.loanAmount.value.replace(/,/g, '') ).toFixed( 2 ) || 0;
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
		return parseFloat( this.downPayment.value.replace(/,/g, '') ).toFixed( 2 ) || 0;
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
		homevalueErrors: {
			greaterThanFiveThousandMsg: 'Value should be greater than 5,000'
		},
		downPaymentErrors: {
			greaterThanHomeValueMsg: 'Downpayment is bigger than Homevalue'
		},
		percentErrors: {
			greaterThanOneHundred: 'Value should not exceed 100%'
		},
		aprErrors: {
			greaterThanFifty: 'Value should\'nt exceed 50% of APR'
		},
		emptyField: 'field should\'nt be empty'
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
 * TODO:
 * 	change `keyup` listener to `keypress` or something to track only numbers
 * 
 * Event Listeners for each input
 * 
 */
calculatorElements.homeValue.addEventListener('keyup', MortgageCalculatorModule.updateValues, false);
calculatorElements.loanAmount.addEventListener('keyup', MortgageCalculatorModule.updateValues, false);
calculatorElements.percentage.addEventListener('keyup', MortgageCalculatorModule.updateValues, false);
calculatorElements.apr.addEventListener('keyup', MortgageCalculatorModule.updateValues, false);
calculatorElements.downPayment.addEventListener('keyup', MortgageCalculatorModule.updateValues, false);
calculatorElements.termInYears.addEventListener('change', MortgageCalculatorModule.updateValues, false);