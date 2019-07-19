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
	};
	/**
	 * Convert years into months
	 * @param {Number} year - year form input field 
	 * @return Months in Numbers
	 */
	var _yearsToMonth = function( year ) {
		return year * 12;
	};
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
	};

	/**
	 * Round to nearest half.... Currently not in use
	 * @param {Float} percentage - current percentage 
	 * @param {Float} precision - desired nearest 
	 */
	var _roundToNearestHalf = function (percentage, precision) {
		var result = Math.round( percentage / precision ) * precision;
		return result;
	};

	/**
	 * Get new amount from percentage and current home value
	 * @param {Integer} amount - Current Home Value
	 * @param {Float} percent - Current Percentage
	 * @return {Integer} result - new integer value
	 */
	var _percentToAmount = function (amount, percent) {
		var result = ( amount * percent ) / 100;
		return parseInt( result );
	};

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
	};

	/**
	 * function receives an object and mofied an element after evalute the results
	 * @param {Object} opts - values for newloan, newamount, and element to be modified
	 */
	var _setNewValue = function (opts) {
		var newAmount = opts.newAmount.toLocaleString(),
			newLoan = opts.newLoan.toLocaleString();
		// return if no object is received
		if ( typeof opts !== 'object' ) return;

		// if newloan and newamount exists
		if ( opts.newLoan >= 0 ) {
			if ( opts.newAmountElement !== document.querySelector( 'input#percent' ) || opts.newAmount !== 0) {
				opts.loanamountElement.value = newLoan;
				opts.newAmountElement.value = newAmount;
			} else {
				opts.newAmountElement.value = '';
				opts.newAmountElement.setAttribute( 'placeholder', 0 );
			}
		} else {
			opts.newAmountElement.value = newAmount;
		}
	};
	/**
	 * check if homevalue has value
	 * @param {HTMLElement} currentEl - current element
	 * @return number
	 */
	var _checkHomeValue = function (currentEl) {
		if ( _isEmpty(currentEl.value) && !_itMatches(currentEl.value) ) {
			_emptyFieldMsg(currentEl);
			return currentEl.value = 0;
		} else {
			getNextSibling(currentEl, '.mortgage-inputs--error').style.display = 'none';
			currentEl.parentNode.classList.remove( 'has-error' );
			return parseFloat( currentEl.value.replace(/,/g, '') ).toFixed(2);
		}
	};
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
			currentHomeValue = _checkHomeValue( currentElement );
			percentageValue = parseFloat( calculatorElements.getPercentValue() ).toFixed(2);
			amounts.newLoan = currentHomeValue - ((currentHomeValue * percentageValue) / 100);
			amounts.loanamountElement = calculatorElements.loanAmount;
			amounts.newAmount = (currentHomeValue * percentageValue) / 100;
			amounts.newAmountElement = calculatorElements.downPayment;

			_setNewValue( amounts );
			currentLoanAmount = parseInt(calculatorElements.loanAmount.value.replace(/,/g, ''));

		} else if ( elementName === 'loan' ) {
			/**
			 * TODO: enable Loan Amount Input Field
			 * 	Loan amount is disabled for now
			 */
			var currentAmmount = parseFloat(currentElement.value).toFixed(2);
			initHomeValue = ((currentAmmount <= 5000 || isNaN( currentAmmount )) ? 5000 : currentAmmount) - initDownPay;

		} else if ( elementName === 'dp' || elementName === 'percent' || elementName === 'homevalue' ) {
			switch(elementName) {
				case 'dp':
					var dpToPercent, currentDown; 
					currentHomeValue = calculatorElements.getHomeValue();
					currentDown = (_isEmpty(currentElement.value) ? _replaceWithZero( currentElement ) : _checkDownPaymentAmount(currentElement.value, currentHomeValue, currentElement));
					
					initDownPay = (!isNaN( currentDown )) ? currentDown : 0;
					
					amounts.newLoan = currentHomeValue - initDownPay;
					amounts.loanamountElement = calculatorElements.loanAmount;

					dpToPercent = _amountToPercent( currentHomeValue, initDownPay );
					if ( dpToPercent < "0.2" ) {
						dpToPercent = 0;
					}

					amounts.newAmount = (!dpToPercent || dpToPercent === 'undefined') ? 0 : dpToPercent;
					amounts.newAmountElement = calculatorElements.percentage;

					currentLoanAmount = parseInt(calculatorElements.loanAmount.value.replace(/,/g, ''));
					break;
				case 'percent':
					var percentToDp, currentAmmount;
					// if current value is greater than 100 replace it with 100
					if ( currentElement.value.replace(/,/g, '') > 100 ) {
						currentElement.value = 100;
					}
					
					currentAmmount = (_isEmpty(currentElement.value)) ? _replaceWithZero( currentElement ) : _checkPercentageAmount(currentElement.value, currentElement);
					currentAmmount = (isNaN(currentAmmount)) ? 0 : currentAmmount;
					currentHomeValue = calculatorElements.getHomeValue();
					percentToDp = _percentToAmount(currentHomeValue, currentAmmount);
					amounts.newAmount = ( percentToDp === 'undefined') ? initDownPay : percentToDp;
					amounts.newAmountElement = calculatorElements.downPayment;

					amounts.newLoan = currentHomeValue - percentToDp;
					amounts.loanamountElement = calculatorElements.loanAmount;

					currentLoanAmount = parseInt(calculatorElements.loanAmount.value.replace(/,/g, ''));
					break;
			}
			_setNewValue( amounts );
			currentLoanAmount = parseInt(calculatorElements.loanAmount.value.replace(/,/g, ''));

		} else if ( elementName === 'apr' ) {
			var currentApr = (_isEmpty( currentElement.value )) ? _replaceWithZero( currentElement ) : _checkAPRAmount( currentElement.value, currentElement );
			initApr = (currentApr <= 1 || isNaN( currentApr )) ? 1 : currentApr;
			currentLoanAmount = parseInt(calculatorElements.loanAmount.value.replace(/,/g, ''));

		} else if ( elementName === 'dropdown' ) {
			currentLoanAmount = parseInt( calculatorElements.loanAmount.value.replace(/,/g, '') );
			currentLoanAmount = (!currentLoanAmount || currentLoanAmount === 'undefined' || isNaN( currentLoanAmount )) ? _emptyFieldMsg( currentElement ) : currentLoanAmount;
			initApr = initApr || 1;
			initTermInYears = parseInt(10, currentElement.value );
		}
		// update results every keyup
		MortgageCalculatorModule.initCalculator( currentLoanAmount, initApr, initTermInYears, calculatorElements.resultDiv );
	};

	/**
	 * Initialize calculator with default values
	 * @param {Integer} p - Current Loan Amount
	 * @param {Float} r - Current APR
	 * @param {Integer} n - Current Term In Years
	 * @param {HTMLElement} resultEl - element to be modified
	 */
	var initCalculator = function (p, r, n, resultEl) {
		var result, formatter;
		// format to US-Currency
		formatter = new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'USD',
			minimumFractionDigits: 2
		});
		// results from calculator
		result = _calculateMortgage(p, r, n);

		// display results
		resultEl.value = formatter.format(result);
	};

	/**
	 * get sibling that matches selector
	 * @param {HTMLElement} el - current element
	 * @param {HTMLElement} selector - target element
	 */
	var getNextSibling = function (el, selector) {
		// get the next sibling element
		var sibling = el.nextElementSibling;

		// if there's no selector, return the first sibling
		if ( !selector ) return sibling;

		// if the sibling matches our selector, use it
		// if not, jump to th enext sibling and continue the loop
		while ( sibling ) {
			if ( sibling.matches(selector) ) {
				return sibling;
			}
			sibling = sibling.nextElementSibling;
		}
	}
	/*----------------------------------------
		Errors Checker
	 ------------------------------------------*/
	 /**
	  * check if current element value is empty
	  * @param {HTMLElement} elVal - current element value
	  * @return {Boolean} true/false
	  */
	var _isEmpty = function (elVal) {
		var isEmpty = (!elVal || elVal.length < 1) ? true : false;
		return isEmpty;
	}
	/**
	 * apply errors if value is wrong format/empty etc.
	 * @param {HTMLElement} el - current element
	 * @return {Number} 0 - to keep flow
	 */
	var _emptyFieldMsg = function (el) {
		var errorEl = getNextSibling( el, '.mortgage-inputs--error' );
		var errorGroup = el.parentNode;
		errorEl.style.display = 'block';
		errorEl.innerHTML = calculatorElements.errors.emptyField;
		errorGroup.classList.add( 'has-error' );
		return 0;
	}
	/**
	 * if value is 0, remove value and use placeholder
	 * @param {HTMLElement} el - current element
	 */
	var _replaceWithZero = function (el) {
		// if current value is less than 0 replace it with 0 placeholder and set currentAmount to 0
		if ( el.value < 0 || !el.value || el.value === '0' ) {
			el.value = '';
			el.setAttribute( 'placeholder', 0 );
		}
	}
	/**
	 * check for downpayment errors
	 * @param {Number} downpayment - current downpayment
	 * @param {Number} homevalue - current homevalue
	 * @param {HTMLElement} el - current element
	 */
	var _checkDownPaymentAmount = function (downpayment, homevalue, el) {
		var errorEl = getNextSibling( el, '.mortgage-inputs--error' );
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
	/**
	 * check for percentage errors
	 * @param {Number} percentage - current percentage
	 * @param {HTMLElement} el - current element
	 */
	var _checkPercentageAmount = function (percentage, el) {
		var errorEl = getNextSibling( el, '.mortgage-inputs--error' );
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
	/**
	 * check for APR Errors
	 * @param {Number} apr - current apr
	 * @param {HTMLElement} el - current element
	 */
	var _checkAPRAmount = function (apr, el) {
		var errorEl = getNextSibling( el, '.mortgage-inputs--error' );
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
	/**
	 * check if element matches digits only
	 * @param {String} str - input string number
	 */
	var _itMatches = function (str) {
		var regex = /^\d+$/g;
		var result = regex.test( str );
		if ( result ) {
			return result;
		} else {
			return;
		}
	}

	// accessors
	return {
		initCalculator: initCalculator,
		updateValues: updateValues,
		getNextSibling: getNextSibling
	}
})();