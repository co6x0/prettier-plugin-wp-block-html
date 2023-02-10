const prettier = require("prettier");
const code = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Document</title>
</head>
<body>
  <div>
<p><strong>Hello,</strong>
World.</p>
<!-- This is Comment! -->
<img src="./foo.jpg" alt="test image">
<!-- wp:site-title {"level":2}/ -->
<p>Paragraph</p>
<img src="./foo.jpg" alt="test image">
</div>
<div>
<!-- wp:foo-bar -->
<p>P in wp:1</p>
<!-- / wp:foo-bar -->
</div>
</body>
</html>
`;

const result = prettier.format(code, {
  parser: "custom-html",
  plugins: ["./dist"], // Relative path of root directory
});

console.log(result);
