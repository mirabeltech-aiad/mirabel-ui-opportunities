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
      (messageWindow.MMClientMessage && messageWindow.MMClientMessage[code]) || (code=="MMCurrency" && "$")
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




export const getRepColor = (Name, distinctReps) => {
  const repColorCodes = ["#469FBB", "#f80c9c", "#FF5733", "#C81549", "#0B831C", "#A8B41C", "#0C475A", "#900C3F", "#27AE60", "#9064DF"];
  
  // Split name by space or comma and get first part
  const nameParts = Name.split(/[\s,]+/);
  const firstName = nameParts[0] || '';
  
  // Generate hash from first name
  let hash = 0;
  for (let i = 0; i < firstName.length; i++) {
    const char = firstName.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  // Get color index based on hash
  const colorIndex = Math.abs(hash) % repColorCodes.length;
  return repColorCodes[colorIndex];
};

// Get initials from name
export const getInitials = (name) => {
  if (!name) return '';
  
  const nameParts = name.split(/[\s,]+/).filter(part => part.length > 0);
  
  if (nameParts.length === 1) {
    // Single name - take first 2 characters
    return nameParts[0].substring(0, 2).toUpperCase();
  } else {
    // Multiple names - take first character of first two parts
    return (nameParts[0].charAt(0) + nameParts[1].charAt(0)).toUpperCase();
  }
};

// Return rounded circle div with initials based on name
export const getRepAvatar = (name, size = 'md', className = '') => {
  const color = getRepColor(name);
  const initials = getInitials(name);
  
  // Size variants
  const sizeClasses = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-lg'
  };
  
  const sizeClass = sizeClasses[size] || sizeClasses.md;
  
  return `
    <div 
      class="inline-flex items-center justify-center rounded-full font-semibold text-white ${sizeClass} ${className}"
      style="background-color: ${color}"
      title="${name}"
    >
      ${initials}
    </div>
  `;
};