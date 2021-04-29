class JsValidator {
  status = true;
  errors = [];
  via = "http";
  validators = {
    minLength: 3,
    maxLength: 255,
  };
  msg = {
    required: `Este campo es requirido`,
    minLength: `Longitud no valida. Minimo __minLength__ caracteres.`,
    maxLength: `Longitud no valida. Maximo __maxLength__ caracteres.`,
    email: `El campo de email no es valido`,
    integer: `Por favor coloca un numero entero`,
    alphanumeric: `Solo se permite letras y numeros sin espacios`,
    url: `Escribe una url valida.Indica el protocolo con http// o https//`,
  };

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
  setAjax() {
    this.via = "ajax";
    return this;
  }
  setHttp() {
    this.via = "http";
    return this;
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
        // evaluar si se debe mandar por ajax o http
        if (this.via == "ajax") {
          // esto es para fines de prueba
          e.preventDefault();
          this.submitHandler();
        } else {
          // solo para fines demostrativos
          e.preventDefault();
          console.log("se ha enviado con navegador");
        }
      }
    });
  }
  validateInputs() {
    this.inputs.forEach((input) => {
      input.addEventListener("input", (e) => {
        this.resetValidation();
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
  submitHandler() {
    let data = new FormData(this.form);
    fetch(this.form.action, {
      method: this.form.method,
      body: data,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }
  // Este metodo es encargado de inicializar todo
  init() {
    this.validateForm();
    this.validateInputs();
    return this;
  }
}
JsValidator.prototype._required = function (input) {
  let value = input.value;
  let msg = this.msg.required;
  if (value.trim() === "" || value.length < 1) {
    this.setError(input, msg);
  }
};
JsValidator.prototype._length = function (input) {
  let value = input.value;
  let inputLength = value.length;
  let minLength =
    input.dataset.validators_minlength !== undefined
      ? Number(input.dataset.validators_minlength)
      : this.validators.minLength;
  let maxLength =
    input.dataset.validators_maxlength !== undefined
      ? Number(input.dataset.validators_maxlength)
      : this.validators.maxLength;
  let msg;

  if (inputLength < minLength) {
    msg = this.msg.minLength.replace("__minLength__", minLength);
    this.setError(input, msg);
  }
  if (inputLength > maxLength) {
    msg = this.msg.maxLength.replace("__maxLength__", maxLength);
    this.setError(input, msg);
  }
};
JsValidator.prototype._email = function (input) {
  let value = input.value;
  let msg = this.msg.email;
  let pattern = new RegExp(
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i
  );
  if (!pattern.test(value) && value.trim() != "") {
    this.setError(input, msg);
  }
};
JsValidator.prototype._integer = function (input) {
  let value = input.value;
  let msg = this.msg.integer;

  let pattern = new RegExp(/^[0-9]+$/);
  if (!pattern.test(value) && value.trim() != "") {
    this.setError(input, msg);
  }
};
JsValidator.prototype._alphanumeric = function (input) {
  let value = input.value;
  let msg = this.alphanumeric;
  let pattern = new RegExp(/^[a-zA-Z0-9]+$/);
  if (!pattern.test(value) && value.trim() != "") {
    this.setError(input, msg);
  }
};
JsValidator.prototype._url = function (input) {
  // En primer lugar vamos a recuperar el valor del input
  let value = input.value;

  // Definir el mensaje de error
  let msg = this.msg.url;

  // expresión regular para validar url
  var pattern = new RegExp(
    /^(https?|s?ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i
  );

  // En caso de que la validación falle mandar error.
  if (!pattern.test(value) && value.trim() != "") {
    this.setError(input, msg);
  }
};
