<?php
//get data from form  
$name = $_POST['name'];
$email= $_POST['email'];
$message= $_POST['Message'];
$to = "welangaieric@gmail.com";
$subject = $_POST['Subject'];
$txt ="Name = ". $name . "\r\n  Email = " . $email . "\r\n Subject = " . $subject . "\r\n  Message =" . $message;
$headers = `From: $email` . "\r\n";
if($email!=NULL){
    mail($to,$subject,$txt,$headers);
}
//redirect
header("Location:  /contact");
?>
<h1>thank you, we will get back to you</h1>