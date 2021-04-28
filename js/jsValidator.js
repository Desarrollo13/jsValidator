class JsValidator {
  status = true;
  errors = [];

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
      // Reiniciar los errores y cambio los status a true
      this.resetValidation();

      // Recorrer cado uno de  los inputs
      this.inputs.forEach((input) => {
        // validar cada input
        this.validateInput(input);
      });
      if (!this.status) {
        // prevenir el envio del formulario
        e.preventDefault();
        console.log("ERROR: Ha ocurrido un error de validacion");
      } else {
        // esto es para fines de prueba
        e.preventDefault();
        console.log("EXITO: el formulario se ha enviado");
      }
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
  setError(input, msg) {
    // cambiar el valor de status
    this.status = false;
    this.setStackError(input, msg);
    this.setErrorMessage(input, msg);
  }
  setStackError(input, msg) {
    // Añade el error a nuestro stack de errores
    this.errors.push({ input: input, msg: msg });
  }
  setErrorMessage(input, msg) {
    // captura el span despues del input y adjunto el error
    let span = input.nextElementSibling;
    span.innerHTML += msg + "<br/>";
  }
  resetValidation() {
    // cambiar el valor al status
    this.status = true;
    this.resetStackError();
    this.resetMessage();
  }
  resetStackError() {
    // pila de errores
    this.errors = [];
  }
  resetMessage() {
    // quitar mensajes de  errores
    let spans = document.querySelectorAll(`#${this.form.id} .error-msg`);
    spans.forEach((span) => {
      span.innerHTML = "";
    });
  }
  // Este metodo es encargado de inicializar todo
  init() {
    this.validateForm();
    return this;
  }
}
JsValidator.prototype._required = function (input) {
  let value = input.value;
  let msg = "Este campo es requrido";
  if (value.trim() === "" || value.length < 1) {
    this.setError(input, msg);
  }
};
JsValidator.prototype._length = function (input) {
  // aca va toda la logica de validacion
};
