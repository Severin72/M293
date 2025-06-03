<?php
$empfaenger = "kellerseverin@gmx.ch"; 
$betreff     = "Neue Kontaktanfrage von deiner Webseite";

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    
    $absenderEmail = filter_var(trim($_POST["email"]), FILTER_SANITIZE_EMAIL);
    $bemerkung     = trim($_POST["bemerkung"]);

    if ( empty($absenderEmail) || !filter_var($absenderEmail, FILTER_VALIDATE_EMAIL) ) {
        echo "Ungültige Absender-Email. Bitte <a href='kontakt.html'>erneut versuchen</a>.";
        exit;
    }
    if ( empty($bemerkung) ) {
        echo "Bitte eine Nachricht eingeben. <a href='kontakt.html'>Zurück zum Formular</a>.";
        exit;
    }

    $nachricht  = "Du hast eine neue Kontaktanfrage erhalten:\r\n\r\n";
    $nachricht .= "Absender-E-Mail: " . $absenderEmail . "\r\n";
    $nachricht .= "Nachricht:\r\n" . $bemerkung . "\r\n";

    $headers  = "From: webmaster@" . $_SERVER["HTTP_HOST"] . "\r\n";
    $headers .= "Reply-To: " . $absenderEmail . "\r\n";
    $headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

    $erfolg = mail($empfaenger, $betreff, $nachricht, $headers);

    if ($erfolg) {
        echo "<p>Danke! Deine Nachricht wurde erfolgreich gesendet.<br>";
        echo "<a href='kontakt.html'>Zurück zur Kontaktseite</a></p>";
    } else {
        echo "<p>Leider gab es einen Fehler beim Senden. Bitte versuche es später erneut.</p>";
    }
} else {
    echo "<p>Ungültiger Aufruf. <a href='kontakt.html'>Zurück zum Formular</a>.</p>";
}
?>
