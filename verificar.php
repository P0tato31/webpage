<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Acceso al CV</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <h1>Introduce el código</h1>
  <form method="POST" action="verificar.php">
    <input type="password" name="codigo" placeholder="Código de acceso" required>
    <button type="submit">Entrar</button>
  </form>
</body>
</html>

<?php
$codigoCorrecto = "5968";

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $codigoIngresado = $_POST['codigo'];

    if ($codigoIngresado === $codigoCorrecto) {
        header("Location: cv/curriculum-vitae.html");
        exit;
    } else {
        echo "<p style='color:red;'>Código incorrecto. <a href='acceso.php'>Volver a intentar</a></p>";
    }
} else {
    header("Location: acceso.php");
    exit;
}
?>