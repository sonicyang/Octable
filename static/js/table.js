document.getElementById("sidebar_toggle").addEventListener("click", sidebar_toggle, false);

console.log("Hello");

var blocks = document.getElementsByClassName("blo");

for (i = 0; i < blocks.length; i++) {
    blocks[i].addEventListener("dblclick", click_Block, false);
}
