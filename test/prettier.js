const prettier = require("prettier");
const code = `
<article>
<p><strong>Hello,</strong>
World.</p>
<!-- This is Comment! -->
<img src="./foo.jpg" alt="test image">
<!-- wp:site-title {"level":2}/ -->
<p>Paragraph</p>
<img src="./foo.jpg" alt="test image">

<section>
<!-- wp:group -->
<div>
  <!-- wp:group {"align":"full","style":{"spacing":{"padding":{"top":"2em","right":"2em","bottom":"2em","left":"2em"}}},"backgroundColor":"vivid-cyan-blue"} -->
  <!-- wp:heading {"level":3,"style":{"color":{"text":"#ff7e7e"}}} -->
  <p>P in wp:1</p>
  <!-- /wp:heading -->
  <!-- /wp:group -->
</div>
<!-- / wp:group -->
</section>
</article>
`;

const result = prettier.format(code, {
  parser: "custom-html",
  plugins: ["./dist"], // Relative path of root directory
});

console.log(result);
