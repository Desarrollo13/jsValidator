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
}
