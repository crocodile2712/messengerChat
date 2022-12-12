class Regexs {
  public number = /^[0-9]*$/;
  public phoneNumber = /^\d{10}$/;
  public optionalEmail = /^(?:[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4})?$/i;
  public email = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,63}$/i;
  public disposition = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
  public decimal = /^\d+\.?\d+$/;
  public twoDecimalPlaces = /^[0-9]*(\.[0-9]{1,2})?$/;
  public containAlphaLetter = /^(?:(?=.*[a-z])(?=.*[A-Z]).*)$/;
  public containSpecialChar = /[-!$%^&*()_+|~=`{}[\]:/;<>?,.@#]/;
  public containNumber = /\d/;
  public notContainSpace = /^\S*$/u;
}

export default new Regexs();
