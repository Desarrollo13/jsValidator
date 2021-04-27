class JsValidator {
  constructor(formid) {
    //   llamo a los metodos
    this.setForm(formid);
    this.setInputs();
    // creo el span
    this.parseInputs();
  }
  setForm(formid) {
    this.form = document.getElementById(formid);
  }
  setInputs() {
    this.inputs = document.querySelectorAll(`#${this.form.id} .jsValidator`);
  }
  //   analisis de los imputs
  parseInputs() {
    this.inputs.forEach((input) => {
      this.appendErrorsTag(input);
    });
  }
  //   adjunta error
  appendErrorsTag(input) {
    //   selecciono el padre del input
    let parent = input.parentNode;
    // crea la etiqueta span
    let span = document.createElement("span");
    // asigna el atirbuto class error
    span.setAttribute("class", "error-msg");
    // aca adjunto el span
    parent.appendChild(span);
  }
  validateForm() {
    // creamoa una escucha al metodo submit
    this.form.addEventListener("submit", (e) => {
      // Esto es provicional
      e.preventDefault();

      this.inputs.forEach((input) => {
        this.validateInput(input);
      });
    });
  }
  // Este metodo va validar nuestros input
  validateInput(input) {
    let validators = input.dataset.validators; //vale required length
    if (validators != undefined) {
      validators = validators.split(" ");
      validators.forEach((validator) => {
        // si el validador es required => su método de validacion seria: _required(input)
        // si el validador es length => su método de validacion seria: _length(input)

        this[`_${validator}`](input);
      });
    }
  }
}
JsValidator.prototype._required = function (input) {
  // aca va toda la logica de validacion
  console.log("se esta validando un input para required");
};
JsValidator.prototype._length = function (input) {
  // aca va toda la logica de validacion
  console.log("se esta validando un input para length");
};
