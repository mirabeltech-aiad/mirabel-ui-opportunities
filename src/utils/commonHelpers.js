export const getTopPath = () => {
    return window.location.origin;
    // what it returns is the top path of the url
}

export const numberWithCommas = function (number) {
    if (!number) number = 0;
    return number.toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  };
  
  export const decimalWithCommas = function (number = 0, minimumFractionDigits = 2, maximumFractionDigits = 2) {
    if (!number) number = 0;
    if (maximumFractionDigits < minimumFractionDigits) maximumFractionDigits = minimumFractionDigits;
    return number.toLocaleString(undefined, {
      minimumFractionDigits: minimumFractionDigits,
      maximumFractionDigits: maximumFractionDigits,
    });
  };
  
  export const isValidFileName = (filename) => {
    var regex = /^[ A-Za-z0-9_!.~'(){}\[\]&\-]*$/g;
    if (regex.test(filename)) {
      return true;
    }
    else {
      return false;
    }
  }
  export const isWindowTopAccessible = function () {
  try {
    const location = window.top.location.href; // eslint-disable-line no-unused-vars
    return true;
  } catch (e) {
    return false;
  }
};
  export const getTextFromHTML = function (htmlContent) {
    let a = document.createElement("span");
    a.innerHTML = htmlContent;
    return a.textContent;
  };
  export const getGlobalMessage = function (code) {
    // Used `window.top` instead of `window` is to reuse `MMClientMessage` loaded in `Home.aspx` page
    const messageWindow = isWindowTopAccessible() ? window.top : window;
    return (
      (messageWindow.MMClientMessage && messageWindow.MMClientMessage[code]) || ""
    );
  };
  export const formatAmountWithCurrency = function (
    amount,
    isFormatWithDecimal = false
  ) {
    const currencySymbol = getTextFromHTML(getGlobalMessage("MMCurrency"));
    const _formattedAmount = isFormatWithDecimal ? decimalWithCommas(Math.abs(amount)) : numberWithCommas(Math.abs(amount));
    const isEuro = currencySymbol?.trim() === "€";
    const _amountWithSymbol = isEuro ? `${_formattedAmount}${currencySymbol}` : `${currencySymbol}${_formattedAmount}`;
    return amount < 0 ? `(${_amountWithSymbol})` : _amountWithSymbol;
  };
  
  export const formatDecimalAmountWithCurrency = function (
    amount,
    currencySymbol = "",
    acceptNegative = false,
    minimumFractionDigits = 2
  ) {
    amount = typeof amount === "string" ? parseFloat(amount) : amount;
    // Get the currency symbol
    const symbol = currencySymbol !== ""
      ? currencySymbol
      : getTextFromHTML(getGlobalMessage("MMCurrency"));
    // Check if symbol is Euro (€)
    const isEuro = symbol?.trim() === "€";
    if (amount < 0 && acceptNegative == false) {
      // return `(${
      //   currencySymbol !== ""
      //     ? currencySymbol
      //     : getTextFromHTML(getGlobalMessage("MMCurrency"))
      // }${decimalWithCommas(Math.abs(amount), minimumFractionDigits)})`;
      return isEuro
        ? `(${decimalWithCommas(Math.abs(amount), minimumFractionDigits)}${symbol})`
        : `(${symbol}${decimalWithCommas(Math.abs(amount), minimumFractionDigits)})`;
    } else if (amount < 0 && acceptNegative) {
      // return `-${
      //   currencySymbol !== ""
      //     ? currencySymbol
      //     : getTextFromHTML(getGlobalMessage("MMCurrency"))
      // }${decimalWithCommas(Math.abs(amount), minimumFractionDigits)}`;
      return isEuro
        ? `-(${decimalWithCommas(Math.abs(amount), minimumFractionDigits)}${symbol})`
        : `-(${symbol}${decimalWithCommas(Math.abs(amount), minimumFractionDigits)})`;
    } else {
      // return `${
      //   currencySymbol !== ""
      //     ? currencySymbol
      //     : getTextFromHTML(getGlobalMessage("MMCurrency"))
      // }${decimalWithCommas(amount, minimumFractionDigits)}`;
      return isEuro
        ? `${decimalWithCommas(amount, minimumFractionDigits)}${symbol}`
        : `${symbol}${decimalWithCommas(amount, minimumFractionDigits)}`;
    }
  };
  
  export const formatDecimalAmountwithNoCurrency = function (amount) {
    amount = typeof amount === "string" ? parseFloat(amount) : amount;
    if (amount < 0) {
      return `(${decimalWithCommas(Math.abs(amount))})`;
    } else {
      return `${decimalWithCommas(amount)}`;
    }
  };
  
  export const isMobile =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
  
  // Does not include ipad.
  export const isMobileOnly =
    /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );