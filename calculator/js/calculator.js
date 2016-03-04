var CalculatorModule = (function($) {

    var modalContainer;

    var Calculator = {
        runningTotal : '',
        currentVal : '',
        setCurrentVal: false,
        executeAction: '',
        display: '',
        adjustTotals: function(val) {
            if (!this.setCurrentVal) {
                //If this is the first number user has entered then it becomes runningTotal
                //Otherwise it becomes currentVal which will then be used to update runningTotal based on the action picked
                this.runningTotal += val;
            } else {
                //val is a string so we can append to currentVal for multiple digits
                this.currentVal += val;
            }
        },
        clear: function() {
            this.runningTotal = '';
            this.currentVal = '';
            this.executeAction = '';
            this.setCurrentVal = false;
            this.display = '';
        },
        resetCurrentVal: function () {
            this.currentVal = '';
        },
        calculate: function() {
            this.executeAction = '';
            this.currentVal = '';
            return this.runningTotal;
        },
        getAction: function(val) {
            return function(){
                this.runningTotal = eval(this.runningTotal+val+this.currentVal);
            };
        },
        setDisplay: function() {
            return this.display = this.currentVal == '' ? this.runningTotal : this.currentVal;
        }
    };

    function CalculatorHandler(target) {
        var message = $('#message');
        var calculatorDisplay = $('.calculator input[type=text]');
        message.text(''); // reset message content

        var key = $(target);
        var action = key.hasClass('action');
        var instant = key.hasClass('instant');
        var val = key.text();
        if (!action) {
            //No action means the button pressed is a number not an "action"
            Calculator.adjustTotals(val);
        } else if(!instant) {

            //A action button was pressed. Store the action so it can be executed
            if (Calculator.executeAction != '' && Calculator.currentVal != ""){
                Calculator.executeAction();
            }
            // when action called after any number multiple times do nothing
            if (!Calculator.setCurrentVal && Calculator.runningTotal == "") {
                return;
            }
            Calculator.executeAction = Calculator.getAction(val);
            Calculator.setCurrentVal = true;
            Calculator.resetCurrentVal();
        } else {
            //Either = or Clr is clicked. this needs immediate action
            if (Calculator.executeAction != '' && Calculator.currentVal != "") {
                Calculator.executeAction();
            }
            switch (val) {
                case 'cl':
                    Calculator.clear();
                    break;
                case '=':
                    Calculator.calculate();
                    break;
            }
        }
        Calculator.setDisplay();
        // check for NaN result and reset calculator settings also show error message
        if(isNaN(Calculator.display)){
            Calculator.clear();
            message.text('Please enter valid expression.');
        }
        // show result in display
        calculatorDisplay.val(Calculator.display);
    }

    function inputHandler(e){
        if(-1!==$.inArray(e.keyCode,[46,8,9,27,13,110,190])||/65|67|86|88/.test(e.keyCode)
            &&(!0===e.ctrlKey||!0===e.metaKey)
            ||35<=e.keyCode&&40>=e.keyCode
            ||(e.shiftKey||48>e.keyCode||57<e.keyCode)
            &&(96>e.keyCode||105<e.keyCode)){
            e.preventDefault()
        }else{
            var x = e.keyCode;
            $("[data-key="+String.fromCharCode(x)+"]").click();
            e.preventDefault();
        }
    }

    function init() {
        modalContainer = $('.modal-container');
        $(window).on('click', function(e) {
            if ($(modalContainer.selector).hasClass('open')) {
                if ($(e.target).hasClass('modal-container') || $(e.target).hasClass('close-btn')) {
                    close();
                } else if($(e.target).hasClass('key')) {
                    CalculatorHandler(e.target);
                }
            }
        });
        $(document).keyup(function(e) {
            if (e.keyCode == 27) { // 'esc' key close modal
                close();
            } else if(e.keyCode == 13) { // 'enter' key close modal
                $('.equals div').click();
            }
        });
    }

    function close() {
        $(modalContainer.selector).slideUp(200);
        $(modalContainer.selector).removeClass('open');
        $('.calculator input[type=text]').val(''); // reset display content
        Calculator.clear(); // reset calculator
    }

    function open() {
        $(modalContainer.selector).slideDown(200);
        $(modalContainer.selector).addClass('open');
        $('h3.text-center').text('simple calculator');
    }

    return {
        init : init,
        open : open,
        inputHandler : inputHandler
    };

})(jQuery);

CalculatorModule.init();
