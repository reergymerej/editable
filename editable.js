(function ($) {
  $.fn.editable = function (args) {

    var me = this;

    args = $.extend({
      getEditValue: notImplemented,
      onBeforeBlur: notImplemented,
      getNewValue: notImplemented,
      getError: notImplemented,
      errorStyle: {
        position: 'absolute',
        left: 0,
        top: 20,
        color: '#f00',
        backgroundColor: 'inherit'
      },
      onChanged: notImplemented
    }, args);

    var onClickHandler = function (event) {
      var el = $(this),
        editField,
        editValue;


      // only apply to elements without children
      if (el.children().size() === 0) {
        editValue = args.getEditValue.apply(el) || el.html();
        editField = getEditField.call(el, editValue);
        el.after(editField).hide();
        editField.find('input').select();
      }

      event.stopPropagation();
    };

    var onBlurHandler = function (event) {
      var el = $(this),
        val = el.val(),
        newValue,
        oldValue,
        error = args.getError.call(el, val),
        editableField;

      // if (args.onBeforeBlur.call(el, val) === false) {
      if (error) {
        el.next('.error').html(error);
        event.stopImmediatePropagation();
        event.stopPropagation();
        event.preventDefault();
        el.focus().select();
      } else {

        newValue = args.getNewValue(val) || val;
        editableField = el.parent().prev('.editable');
        oldValue = editableField.html();
        editableField.html(newValue).show();
        el.off('blur', onBlurHandler).off('blur', onKeyDownHandler).parent().remove();
        if (oldValue !== newValue) {
          args.onChanged.call(editableField, newValue, oldValue);
        }
      }
    };

    var onKeyDownHandler = function (event) {
      if (event.which === 27) {
        $(this).val($(this).parent().prev('.editable').html()).trigger('blur');
      }
    };

    function getEditField(value) {
      var container,
        input,
        error;

      container = $('<span />', {
        'class': 'editContainer'
      }).css({
        position: 'relative'
      });

      input = $('<input />', {
        value: value,
        placeholder: value
      }).on('blur', onBlurHandler).on('keydown', onKeyDownHandler);

      error = $('<span />', {
        'class': 'error'
      }).css(args.errorStyle);

      container.append(input);
      container.append(error);

      return container;
    }

    function notImplemented() {
      console.log('not implemented');
    }

    this.on('click', '.editable', onClickHandler);

    return this;
  };
}(jQuery));