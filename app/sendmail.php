<?php header("Content-type: text/html; charset=utf-8");
	print_r($_POST);
	if(isset($_POST)) {
		$from = htmlspecialchars("geometriadizaina.ru");
		$to = htmlspecialchars("geometriadizaina@mail.ru");
		$subject = htmlspecialchars("Заявка с сайта");
		$message = htmlspecialchars($_POST["phone"]." ".$_POST["name"]." ".$_POST["email"]);
		$subject = "=?utf-8?B?".base64_encode($subject)."?=";
		$headers = "From: $from\r\nReply-to: $from\r\nContent-type: text/plain; charset=utf-8\r\n";
		if (strlen($message) > 2) {
			mail($to, $subject, $message, $headers);
			echo('Заявка отправлена!');
		} else {
			echo('Ошибка отправки: сообщение пустое!');
		}
	}
?>