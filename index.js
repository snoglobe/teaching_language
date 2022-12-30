let output = document.getElementById("output");
let input = document.getElementById("code");
function run() {
    output.innerHTML = "";
    let text = input.value;
    initLexer(text);
    scanTokens();
    initParser(lexer.tokens);
    let ast = program();
    for (let i = 0; i < ast.length; i++) {
        execute(ast[i]);
    }
}