<?php

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    die("Invalid request.");
}

if (!isset($_FILES["resume"])) {
    die("No resume uploaded.");
}

$file = $_FILES["resume"];

$allowedExtensions = ["pdf", "doc", "docx"];
$fileExtension = strtolower(
    pathinfo($file["name"], PATHINFO_EXTENSION)
);

$maxSize = 5 * 1024 * 1024; // 5 MB

if (!in_array($fileExtension, $allowedExtensions)) {
    die("Only PDF, DOC and DOCX files are allowed.");
}

if ($file["size"] > $maxSize) {
    die("Resume size must be less than 5 MB.");
}

if ($file["error"] !== UPLOAD_ERR_OK) {
    die("There was an error uploading the resume.");
}

$uploadDirectory = "uploads/";

if (!is_dir($uploadDirectory)) {
    mkdir($uploadDirectory, 0777, true);
}

$fileName =
    time() . "_" .
    preg_replace("/[^A-Za-z0-9._-]/", "_", $file["name"]);

$destination = $uploadDirectory . $fileName;

if (move_uploaded_file($file["tmp_name"], $destination)) {

    echo "
    <h2>Resume Uploaded Successfully!</h2>
    <p>Your resume has been received.</p>
    <a href='index.html'>Back to Assessment</a>
    ";

} else {

    echo "
    <h2>Upload Failed</h2>
    <p>Please try again later.</p>
    <a href='index.html'>Back to Assessment</a>
    ";
}

?>