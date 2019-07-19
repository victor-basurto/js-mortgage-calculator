// var $calculatorSection = $( '.mortgage-calculator-section-container' );
// $calculatorSection.click(function (evt) {
// 	var $this = $( this );
// 	evt.preventDefault();
// 	$( 'html, body' ).animate({
// 		scrollTop: $($this.attr( 'href' )).offset().top
// 	}, 500);
// });
/**
 * elements and values
 */
var formSection = document.querySelector('.form-section');
if ( formSection ) {
	var calculatorElements = {
		formSection: document.querySelector( '.form-section' ),	// reference to form
		homeValue: document.getElementById( 'home-value' ),
		loanAmount: document.getElementById( 'amount' ),
		downPayment: document.getElementById( 'downPayment' ), // default 20%
		percentage: document.getElementById( 'percent' ),
		apr: document.getElementById( 'interestApr' ),
		termInYears: document.getElementById( 'termInYears' ),
		resultDiv: document.getElementById( 'results' ),
		getHomeValue: function() {
			return parseFloat(this.homeValue.value.replace(/,/g, '')).toFixed( 2 ) || 0;
		},
		getLoanAmountValue: function () {
			return parseFloat( this.loanAmount.value.replace(/,/g, '') ).toFixed( 2 ) || 0;
		},
		getLoanAmountCalcValue: function () {
			var result =  this.getHomeValue() - ((this.getHomeValue() * this.getPercentValue() ) / 100);
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
	 * Purposes of this Demo
	 * when page loads, re-format values
	 */
	document.onreadystatechange = function () {
		if ( document.readyState === 'interactive' ) {
		    // var $homeValueInput = document.querySelector('#home-value');
		    // $homeValueInput.value = $('.calcInfo').attr('data-homeprice');
			
			// initial values
			var initialHV = calculatorElements.homeValue,
				initialLV = calculatorElements.loanAmount,
				initialDPV = calculatorElements.downPayment;
	
			// formatted values
			initialHV.value = initialHV.value.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
			initialLV.value = initialLV.value.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
			initialDPV.value = initialDPV.value.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
		}
	}
	
	/**
	 * display results when typing
	 */
	calculatorElements.homeValue.addEventListener('keyup', MortgageCalculatorModule.updateValues, false);
	calculatorElements.loanAmount.addEventListener('keyup', MortgageCalculatorModule.updateValues, false);
	calculatorElements.percentage.addEventListener('keyup', MortgageCalculatorModule.updateValues, false);
	calculatorElements.apr.addEventListener('keyup', MortgageCalculatorModule.updateValues, false);
	calculatorElements.downPayment.addEventListener('keyup', MortgageCalculatorModule.updateValues, false);
	calculatorElements.termInYears.addEventListener('change', MortgageCalculatorModule.updateValues, false);
}