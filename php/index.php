<?php
// Conexión a la base de datos en la nube
$servername = "tu_servidor_remoto"; // Cambia esto por la dirección de tu servidor en la nube
$username = "tu_usuario_remoto"; // Cambia esto por tu usuario de la base de datos en la nube
$password = "tu_contraseña_remota"; // Cambia esto por tu contraseña de la base de datos en la nube
$dbname = "mi_base_de_datos_remota"; // Cambia esto por el nombre de tu base de datos en la nube

$conn = new mysqli($servername, $username, $password, $dbname);

// Verificar conexión
if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}

// Procesar el formulario de inicio de sesión
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $usuario = $_POST['usuario'];
    $contrasena = $_POST['contrasena'];

    // Consulta para verificar el usuario
    $sql = "SELECT * FROM usuarios WHERE usuario = ? AND contrasena = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ss", $usuario, $contrasena);
    $stmt->execute();
    $resultado = $stmt->get_result();

    if ($resultado->num_rows > 0) {
        echo "Inicio de sesión exitoso. ¡Bienvenido, $usuario!";
    } else {
        echo "Usuario o contraseña incorrectos.";
    }

    $stmt->close();
}

$conn->close();
?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Inicio de Sesión</title>
</head>
<body>
    <h1>Iniciar Sesión</h1>
    <form method="POST" action="">
        <label for="usuario">Usuario:</label>
        <input type="text" id="usuario" name="usuario" required>
        <br>
        <label for="contrasena">Contraseña:</label>
        <input type="password" id="contrasena" name="contrasena" required>
        <br>
        <button type="submit">Iniciar Sesión</button>
    </form>
</body>
</html>