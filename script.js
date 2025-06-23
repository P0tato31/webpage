function pedirCodigo() {
    const codigoCorrecto = "5968";
    const intento = prompt("Introduce el código de acceso:");

    if (intento === codigoCorrecto) {
      window.location.href = "cv/curriculum-vitae.html";
    } else {
      alert("Código incorrecto. Acceso denegado.");
    }
  }